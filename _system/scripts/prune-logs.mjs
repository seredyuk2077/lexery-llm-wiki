#!/usr/bin/env node
/**
 * Delete old maintenance artifacts under _system/logs/ (local hygiene).
 * Never touches vault notes or raw/. Safe to run every maintenance pass.
 */
import { readdirSync, unlinkSync, existsSync, statSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = join(__dirname, '..', 'logs');

const PREFIXES = [
  'maintenance-',
  'link-suggestions-',
  'truth-audit-',
  'contradiction-audit-',
  'lint-report-',
  'delta-summary-',
  'git-digest-',
  'github-digest-',
];

const MAX_AGE_DAYS = 21;
const MIN_KEEP_PER_PREFIX = 4;
const cutoff = Date.now() - MAX_AGE_DAYS * 86400000;

if (!existsSync(LOGS_DIR)) {
  console.log('[prune-logs] no logs dir');
  process.exit(0);
}

const byPrefix = new Map();
for (const name of readdirSync(LOGS_DIR)) {
  if (!name.endsWith('.md')) continue;
  const pre = PREFIXES.find((p) => name.startsWith(p));
  if (!pre) continue;
  const full = join(LOGS_DIR, name);
  const t = statSync(full).mtimeMs;
  if (!byPrefix.has(pre)) byPrefix.set(pre, []);
  byPrefix.get(pre).push({ full, name, t });
}

let removed = 0;
for (const [, arr] of byPrefix) {
  arr.sort((a, b) => b.t - a.t);
  const victims = arr.slice(Math.max(MIN_KEEP_PER_PREFIX, 0));
  for (const v of victims) {
    if (v.t >= cutoff) continue;
    try {
      unlinkSync(v.full);
      removed++;
    } catch {
      /* ignore */
    }
  }
}

console.log(`[prune-logs] removed ${removed} files older than ${MAX_AGE_DAYS}d (kept newest ${MIN_KEEP_PER_PREFIX}+ per prefix)`);
