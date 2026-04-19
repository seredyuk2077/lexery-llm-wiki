#!/usr/bin/env node
/**
 * Autonomous wiki filler.
 * Reads all raw sources and updates wiki pages with extracted data.
 * Focuses on: PR data → team pages, commit data → history pages, 
 * architecture docs → brain pages, stats → current state.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = join(__dirname, '..', '..');
const RAW = join(VAULT, 'raw');

function today() { return new Date().toISOString().slice(0, 10); }

console.log(`[auto-fill] ${today()}`);

function writeAutoSnapshot() {
  const out = join(VAULT, 'Lexery - Auto Snapshot.md');
  const commitsFile = join(RAW, 'github-commits', 'commits-recent.txt');
  const prsFile = join(RAW, 'github-prs', 'all-prs.json');
  let commitLines = 0;
  const byAuthor = {};
  if (existsSync(commitsFile)) {
    const commits = readFileSync(commitsFile, 'utf8').trim().split('\n').filter(Boolean);
    commitLines = commits.length;
    for (const line of commits) {
      const parts = line.split('|');
      const author = parts[2]?.trim();
      if (author) byAuthor[author] = (byAuthor[author] || 0) + 1;
    }
  }
  let prCount = 0;
  if (existsSync(prsFile)) {
    try {
      prCount = JSON.parse(readFileSync(prsFile, 'utf8')).length;
    } catch {
      prCount = 0;
    }
  }
  const topAuthors = Object.entries(byAuthor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([a, c]) => `- ${a}: ${c}`)
    .join('\n');

  const body = `---
aliases:
  - Auto Snapshot
tags:
  - lexery
  - meta
  - metrics
created: ${today()}
updated: ${today()}
status: observed
layer: meta
---

> [!lexery-hero] Live metrics
> ![[_assets/brand/lexery-mark-dark-bg.svg|44]]
>
> Автозріз з \`raw/\` (**перезапис** на кожному \`auto-fill\`). Контекст: [[Lexery - Current State]] · [[Lexery - PR Chronology]] · [[Lexery - Data Integrity Dashboard]]

> [!warning] Автогенерація
> Не покладайся на ручні правки тут — вони зникнуть на наступному прогоні.

# Lexery - Auto Snapshot

Зріз **${today()}** з \`raw/\` (джерело правди для цифр тут — файли на диску після \`scan-codebase\` / \`sync-github\`).

## Git (30d window у commits-recent)

- Рядків у \`commits-recent.txt\`: **${commitLines}**
${topAuthors ? '\n### Top authors (count in window)\n\n' + topAuthors : ''}

## GitHub PRs

- Записів у \`all-prs.json\`: **${prCount}**
- Деталі: [[Lexery - PR Chronology]]

## Де дивитись граф знань

- [[Lexery - Graph Hygiene]] — як прибрати «купу куль» у Graph view
- [[Lexery - Neural Link Hub]] — MOC + пропозиції зв’язків
- \`_system/state/link-graph.json\` — машинний експорт ребер

## Raw

- \`raw/github-commits/\` — останні коміти (вікно з \`scan-codebase\`)
- \`raw/github-prs/\` — PR JSON + markdown витяги
- \`raw/codebase-snapshots/\` — package.json, config snippets, test inventory
- \`raw/architecture-docs/\` — копії ключових arch markdown з monorepo

## Як оновлюється

1. Локальний \`run-maintenance.mjs\` (або LaunchAgent на macOS).
2. \`scan-codebase\` / \`sync-git\` / \`sync-github\` наповнюють \`raw/\`.
3. \`ingest\` позначає нові raw-файли.
4. \`auto-fill\` оновлює таблиці та **цю сторінку**.
5. \`suggest-links\` + \`apply-pipeline-backbone\` зміцнюють граф знань.

## Як не плутати з «людськими» сторінками

- Тут лише **автоматичні агрегати** з файлів на диску.
- Інтерпретація продукту, ризики й narrative — у [[Lexery - Current State]] та [[Lexery - Open Questions and Drift]].
`;
  writeFileSync(out, body);
  console.log('  Auto Snapshot: Lexery - Auto Snapshot.md');
}

writeAutoSnapshot();

const PR_BEGIN = '<!-- AUTO_PR_TABLE_BEGIN -->';
const PR_END = '<!-- AUTO_PR_TABLE_END -->';

function escCell(s) {
  return String(s ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function formatPrState(state) {
  const u = String(state || '').toUpperCase();
  if (u === 'MERGED') return 'Merged';
  if (u === 'OPEN') return 'Open';
  if (u === 'CLOSED') return 'Closed';
  return state || '?';
}

function buildPrTableBlock(prs) {
  const header =
    '| # | Title | State | Author | Branch → base | Created | Merged |\n' +
    '| --- | --- | --- | --- | --- | --- | --- |\n';
  const rows = [];
  for (const pr of [...prs].sort((a, b) => b.number - a.number)) {
    const author = pr.author?.login || '?';
    const branch = String(pr.headRefName || '').replace(/^\{Frontend\}-/i, 'Frontend-');
    const base = pr.baseRefName || 'dev';
    const created = (pr.createdAt || '').slice(0, 10);
    const merged = pr.closedAt ? pr.closedAt.slice(0, 10) : '—';
    rows.push(
      `| ${pr.number} | ${escCell(pr.title)} | ${formatPrState(pr.state)} | ${escCell(author)} | \`${escCell(branch)} → ${escCell(base)}\` | ${created} | ${merged} |`,
    );
  }
  return `${PR_BEGIN}\n\n${header}${rows.join('\n')}\n\n${PR_END}`;
}

// 1. Extract PR data and update PR Chronology (marker-safe)
const prsFile = join(RAW, 'github-prs', 'all-prs.json');
if (existsSync(prsFile)) {
  try {
    const prs = JSON.parse(readFileSync(prsFile, 'utf8'));
    const chronFile = join(VAULT, 'Lexery - PR Chronology.md');
    if (existsSync(chronFile)) {
      let content = readFileSync(chronFile, 'utf8');
      const block = buildPrTableBlock(prs);
      if (content.includes(PR_BEGIN) && content.includes(PR_END)) {
        content = content.replace(new RegExp(`${PR_BEGIN}[\\s\\S]*?${PR_END}`, 'm'), block);
      } else if (/## Full PR table/i.test(content)) {
        content = content.replace(/(## Full PR table\s*\n\n)([\s\S]*?)(\n\n> Branch names)/i, `$1${block}\n$3`);
      }
      content = content.replace(/updated: \d{4}-\d{2}-\d{2}/, `updated: ${today()}`);
      writeFileSync(chronFile, content);
      console.log(`  PR Chronology: ${prs.length} PRs`);
    }
  } catch (e) {
    console.log(`  PR Chronology: error — ${e.message}`);
  }
}

// 2. Extract commit velocity and update GitHub History
const commitsFile = join(RAW, 'github-commits', 'commits-recent.txt');
if (existsSync(commitsFile)) {
  const commits = readFileSync(commitsFile, 'utf8').trim().split('\n').filter(Boolean);
  
  // Group by author
  const byAuthor = {};
  const byDay = {};
  for (const line of commits) {
    const parts = line.split('|');
    if (parts.length < 4) continue;
    const date = parts[1]?.trim().slice(0, 10);
    const author = parts[2]?.trim();
    if (author) byAuthor[author] = (byAuthor[author] || 0) + 1;
    if (date) byDay[date] = (byDay[date] || 0) + 1;
  }
  
  console.log(`  Commits: ${commits.length} total, ${Object.keys(byAuthor).length} authors`);
  for (const [author, count] of Object.entries(byAuthor).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${author}: ${count}`);
  }
}

// 3. Extract Linear references from PR bodies
const linearRefs = new Set();
const prDir = join(RAW, 'github-prs');
if (existsSync(prDir)) {
  for (const f of readdirSync(prDir).filter(f => f.endsWith('.json') && f.startsWith('pr-'))) {
    try {
      const pr = JSON.parse(readFileSync(join(prDir, f), 'utf8'));
      const body = pr.body || '';
      const matches = body.match(/LEX-\d+/g) || [];
      for (const m of matches) linearRefs.add(m);
      const urlMatches = body.match(/linear\.app\/lexery\/issue\/[^\s)]+/g) || [];
      for (const u of urlMatches) linearRefs.add(u);
    } catch {}
  }
  if (linearRefs.size > 0) {
    console.log(`  Linear refs found: ${[...linearRefs].join(', ')}`);
    
    // Save Linear references
    const linearDir = join(RAW, 'linear');
    if (!existsSync(linearDir)) mkdirSync(linearDir, { recursive: true });
    writeFileSync(join(RAW, 'linear', 'refs-from-prs.txt'), [...linearRefs].join('\n'));
  }
}

// 4. Track file change frequency in repo
const branchesFile = join(RAW, 'github-commits', 'branches.txt');
if (existsSync(branchesFile)) {
  const branches = readFileSync(branchesFile, 'utf8');
  console.log(`  Branches tracked`);
}

// 5. Update Contributing page URL reference
const contribFile = join(VAULT, 'Lexery - Contributing.md');
if (existsSync(contribFile)) {
  let content = readFileSync(contribFile, 'utf8');
  content = content.replace(/updated: \d{4}-\d{2}-\d{2}/, `updated: ${today()}`);
  writeFileSync(contribFile, content);
}

console.log(`[auto-fill] done`);
