#!/usr/bin/env node
/**
 * Ensure `observed` pages in content layers carry a minimal "Compiled from" callout.
 * Skips meta/hub/auto pages.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = join(__dirname, '..', '..');

const SKIP = new Set([
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

function hasCompiledCallout(s) {
  return /> \[!info\] Compiled from/i.test(s) || /> \[!note\] Compiled from/i.test(s);
}

function fmField(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

let updated = 0;
for (const file of readdirSync(VAULT)) {
  if (!file.startsWith('Lexery - ') || !file.endsWith('.md')) continue;
  const title = file.replace(/\.md$/, '');
  if (SKIP.has(title)) continue;
  const path = join(VAULT, file);
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) continue;
  const fm = m[1];
  const body = m[2];
  const status = fmField(fm, 'status');
  const layer = fmField(fm, 'layer');
  if (status !== 'observed') continue;
  if (!layer || !CONTENT_LAYERS.has(layer)) continue;
  if (hasCompiledCallout(body)) continue;

  const callout =
    '> [!info] Compiled from\n' +
    '> - Automated wiki maintenance + repository sources\n' +
    '> - See [[Lexery - Source Map]] for trust model\n\n';

  const newRaw = `---\n${fm}\n---\n\n${callout}${body.replace(/^\n+/, '')}`;
  writeFileSync(path, newRaw);
  updated++;
}

console.log(`[enforce-provenance] updated ${updated} pages`);
