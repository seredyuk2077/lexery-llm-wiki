#!/usr/bin/env node
/**
 * Fetch recent PRs via gh CLI, write digest, update prs.json.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const STATE_DIR = join(SYSTEM_DIR, 'state');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const PRS_FILE = join(STATE_DIR, 'prs.json');

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

function hasGh() {
  try {
    execSync('command -v gh', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

if (!hasGh()) {
  console.log(
    'SKIP: GitHub CLI (gh) not found — PR sync skipped. Install: brew install gh && gh auth login',
  );
  process.exit(0);
}

if (!existsSync(PRS_FILE)) {
  console.error(`ERROR: prs.json not found at ${PRS_FILE}`);
  process.exit(1);
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

const state = JSON.parse(readFileSync(PRS_FILE, 'utf8'));
const compact = todayCompact();
const digestPath = join(LOGS_DIR, `github-digest-${compact}.md`);
const headingDate = todayIsoDate();

let digest = `# GitHub PR Digest — ${headingDate}\n\n`;
let changesFound = 0;

const remotes = Object.keys(state.repos || {});

for (const remote of remotes) {
  const entry = state.repos[remote];
  const lastPr = Number(entry.last_processed_pr ?? 0);

  let prsJson = '[]';
  try {
    prsJson = execSync(
      `gh pr list --repo "${remote}" --state all --limit 20 --json number,title,state,createdAt,mergedAt,author,headRefName 2>/dev/null || echo []`,
      { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024, shell: '/bin/bash' },
    ).trim();
  } catch {
    prsJson = '[]';
  }

  let prs;
  try {
    prs = JSON.parse(prsJson);
  } catch {
    prs = [];
  }

  const newPrs = prs.filter((p) => p.number > lastPr).sort((a, b) => a.number - b.number);

  if (newPrs.length === 0) continue;

  changesFound = 1;
  digest += `## ${remote}\n\n`;
  digest += '| # | Title | State | Branch | Author | Created |\n';
  digest += '|---|-------|-------|--------|--------|---------|\n';

  for (const pr of newPrs) {
    const author = pr.author?.login ?? '';
    const created = (pr.createdAt || '').slice(0, 10);
    const title = String(pr.title || '').replace(/\|/g, '\\|');
    digest += `| ${pr.number} | ${title} | ${pr.state} | \`${pr.headRefName}\` | ${author} | ${created} |\n`;
  }
  digest += '\n';

  const maxPr = Math.max(...newPrs.map((p) => p.number));
  state.repos[remote].last_processed_pr = maxPr;
  state.repos[remote].last_sync = todayIsoDate();
}

if (changesFound === 0) {
  digest += 'No new PRs since last sync.\n';
}

writeFileSync(digestPath, digest);
writeFileSync(PRS_FILE, JSON.stringify(state, null, 2));
console.log(`Digest written to ${digestPath}`);
