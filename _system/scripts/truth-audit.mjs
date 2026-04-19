#!/usr/bin/env node
/**
 * Truth audit: freshness, PR parity, provenance gaps, raw↔wiki drift,
 * claim heuristics, trust history (jsonl), stale queue, integrity dashboard.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, appendFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const VAULT_DIR = join(SYSTEM_DIR, '..');
const RAW_DIR = join(VAULT_DIR, 'raw');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const STATE_DIR = join(SYSTEM_DIR, 'state');
const HISTORY_PATH = join(STATE_DIR, 'truth-history.jsonl');

const FRESHNESS_DAYS_DEFAULT = 21;
const FRESHNESS_DAYS_META = 14;

const PROVENANCE_SKIP = new Set([
  'Lexery - Index',
  'Lexery - Project Brain',
  'Lexery - Neural Link Hub',
  'Lexery - Log',
  'Lexery - Auto Snapshot',
  'Lexery - Data Integrity Dashboard',
  'Lexery - Executive Ops Dashboard',
  'Lexery - Ops Rollup',
  'Lexery - Source Registry',
  'Lexery - Cost Ledger',
  'Lexery - Stale Pages Queue',
  'Lexery - Graph Hygiene',
  'Lexery - Graph Metrics',
  'Lexery - Wiki Quality Contract',
]);

const CONTENT_LAYERS = new Set(['brain', 'product', 'data', 'history', 'team', 'governance']);

function todayCompact() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });
if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw, updated: null, layer: null, status: null };
  const block = m[1];
  const body = m[2];
  const get = (k) => {
    const x = block.match(new RegExp(`^${k}:\\s*(.+)$`, 'm'));
    return x ? x[1].trim() : null;
  };
  return {
    fm: block,
    body,
    updated: get('updated'),
    layer: get('layer'),
    status: get('status'),
  };
}

function daysSince(iso) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}

function readOptional(path) {
  if (!existsSync(path)) return null;
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

function pageUpdatedMs(title) {
  const p = join(VAULT_DIR, `${title}.md`);
  if (!existsSync(p)) return null;
  const { updated } = parseFrontmatter(readFileSync(p, 'utf8'));
  if (!updated) return null;
  const t = Date.parse(updated);
  return Number.isNaN(t) ? null : t;
}

function maxMtimeUnder(dir, exts) {
  let max = 0;
  function walk(d) {
    if (!existsSync(d)) return;
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (exts.some((e) => ent.name.endsWith(e))) {
        try {
          const t = statSync(full).mtimeMs;
          if (t > max) max = t;
        } catch {
          /* ignore */
        }
      }
    }
  }
  walk(dir);
  return max;
}

const pages = [];
const freshnessIssues = [];
for (const f of readdirSync(VAULT_DIR)) {
  if (!f.startsWith('Lexery - ') || !f.endsWith('.md')) continue;
  const raw = readFileSync(join(VAULT_DIR, f), 'utf8');
  const { updated, layer, status } = parseFrontmatter(raw);
  const title = f.replace(/\.md$/, '');
  const days = daysSince(updated);
  const limit = layer === 'meta' ? FRESHNESS_DAYS_META : FRESHNESS_DAYS_DEFAULT;
  if (days !== null && days > limit) {
    freshnessIssues.push({ page: title, days, limit, updated });
  }
  pages.push({ title, updated, layer, status });
}

const autoSnap = readOptional(join(VAULT_DIR, 'Lexery - Auto Snapshot.md'));
const prChrono = readOptional(join(VAULT_DIR, 'Lexery - PR Chronology.md'));

