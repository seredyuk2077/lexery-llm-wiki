#!/usr/bin/env node
/**
 * Scan tracked repos for new commits, write digests, update state.
 * Node replacement for sync-git.sh (no jq).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const STATE_DIR = join(SYSTEM_DIR, 'state');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const REPOS_FILE = join(STATE_DIR, 'repos.json');

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, ...opts }).trim();
}

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

function utcIsoTs() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

const REPOS_EXAMPLE = join(STATE_DIR, 'repos.json.example');

if (!existsSync(REPOS_FILE)) {
  if (existsSync(REPOS_EXAMPLE)) {
    writeFileSync(REPOS_FILE, readFileSync(REPOS_EXAMPLE, 'utf8'));
    console.log(`Created ${REPOS_FILE} from repos.json.example — set "path" to your local clones.`);
  } else {
    console.error(`ERROR: repos.json not found at ${REPOS_FILE}`);
    process.exit(1);
  }
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

const state = JSON.parse(readFileSync(REPOS_FILE, 'utf8'));
const compact = todayCompact();
const digestPath = join(LOGS_DIR, `git-digest-${compact}.md`);
const headingDate = todayIsoDate();

let digest = `# Git Digest — ${headingDate}\n\n`;
let changesFound = 0;

for (let i = 0; i < state.repos.length; i++) {
  const repo = state.repos[i];
  const lastSha = repo.last_processed_sha ?? '';

  const p = (repo.path || '').trim();
  if (!p) {
    console.warn(`WARNING: ${repo.name} — empty path in repos.json, skipping.`);
    continue;
  }
  if (!existsSync(join(p, '.git'))) {
    console.warn(`WARNING: ${repo.name} — repo not found at ${p}, skipping.`);
    continue;
  }

  let repoHasChanges = 0;

  for (const branch of repo.tracked_branches || []) {
    try {
      sh(`git -C "${p}" fetch origin "${branch}" --quiet 2>/dev/null || true`, {
        shell: '/bin/bash',
      });

      let latestSha = '';
      try {
        latestSha = sh(`git -C "${p}" rev-parse "origin/${branch}" 2>/dev/null`);
      } catch {
        try {
          latestSha = sh(`git -C "${p}" rev-parse "${branch}" 2>/dev/null`);
        } catch {
          latestSha = '';
        }
      }

      if (!latestSha) continue;

      let logOutput = '';
      try {
        logOutput = sh(
          `git -C "${p}" log --oneline --since="7 days ago" "origin/${branch}" 2>/dev/null`,
          { shell: '/bin/bash' },
        );
      } catch {
        try {
          logOutput = sh(
            `git -C "${p}" log --oneline --since="7 days ago" "${branch}" 2>/dev/null`,
            { shell: '/bin/bash' },
          );
        } catch {
          logOutput = '';
        }
      }

      if (!logOutput) continue;
      if (latestSha === lastSha) continue;

      repoHasChanges = 1;
      changesFound = 1;
      digest += `## ${repo.name} — \`${branch}\`\n\n\`\`\`\n${logOutput}\n\`\`\`\n\n`;

      repo.last_processed_sha = latestSha;
    } catch (e) {
      digest += `## ${repo.name} / ${branch}\n\n> Error: ${e.message}\n\n`;
    }
  }

  if (repoHasChanges) {
    repo.last_sync = utcIsoTs();
  }
}

if (changesFound === 0) {
  digest += 'No new commits in the last 7 days.\n';
}

writeFileSync(digestPath, digest);
writeFileSync(REPOS_FILE, JSON.stringify(state, null, 2));
console.log(`Digest written to ${digestPath}`);
