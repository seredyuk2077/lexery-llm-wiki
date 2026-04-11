#!/usr/bin/env node
/**
 * Autonomous wiki filler.
 * Reads all raw sources and updates wiki pages with extracted data.
 * Focuses on: PR data → team pages, commit data → history pages, 
 * architecture docs → brain pages, stats → current state.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
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

> [!warning] Автогенерація
> Ця нотатка **перезаписується** кожним успішним \`auto-fill.mjs\`. Для оповіді та контексту див. [[Lexery - Current State]], [[Lexery - PR Chronology]], [[Lexery - Neural Link Hub]].

# Lexery - Auto Snapshot

Зріз **${today()}** з \`raw/\` (джерело правди для цифр тут — файли на диску після \`scan-codebase\` / \`sync-github\`).

## Git (30d window у commits-recent)

- Рядків у \`commits-recent.txt\`: **${commitLines}**
${topAuthors ? '\n### Top authors (count in window)\n\n' + topAuthors : ''}

## GitHub PRs

- Записів у \`all-prs.json\`: **${prCount}**
- Деталі: [[Lexery - PR Chronology]]

## Де дивитись граф знань

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

// 1. Extract PR data and update PR Chronology
const prsFile = join(RAW, 'github-prs', 'all-prs.json');
if (existsSync(prsFile)) {
  try {
    const prs = JSON.parse(readFileSync(prsFile, 'utf8'));
    const chronFile = join(VAULT, 'Lexery - PR Chronology.md');
    if (existsSync(chronFile)) {
      let content = readFileSync(chronFile, 'utf8');
      
      // Build PR table from data
      let table = '\n| # | Title | Author | Date | State |\n|---|-------|--------|------|-------|\n';
      for (const pr of prs.sort((a, b) => b.number - a.number)) {
        const author = pr.author?.login || '?';
        const date = (pr.createdAt || '').slice(0, 10);
        table += `| ${pr.number} | ${pr.title} | @${author} | ${date} | ${pr.state} |\n`;
      }
      
      // Update if there's a PR table marker or add after first heading
      if (content.includes('| # | Title |') || content.includes('| # |')) {
        const tablePattern = /\| #[^\n]*\n\|[-|]+\n((\|[^\n]+\n)*)/;
        if (tablePattern.test(content)) {
          content = content.replace(tablePattern, table.trim() + '\n');
        }
      }
      
      // Update frontmatter date
      content = content.replace(/updated: \d{4}-\d{2}-\d{2}/, `updated: ${today()}`);
      writeFileSync(chronFile, content);
      console.log(`  PR Chronology: ${prs.length} PRs`);
    }
  } catch (e) { console.log(`  PR Chronology: error — ${e.message}`); }
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
    if (!existsSync(linearDir)) { import('fs').then(fs => fs.mkdirSync(linearDir, { recursive: true })); }
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
