#!/usr/bin/env node
/**
 * Orchestrator: full maintenance cycle.
 * Loads ~/.lexery-wiki-env; lite/deep modes; per-step timing; deep rollup.
 */
import { mkdirSync, writeFileSync, appendFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { homedir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const VAULT_ROOT = join(SYSTEM_DIR, '..');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const MAINT_STATE = join(SYSTEM_DIR, 'state', 'maintenance-state.json');

const envFile = join(homedir(), '.lexery-wiki-env');
if (existsSync(envFile)) {
  const lines = readFileSync(envFile, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^(?:export\s+)?([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) {
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[m[1]] = val;
    }
  }
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

function ts() {
  return new Date().toISOString();
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });
const STATE_DIR_ROOT = join(SYSTEM_DIR, 'state');
if (!existsSync(STATE_DIR_ROOT)) mkdirSync(STATE_DIR_ROOT, { recursive: true });

const logPath = join(LOGS_DIR, `maintenance-${todayCompact()}.md`);
const node = process.execPath;

function loadMaintState() {
  if (!existsSync(MAINT_STATE)) return { run_count: 0, last_deep_at: null };
  try {
    return JSON.parse(readFileSync(MAINT_STATE, 'utf8'));
  } catch {
    return { run_count: 0, last_deep_at: null };
  }
}

function chooseMode(state) {
  const forced = (process.env.WIKI_MAINTENANCE_MODE || '').toLowerCase();
  if (forced === 'lite' || forced === 'deep') return forced;
  return (state.run_count + 1) % 4 === 0 ? 'deep' : 'lite';
}

const maintState = loadMaintState();
const mode = chooseMode(maintState);
process.env.WIKI_RUN_MODE = mode;

const baseSteps = [
  ['scan-codebase.mjs', true],
  ['sync-git.mjs', true],
  ['sync-github.mjs', false],
  ['sync-linear.mjs', false],
  ['scan-supabase.mjs', false],
  ['generate-delta.mjs', false],
  ['update-log.mjs', false],
  ['ingest.mjs', false],
  ['auto-fill.mjs', false],
  ['enforce-provenance.mjs', false],
  ['truth-audit.mjs', false],
  ['contradiction-audit.mjs', false],
  ['build-executive-dashboard.mjs', false],
  ...(mode === 'deep' ? [['suggest-links.mjs', false]] : []),
  ['apply-pipeline-backbone.mjs', false],
  ['prune-logs.mjs', false],
  ['lint.mjs', false],
];

let report = `# Maintenance run — ${todayIsoDate()}\n\nStarted: ${ts()}\n\n`;
report += `Mode: **${mode}**\n\n`;
report += `Previous run count: **${maintState.run_count || 0}**\n\n`;

function runStep(name, fatal) {
  const script = join(__dirname, name);
  report += `## ${name}\n\n`;
  const started = Date.now();
  const r = spawnSync(node, [script], {
    encoding: 'utf8',
    env: process.env,
    cwd: VAULT_ROOT,
  });
  const elapsedMs = Date.now() - started;
  const stdout = r.stdout?.trim() || '';
  const stderr = r.stderr?.trim() || '';
  if (stdout) {
    report += '```\n' + stdout + '\n```\n\n';
    console.log(stdout);
  }
  if (stderr) {
    report += '_stderr:_\n\n```\n' + stderr + '\n```\n\n';
    console.error(stderr);
  }
  const status = r.status ?? 1;
  report += `Exit code: **${status}**\n\n`;
  report += `Duration: **${elapsedMs} ms**\n\n`;
  if (status !== 0 && fatal) {
    report += '_Step marked fatal — stopping._\n\n';
    return false;
  }
  return true;
}

let ok = true;
for (const [name, fatal] of baseSteps) {
  const continueRun = runStep(name, fatal);
  if (!continueRun) {
    ok = false;
    break;
  }
}

report += `---\n\nFinished: ${ts()}\n`;
writeFileSync(logPath, report);
console.log(`Maintenance log written to ${logPath}`);

if (mode === 'deep') {
  const rollupScript = join(__dirname, 'maintenance-rollup.mjs');
  const started = Date.now();
  const r = spawnSync(node, [rollupScript], {
    encoding: 'utf8',
    env: process.env,
    cwd: VAULT_ROOT,
  });
  const elapsedMs = Date.now() - started;
  const block = `\n## maintenance-rollup.mjs (post-write, deep)\n\nExit code: **${r.status ?? 1}**\n\nDuration: **${elapsedMs} ms**\n\n${r.stdout?.trim() ? '```\n' + r.stdout.trim() + '\n```\n\n' : ''}${r.stderr?.trim() ? '_stderr:_\n\n```\n' + r.stderr.trim() + '\n```\n\n' : ''}`;
  appendFileSync(logPath, block);
  if (r.stdout?.trim()) console.log(r.stdout.trim());
  if (r.stderr?.trim()) console.error(r.stderr.trim());
}

try {
  const next = {
    run_count: (maintState.run_count || 0) + 1,
    last_mode: mode,
    last_run_at: new Date().toISOString(),
    last_deep_at: mode === 'deep' ? new Date().toISOString() : maintState.last_deep_at || null,
  };
  writeFileSync(MAINT_STATE, JSON.stringify(next, null, 2));
  const execDash = join(__dirname, 'build-executive-dashboard.mjs');
  spawnSync(node, [execDash], { encoding: 'utf8', env: process.env, cwd: VAULT_ROOT });
} catch (e) {
  console.error(`WARNING: failed to update maintenance-state: ${e.message}`);
}

if (process.env.WIKI_AUTO_GIT_PUSH === '1') {
  try {
    const gitStatus = spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8', cwd: VAULT_ROOT });
    const changes = gitStatus.stdout?.trim() || '';
    if (changes) {
      spawnSync('git', ['add', '-A'], { cwd: VAULT_ROOT });
      spawnSync('git', ['commit', '-m', `auto: maintenance ${todayIsoDate()}`], { cwd: VAULT_ROOT, encoding: 'utf8' });
      const pushResult = spawnSync('git', ['push'], { cwd: VAULT_ROOT, encoding: 'utf8' });
      if (pushResult.status === 0) console.log('Git: committed and pushed.');
      else console.log('Git: committed locally (push failed or no remote).');
    } else {
      console.log('Git: no changes to commit.');
    }
  } catch (e) {
    console.error('Git auto-commit skipped:', e.message);
  }
}

process.exit(ok ? 0 : 1);
