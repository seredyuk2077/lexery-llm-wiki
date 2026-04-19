#!/usr/bin/env node
/**
 * Deep-only: synthesize last N maintenance runs into Lexery - Ops Rollup.md
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const VAULT_DIR = join(SYSTEM_DIR, '..');

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

function listMaintenanceLogs() {
  if (!existsSync(LOGS_DIR)) return [];
  return readdirSync(LOGS_DIR)
    .filter((n) => n.startsWith('maintenance-') && n.endsWith('.md'))
    .map((n) => join(LOGS_DIR, n))
    .filter((p) => existsSync(p))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
    .slice(0, 8);
}

const paths = listMaintenanceLogs();
let body = '';

for (const p of paths) {
  const name = p.split('/').pop();
  const raw = readFileSync(p, 'utf8');
  const mode = (raw.match(/^Mode:\s*\*\*(.+)\*\*/m) || [])[1] || '?';
  const started = (raw.match(/^Started:\s*(.+)$/m) || [])[1] || '';
  const finished = (raw.match(/^Finished:\s*(.+)$/m) || [])[1] || '';
  const steps = [...raw.matchAll(/^## (.+\.mjs)\s*$/gm)].map((m) => m[1]);
  const durations = [...raw.matchAll(/^Duration:\s*\*\*(\d+)\s*ms\*\*$/gm)].map((m) => Number(m[1]));
  const totalMs = durations.reduce((a, b) => a + b, 0);
  body += `### ${name}\n\n`;
  body += `- **Mode:** ${mode}\n`;
  body += `- **Window:** ${started} → ${finished}\n`;
  body += `- **Steps:** ${steps.length}\n`;
  body += `- **CPU proxy (sum step durations):** ${totalMs} ms\n\n`;
}

const outPath = join(VAULT_DIR, 'Lexery - Ops Rollup.md');
const page = `---
aliases:
  - Ops Rollup
tags:
  - lexery
  - meta
  - operations
created: ${todayIso()}
updated: ${todayIso()}
status: observed
layer: meta
---

> [!lexery-hero] Maintenance forensics
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|240]]
>
> Зведення останніх maintenance-прогонів (режим, вікно, сумарний час кроків).

> [!info] Auto-generated (deep maintenance)
> Оновлюється \`maintenance-rollup.mjs\` після основного maintenance-логу.

# Lexery - Ops Rollup

${body || '_No maintenance logs found._'}

## See also

- [[Lexery - Executive Ops Dashboard]]
- [[Lexery - Data Integrity Dashboard]]
- [[Lexery - Log]]
`;

writeFileSync(outPath, page);
console.log(`Ops rollup written to ${outPath} (${paths.length} logs)`);
