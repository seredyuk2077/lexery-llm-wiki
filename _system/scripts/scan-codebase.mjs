#!/usr/bin/env node
/**
 * Autonomous codebase scanner.
 * Scans the Lexery monorepo for changes and snapshots key data into raw/.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = join(__dirname, '..', '..');
const RAW = join(VAULT, 'raw');
const REPO = '__PATH_LEXERY_MONOREPO__';

function sh(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, timeout: 30000, ...opts }).trim();
  } catch (e) { return e.stdout?.trim() || ''; }
}

function today() { return new Date().toISOString().slice(0, 10); }
function ensureDir(d) { if (!existsSync(d)) mkdirSync(d, { recursive: true }); }

const date = today();
console.log(`[scan-codebase] ${date}`);

// 1. Git commits (last 30 days)
ensureDir(join(RAW, 'github-commits'));
const commits = sh(`git -C "${REPO}" log --all --format='%H|%ai|%an|%s' --since="30 days ago"`);
writeFileSync(join(RAW, 'github-commits', `commits-recent.txt`), commits);
const commitCount = commits ? commits.split('\n').length : 0;
console.log(`  Commits (30d): ${commitCount}`);

// 2. Branch state
const branches = sh(`git -C "${REPO}" branch -avv`);
writeFileSync(join(RAW, 'github-commits', 'branches.txt'), branches);

// 3. Git diff stat (uncommitted changes)
const diffStat = sh(`git -C "${REPO}" diff --stat`);
writeFileSync(join(RAW, 'github-commits', 'uncommitted-diff.txt'), diffStat);

// 4. GitHub PRs
ensureDir(join(RAW, 'github-prs'));
try {
  const prs = sh(`gh pr list --repo lexeryAI/Lexery --state all --limit 50 --json number,title,author,createdAt,closedAt,state,body,headRefName,baseRefName,url`);
  if (prs) writeFileSync(join(RAW, 'github-prs', 'all-prs.json'), prs);
  const prData = JSON.parse(prs || '[]');
  console.log(`  PRs: ${prData.length}`);

  for (const pr of prData) {
    const detail = sh(`gh pr view ${pr.number} --repo lexeryAI/Lexery --json number,title,author,createdAt,closedAt,state,body,headRefName,baseRefName,url,commits,files`);
    if (detail) {
      writeFileSync(join(RAW, 'github-prs', `pr-${pr.number}.json`), detail);
      const d = JSON.parse(detail);
      let md = `# PR #${d.number}: ${d.title}\n\n`;
      md += `- **Author:** ${d.author?.login || '?'}\n`;
      md += `- **Branch:** ${d.headRefName} → ${d.baseRefName}\n`;
      md += `- **Created:** ${(d.createdAt || '').slice(0, 10)}\n`;
      md += `- **State:** ${d.state}\n\n`;
      md += `## Description\n\n${d.body || '(none)'}\n\n`;
      if (d.files?.length) {
        md += `## Files (${d.files.length})\n\n`;
        for (const f of d.files.slice(0, 40)) {
          md += `- \`${f.path}\` (+${f.additions} -${f.deletions})\n`;
        }
      }
      if (d.commits?.length) {
        md += `\n## Commits (${d.commits.length})\n\n`;
        for (const c of d.commits.slice(0, 30)) {
          md += `- \`${(c.oid || '').slice(0, 7)}\` ${c.messageHeadline}\n`;
        }
      }
      writeFileSync(join(RAW, 'github-prs', `pr-${pr.number}.md`), md);
    }
  }
} catch (e) { console.log(`  PRs: error — ${e.message}`); }

// 5. Architecture docs snapshot
ensureDir(join(RAW, 'architecture-docs'));
const archDocs = [
  'apps/brain/docs/architecture/LEXERY_LEGAL_AI_AGENT_ARCHITECTURE.md',
  'apps/brain/docs/architecture/MEGA_DIAGRAM_FULL.md',
  'apps/brain/docs/architecture/app/README.md',
  'apps/brain/docs/architecture/app/context/CURRENT_PIPELINE_STATE.md',
];
for (const doc of archDocs) {
  const src = join(REPO, doc);
  if (existsSync(src)) {
    const dest = join(RAW, 'architecture-docs', doc.split('/').pop());
    writeFileSync(dest, readFileSync(src, 'utf8'));
  }
}
console.log(`  Architecture docs: ${archDocs.length}`);

// 6. Package.json snapshot
ensureDir(join(RAW, 'codebase-snapshots'));
const pkgPath = join(REPO, 'package.json');
if (existsSync(pkgPath)) {
  writeFileSync(join(RAW, 'codebase-snapshots', 'root-package.json'), readFileSync(pkgPath, 'utf8'));
}

// 7. Config.ts key extraction
const configPath = join(REPO, 'apps/brain/lib/config.ts');
if (existsSync(configPath)) {
  writeFileSync(join(RAW, 'codebase-snapshots', 'brain-config.ts'), readFileSync(configPath, 'utf8'));
}

// 8. Test file inventory
const testDir = join(REPO, 'apps/brain/tools');
if (existsSync(testDir)) {
  const testFiles = sh(`find "${testDir}" -name "test_*" -o -name "stress_*" -o -name "verify_*" 2>/dev/null`);
  writeFileSync(join(RAW, 'codebase-snapshots', 'test-inventory.txt'), testFiles);
  console.log(`  Test files: ${testFiles ? testFiles.split('\n').length : 0}`);
}

// 9. Workflow files
const wfDir = join(REPO, '.github/workflows');
if (existsSync(wfDir)) {
  for (const wf of readdirSync(wfDir)) {
    if (wf.endsWith('.yml') || wf.endsWith('.yaml')) {
      writeFileSync(
        join(RAW, 'codebase-snapshots', `workflow-${wf}`),
        readFileSync(join(wfDir, wf), 'utf8')
      );
    }
  }
}

// 10. Monorepo package list
const apps = existsSync(join(REPO, 'apps')) ? readdirSync(join(REPO, 'apps')) : [];
const pkgs = existsSync(join(REPO, 'packages')) ? readdirSync(join(REPO, 'packages')) : [];
let pkgReport = `# Monorepo Packages — ${date}\n\n## Apps\n`;
for (const app of apps) {
  const appPkg = join(REPO, 'apps', app, 'package.json');
  if (existsSync(appPkg)) {
    try {
      const p = JSON.parse(readFileSync(appPkg, 'utf8'));
      pkgReport += `- **${p.name || app}** — ${app}/\n`;
    } catch { pkgReport += `- ${app}/\n`; }
  }
}
pkgReport += `\n## Packages\n`;
for (const pkg of pkgs) {
  pkgReport += `- ${pkg}/\n`;
}
writeFileSync(join(RAW, 'codebase-snapshots', `monorepo-packages-${date}.md`), pkgReport);

console.log(`[scan-codebase] done`);
