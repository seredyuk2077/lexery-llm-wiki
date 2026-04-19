#!/usr/bin/env node
/**
 * Bundle recent digests; optional OpenRouter summary; update cost.json.
 * Budget-friendly models + robust HTTP/JSON handling.
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

function extractSummaryFromOpenRouterJson(response) {
  if (!response || typeof response !== 'object') return '';
  const ch0 = response?.choices?.[0];
  const msg = ch0?.message;
  return (
    (typeof msg?.content === 'string' && msg.content.trim()) ||
    (typeof ch0?.text === 'string' && ch0.text.trim()) ||
    ''
  );
}

function appendCostEntry(usageTokens, note) {
  if (!existsSync(COST_FILE)) return;
  const estCost = usageTokens * 0.0000004;
  const cost = JSON.parse(readFileSync(COST_FILE, 'utf8'));
  cost.entries = cost.entries || [];
  cost.entries.push({
    date: todayIsoDate(),
    operation: 'generate-delta summary',
    tier: 1,
    estimated_tokens: usageTokens,
    estimated_cost_usd: estCost,
    note,
  });
  cost.total_usd = Number(cost.total_usd ?? 0) + estCost;
  writeFileSync(COST_FILE, JSON.stringify(cost, null, 2));
}

if (apiKey) {
  console.log('Calling OpenRouter for summary...');
  const context = digests.slice(0, 1200);

  const primaryModel = 'openai/gpt-4o-mini';
  const fallbackModel = 'google/gemini-flash-1.5-8b';
  const freeFallbackModel = 'meta-llama/llama-3.2-3b-instruct:free';

  async function callOpenRouter(model) {
    const payload = {
      model,
      max_tokens: 220,
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

    const rawText = await res.text();
    let response = null;
    try {
      response = JSON.parse(rawText);
    } catch {
      response = null;
    }

    if (!res.ok) {
      const errObj = response?.error;
      const errStr =
        typeof errObj === 'string'
          ? errObj
          : errObj && typeof errObj === 'object'
            ? JSON.stringify(errObj)
            : rawText.slice(0, 600);
      console.warn(`WARNING: OpenRouter HTTP ${res.status}: ${errStr}`);
    } else if (response?.error) {
      console.warn(`WARNING: OpenRouter payload error: ${JSON.stringify(response.error).slice(0, 600)}`);
    }

    const summary = extractSummaryFromOpenRouterJson(response);
    const usageTokens = Number(response?.usage?.total_tokens ?? 0);
    return { summary, usageTokens, model };
  }

  try {
    let { summary, usageTokens, model } = await callOpenRouter(primaryModel);
    if (!summary) {
      console.warn(`WARNING: empty summary from ${primaryModel}; retrying ${fallbackModel}...`);
      const second = await callOpenRouter(fallbackModel);
      summary = second.summary;
      usageTokens = (usageTokens || 0) + second.usageTokens;
      model = second.model;
    }
    if (!summary) {
      console.warn(`WARNING: empty summary; retrying free tier ${freeFallbackModel}...`);
      const third = await callOpenRouter(freeFallbackModel);
      summary = third.summary;
      usageTokens = (usageTokens || 0) + third.usageTokens;
      model = third.model;
    }

    if (summary) {
      deltaBody += '\n---\n\n## LLM Summary\n\n' + summary + '\n';
      appendCostEntry(usageTokens, `auto: ${model} via OpenRouter`);
    } else {
      console.warn('WARNING: LLM returned empty summary after all fallbacks. Raw delta preserved.');
    }
  } catch (e) {
    console.warn(`WARNING: OpenRouter request failed: ${e.message}. Raw delta preserved.`);
  }
} else {
  console.log('OPENROUTER_API_KEY not set — skipping LLM summary. Raw delta preserved.');
}

writeFileSync(deltaPath, deltaBody);
console.log(`Delta written to ${deltaPath}`);
