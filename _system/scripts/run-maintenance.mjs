#!/usr/bin/env node
/**
 * Orchestrator: full maintenance cycle (git → GitHub → Linear → delta → log → link hints).
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');

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

const logPath = join(LOGS_DIR, `maintenance-${todayCompact()}.md`);
const node = process.execPath;

const steps = [
  ['scan-codebase.mjs', true],
  ['sync-git.mjs', true],
  // Non-fatal: gh may be missing, logged out, or rate-limited — rest of pipeline should still run.
  ['sync-github.mjs', false],
  ['sync-linear.mjs', false],
  ['scan-supabase.mjs', false],
  ['generate-delta.mjs', false],
  ['update-log.mjs', false],
  ['ingest.mjs', false],
  ['auto-fill.mjs', false],
  ['suggest-links.mjs', false],
  ['apply-pipeline-backbone.mjs', false],
  ['lint.mjs', false],
];

let report = `# Maintenance run — ${todayIsoDate()}\n\nStarted: ${ts()}\n\n`;

function runStep(name, fatal) {
  const script = join(__dirname, name);
  report += `## ${name}\n\n`;
  const r = spawnSync(node, [script], {
    encoding: 'utf8',
    env: process.env,
    cwd: dirname(__dirname),
  });
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
  if (status !== 0 && fatal) {
    report += '_Step marked fatal — stopping._\n\n';
    return false;
  }
  return true;
}

let ok = true;
for (const [name, fatal] of steps) {
  const continueRun = runStep(name, fatal);
  if (!continueRun) {
    ok = false;
    break;
  }
}

report += `---\n\nFinished: ${ts()}\n`;
writeFileSync(logPath, report);
console.log(`Maintenance log written to ${logPath}`);
process.exit(ok ? 0 : 1);
