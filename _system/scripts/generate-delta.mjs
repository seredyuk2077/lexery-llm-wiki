#!/usr/bin/env node
/**
 * Bundle recent digests; optional OpenRouter summary; update cost.json.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const COST_FILE = join(SYSTEM_DIR, 'state', 'cost.json');

function todayCompact() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function compactDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

const compact = todayCompact();
const deltaPath = join(LOGS_DIR, `delta-summary-${compact}.md`);
const gitToday = join(LOGS_DIR, `git-digest-${compact}.md`);
const ghToday = join(LOGS_DIR, `github-digest-${compact}.md`);

let digests = '';

for (const f of [gitToday, ghToday]) {
  if (existsSync(f)) {
    digests += readFileSync(f, 'utf8') + '\n\n';
  }
}

if (!digests.trim()) {
  const cutoff = compactDaysAgo(7);
  try {
    const names = readdirSync(LOGS_DIR);
    for (const name of names) {
      if (!/-digest-/.test(name) || !name.endsWith('.md')) continue;
      const full = join(LOGS_DIR, name);
      const m = name.match(/(\d{8})/g);
      const fileDate = m ? m[m.length - 1] : '';
      if (fileDate && fileDate >= cutoff) {
        digests += readFileSync(full, 'utf8') + '\n\n';
      }
    }
  } catch {
    /* ignore */
  }
}

if (!digests.trim()) {
  console.error('No recent digests found. Run sync-git.mjs and/or sync-github.mjs first.');
  process.exit(0);
}

const bundleTitle = `# Delta Bundle — ${todayIsoDate()}\n\n`;
let deltaBody = bundleTitle + digests;

const apiKey = process.env.OPENROUTER_API_KEY;

if (apiKey) {
  console.log('Calling OpenRouter for summary...');
  const context = digests.slice(0, 2000);

  const payload = {
    model: 'openai/gpt-4o-mini',
    max_tokens: 300,
    messages: [
      {
        role: 'system',
        content:
          'You summarise developer activity for an Obsidian wiki. Be concise: 3-5 bullet points, use [[wikilinks]] where appropriate. Output markdown only.',
      },
      {
        role: 'user',
        content: `Summarise this delta:\n\n${context}`,
      },
    ],
  };

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lexery.ai',
        'X-Title': 'Lexery Second Brain',
      },
      body: JSON.stringify(payload),
    });

    const response = await res.json();
    const summary = response?.choices?.[0]?.message?.content?.trim() || '';
    const usageTokens = Number(response?.usage?.total_tokens ?? 0);

    if (summary) {
      deltaBody += '\n---\n\n## LLM Summary\n\n' + summary + '\n';

      const estCost = usageTokens * 0.0000004;

      if (existsSync(COST_FILE)) {
        const cost = JSON.parse(readFileSync(COST_FILE, 'utf8'));
        cost.entries = cost.entries || [];
        cost.entries.push({
          date: todayIsoDate(),
          operation: 'generate-delta summary',
          tier: 1,
          estimated_tokens: usageTokens,
          estimated_cost_usd: estCost,
          note: 'auto: gpt-4o-mini via OpenRouter',
        });
        cost.total_usd = Number(cost.total_usd ?? 0) + estCost;
        writeFileSync(COST_FILE, JSON.stringify(cost, null, 2));
      }
    } else {
      console.warn('WARNING: LLM returned empty summary. Raw delta preserved.');
    }
  } catch (e) {
    console.warn(`WARNING: OpenRouter request failed: ${e.message}. Raw delta preserved.`);
  }
} else {
  console.log('OPENROUTER_API_KEY not set — skipping LLM summary. Raw delta preserved.');
}

writeFileSync(deltaPath, deltaBody);
console.log(`Delta written to ${deltaPath}`);
