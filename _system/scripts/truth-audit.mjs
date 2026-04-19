#!/usr/bin/env node
/**
 * Truth audit: freshness, PR metric parity, simple claim heuristics.
 * Outputs log, state JSON, and Lexery - Data Integrity Dashboard.md
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const VAULT_DIR = join(SYSTEM_DIR, '..');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const STATE_DIR = join(SYSTEM_DIR, 'state');

const FRESHNESS_DAYS_DEFAULT = 21;
const FRESHNESS_DAYS_META = 14;

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
    if (strong.test(t) && p.status === 'observed') {
      claimIssues.push({ page: p.title, line: i + 1, text: t.slice(0, 160) });
      n++;
    }
  }
}

const provenanceIssues = [];

let trustScore = 100;
trustScore -= Math.min(25, freshnessIssues.length * 3);
trustScore -= consistency.length * 15;
trustScore -= Math.min(20, claimIssues.length * 4);
trustScore -= provenanceIssues.length * 5;
trustScore = Math.max(0, Math.min(100, trustScore));

const compact = todayCompact();
const logPath = join(LOGS_DIR, `truth-audit-${compact}.md`);
const statePath = join(STATE_DIR, 'truth-audit.json');
const dashboardPath = join(VAULT_DIR, 'Lexery - Data Integrity Dashboard.md');

let logMd = `# Truth audit — ${todayIso()}\n\n`;
logMd += `- Pages: ${pages.length}\n- Freshness: ${freshnessIssues.length}\n- Consistency: ${consistency.length}\n`;
logMd += `- Suspicious claims: ${claimIssues.length}\n- Trust: ${trustScore}/100\n`;

writeFileSync(
  statePath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      trustScore,
      summary: {
        pages: pages.length,
        freshnessIssues: freshnessIssues.length,
        consistencyIssues: consistency.length,
        provenanceIssues: provenanceIssues.length,
        suspiciousClaims: claimIssues.length,
      },
      freshnessIssues,
      consistency,
      provenanceIssues,
      suspiciousClaims: claimIssues,
      metrics: {
        prSnapshot,
        prChronologyCount,
      },
    },
    null,
    2,
  ),
);

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
> Зведення **freshness**, **consistency** і евристики «сильних» тверджень. Генерує \`truth-audit.mjs\`.

> [!info] Auto-generated
> Не редагуй числові блоки вручну — наступний прогін перезапише їх.

# Lexery - Data Integrity Dashboard

> [!abstract] Health at a glance
> - **Trust score:** ${trustScore}/100
> - **Pages audited:** ${pages.length}
> - **Freshness issues:** ${freshnessIssues.length}
> - **Consistency issues:** ${consistency.length}
> - **Provenance issues:** ${provenanceIssues.length}
> - **Suspicious high-confidence claims:** ${claimIssues.length}

> [!tip] Read this first
> Trust score здебільшого падає через вимірювані речі: застарілі дати, розбіжність метрик, абсолютні формулювання без джерела.

## Critical checks

- PR count parity (Auto Snapshot vs PR Chronology): ${
  prSnapshot != null && prChronologyCount != null
    ? prSnapshot === prChronologyCount
      ? 'OK'
      : `MISMATCH (${prSnapshot} vs ${prChronologyCount})`
    : 'N/A'
}

## Actions

- Full audit log: \`_system/logs/truth-audit-${compact}.md\`
- Machine state: \`_system/state/truth-audit.json\`
- Related: [[Lexery - Current State]], [[Lexery - Auto Snapshot]], [[Lexery - PR Chronology]], [[Lexery - Log]]
`;

writeFileSync(logPath, logMd);
writeFileSync(dashboardPath, dashboard);

console.log(`Truth audit written to ${logPath}`);
console.log(`Truth state written to ${statePath}`);
console.log(`Data dashboard written to ${dashboardPath}`);
console.log(
  `Summary: trust=${trustScore}/100, freshness=${freshnessIssues.length}, consistency=${consistency.length}, suspicious=${claimIssues.length}`,
);