let prSnapshot = null;
if (autoSnap) {
  const m = autoSnap.match(/all-prs\.json`:\s*\*\*([\d,]+)\*\*/i);
  if (m) prSnapshot = Number(m[1].replace(/,/g, ''));
}
let prChronologyCount = null;
if (prChrono) {
  const rows = prChrono.match(/^\|\s*\d+\s*\|/gm) || [];
  prChronologyCount = rows.length;
}

const consistency = [];
if (prSnapshot != null && prChronologyCount != null && prSnapshot !== prChronologyCount) {
  consistency.push({
    kind: 'pr_count_mismatch',
    autoSnapshot: prSnapshot,
    prChronology: prChronologyCount,
  });
}

/** Raw GitHub exports newer than key wiki pages → narrative drift risk */
const rawVsWiki = [];
const rawGithubMax = Math.max(
  maxMtimeUnder(join(RAW_DIR, 'github-commits'), ['.txt']),
  maxMtimeUnder(join(RAW_DIR, 'github-prs'), ['.json', '.md']),
);
const driftSlackMs = 36 * 3600000;
if (rawGithubMax > 0) {
  for (const title of ['Lexery - PR Chronology', 'Lexery - Current State', 'Lexery - GitHub History']) {
    const pu = pageUpdatedMs(title);
    if (pu != null && rawGithubMax > pu + driftSlackMs) {
      rawVsWiki.push({
        page: title,
        pageUpdated: new Date(pu).toISOString().slice(0, 10),
        rawLatest: new Date(rawGithubMax).toISOString(),
      });
    }
  }
}

/** Observed content pages without explicit compiled-from callout */
const provenanceIssues = [];
for (const p of pages) {
  if (PROVENANCE_SKIP.has(p.title)) continue;
  if (p.status !== 'observed') continue;
  if (!p.layer || !CONTENT_LAYERS.has(p.layer)) continue;
  const body = readOptional(join(VAULT_DIR, `${p.title}.md`)) || '';
  const b = parseFrontmatter(body).body;
  if (!/> \[!info\] Compiled from/i.test(b) && !/> \[!note\] Compiled from/i.test(b)) {
    provenanceIssues.push({ page: p.title, layer: p.layer });
  }
}

const claimIssues = [];
const strong = /\b(always|never|guaranteed|100%|impossible|cannot fail)\b/i;
for (const p of pages) {
  const raw = readFileSync(join(VAULT_DIR, `${p.title}.md`), 'utf8');
  const { body } = parseFrontmatter(raw);
  if (/> \[!info\] Compiled from/i.test(body)) continue;
  const lines = body.split('\n');
  let n = 0;
  for (let i = 0; i < lines.length && n < 6; i++) {
    const t = lines[i].trim();
    if (!t || t.startsWith('#') || t.startsWith('>')) continue;
    if (t.startsWith('|')) continue;
    if (/^[-*]\s+\[\[/.test(t)) continue;
    if (strong.test(t) && p.status === 'observed') {
      claimIssues.push({ page: p.title, line: i + 1, text: t.slice(0, 160) });
      n++;
    }
  }
}

let trustScore = 100;
trustScore -= Math.min(25, freshnessIssues.length * 3);
trustScore -= consistency.length * 15;
trustScore -= Math.min(20, claimIssues.length * 4);
trustScore -= Math.min(15, provenanceIssues.length * 2);
trustScore -= Math.min(20, rawVsWiki.length * 7);
trustScore = Math.max(0, Math.min(100, trustScore));

const compact = todayCompact();
const logPath = join(LOGS_DIR, `truth-audit-${compact}.md`);
const statePath = join(STATE_DIR, 'truth-audit.json');
const dashboardPath = join(VAULT_DIR, 'Lexery - Data Integrity Dashboard.md');

let logMd = `# Truth audit — ${todayIso()}\n\n`;
logMd += `- Pages: ${pages.length}\n`;
logMd += `- Freshness: ${freshnessIssues.length} | Consistency: ${consistency.length} | Raw↔wiki: ${rawVsWiki.length}\n`;
logMd += `- Provenance gaps: ${provenanceIssues.length} | Suspicious claims: ${claimIssues.length}\n`;
logMd += `- Trust: ${trustScore}/100\n\n`;
if (provenanceIssues.length) {
  logMd += `## Provenance gaps (sample)\n\n`;
  for (const x of provenanceIssues.slice(0, 25)) {
    logMd += `- **${x.page}** (${x.layer})\n`;
  }
  logMd += '\n';
}
if (rawVsWiki.length) {
  logMd += `## Raw newer than wiki page\n\n`;
  for (const x of rawVsWiki) {
    logMd += `- **${x.page}** wiki \`updated\` ${x.pageUpdated} vs raw activity through **${x.rawLatest.slice(0, 10)}**\n`;
  }
  logMd += '\n';
}

const stateObj = {
  generatedAt: new Date().toISOString(),
  trustScore,
  summary: {
    pages: pages.length,
    freshnessIssues: freshnessIssues.length,
    consistencyIssues: consistency.length,
    provenanceIssues: provenanceIssues.length,
    suspiciousClaims: claimIssues.length,
    rawVsWikiDrift: rawVsWiki.length,
  },
  freshnessIssues,
  consistency,
  rawVsWiki,
  provenanceIssues,
  suspiciousClaims: claimIssues,
  metrics: {
    prSnapshot,
    prChronologyCount,
    rawGithubLatestIso: rawGithubMax ? new Date(rawGithubMax).toISOString() : null,
  },
};

writeFileSync(statePath, JSON.stringify(stateObj, null, 2));

const histLine = JSON.stringify({
  date: todayIso(),
  trustScore,
  freshness: freshnessIssues.length,
  consistency: consistency.length,
  provenance: provenanceIssues.length,
  suspicious: claimIssues.length,
  rawVsWiki: rawVsWiki.length,
});
appendFileSync(HISTORY_PATH, `${histLine}\n`);
try {
  if (existsSync(HISTORY_PATH)) {
    const lines = readFileSync(HISTORY_PATH, 'utf8').trimEnd().split('\n').filter(Boolean);
    if (lines.length > 800) {
      const tail = lines.slice(-800).join('\n') + '\n';
      writeFileSync(HISTORY_PATH, tail);
    }
  }
} catch {
  /* ignore */
}

const dashboard = `---
aliases:
  - Data Integrity Dashboard
tags:
  - lexery
  - meta
  - quality
created: ${todayIso()}
updated: ${todayIso()}
status: observed
layer: meta
---

> [!lexery-hero] Data integrity
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|220]]
>
> Зведення **freshness**, **consistency**, **provenance**, **raw↔wiki drift** і евристики «сильних» тверджень. Детальна семантика: [[Lexery - Wiki Quality Contract]].

> [!info] Auto-generated
> Не редагуй числові блоки вручну — наступний прогін перезапише їх.

# Lexery - Data Integrity Dashboard

> [!abstract] Health at a glance
> - **Trust score:** ${trustScore}/100
> - **Pages audited:** ${pages.length}
> - **Freshness issues:** ${freshnessIssues.length}
> - **Consistency issues:** ${consistency.length}
> - **Provenance gaps:** ${provenanceIssues.length}
> - **Raw↔wiki drift:** ${rawVsWiki.length}
> - **Suspicious high-confidence claims:** ${claimIssues.length}

> [!tip] Як читати ці цифри
> **Trust** падає не через «думку скрипта», а через вимірювані сигнали: прострочені дати, PR mismatch, сирі GitHub-експорти новіші за текст сторінки, відсутній \`Compiled from\` на \`observed\` сторінках, абсолютні формулювання без джерела. Повний контракт: [[Lexery - Wiki Quality Contract]].

## Critical checks

- PR count parity (Auto Snapshot vs PR Chronology): ${
  prSnapshot != null && prChronologyCount != null
    ? prSnapshot === prChronologyCount
      ? 'OK'
      : `MISMATCH (${prSnapshot} vs ${prChronologyCount})`
    : 'N/A'
}
- Raw GitHub bundle latest change: **${rawGithubMax ? new Date(rawGithubMax).toISOString().slice(0, 19) + 'Z' : 'n/a'}**

## Drift & provenance

| Signal | Count | Дія |
|--------|------:|-----|
| Raw newer than key wiki pages | ${rawVsWiki.length} | Онови [[Lexery - PR Chronology]], [[Lexery - Current State]] або підтяни narrative |
| Provenance gaps (no \`Compiled from\`) | ${provenanceIssues.length} | Запусти \`enforce-provenance.mjs\` або додай джерела вручну |
| Suspicious absolute claims | ${claimIssues.length} | Заміни на перевірювані формулювання + посилання |

## Actions

- Machine state: \`_system/state/truth-audit.json\` · history: \`_system/state/truth-history.jsonl\`
- Черга застарілих сторінок: [[Lexery - Stale Pages Queue]]
- Граф і ступінь зв’язності: [[Lexery - Graph Metrics]] · [[Lexery - Graph Hygiene]]
- Related: [[Lexery - Auto Snapshot]], [[Lexery - Log]], [[Lexery - Executive Ops Dashboard]]
`;

writeFileSync(dashboardPath, dashboard);

const stalePath = join(VAULT_DIR, 'Lexery - Stale Pages Queue.md');
let staleMd = `---
aliases:
  - Stale Pages Queue
tags:
  - lexery
  - meta
  - maintenance
created: ${todayIso()}
updated: ${todayIso()}
status: observed
layer: meta
---

> [!info] Auto-generated
> Оновлюється \`truth-audit.mjs\`. Сторінки тут — кандидати на **оновлення \`updated:\` або змісту**, не автоматичне видалення.

# Lexery - Stale Pages Queue

Сторінки, у яких \`updated:\` у frontmatter старіший за поріг **freshness** (див. \`truth-audit.json\`).

`;

if (!freshnessIssues.length) {
  staleMd += '_Наразі порушень freshness немає — черга порожня._\n\n';
} else {
  staleMd += '| Page | Days over | Limit (days) | Last updated |\n|------|-----------|----------------|---------------|\n';
  for (const x of [...freshnessIssues].sort((a, b) => b.days - a.days)) {
    staleMd += `| [[${x.page}]] | ${x.days} | ${x.limit} | ${x.updated || '—'} |\n`;
  }
  staleMd += '\n';
}

staleMd += `## Що робити

1. Онови зміст або хоча б поле \`updated:\` після перевірки проти репо / prod.
2. Якщо **raw новіший за сторінку** — див. [[Lexery - Data Integrity Dashboard]] (raw↔wiki) і [[Lexery - Wiki Quality Contract]].
3. Після правок — дочекайся наступного \`truth-audit\`.

## Див. також

- [[Lexery - Data Integrity Dashboard]]
- [[Lexery - Wiki Quality Contract]]
- [[Lexery - Maintenance Runbook]]
`;

writeFileSync(stalePath, staleMd);

writeFileSync(logPath, logMd);

console.log(`Stale queue written to ${stalePath}`);
console.log(`Truth audit written to ${logPath}`);
console.log(`Truth state written to ${statePath}`);
console.log(`Data dashboard written to ${dashboardPath}`);
console.log(
  `Summary: trust=${trustScore}/100, freshness=${freshnessIssues.length}, consistency=${consistency.length}, provenance=${provenanceIssues.length}, rawVsWiki=${rawVsWiki.length}, suspicious=${claimIssues.length}`,
);
