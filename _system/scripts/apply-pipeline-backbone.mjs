#!/usr/bin/env node
/**
 * Adds high-confidence "backbone" wikilinks to U-stage pages only.
 * Idempotent: skips targets already present anywhere in the note body.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT = join(__dirname, '..', '..');

const U_TITLE_BY_NUM = {
  1: 'Lexery - U1 Gateway',
  2: 'Lexery - U2 Query Profiling',
  3: 'Lexery - U3 Planning',
  4: 'Lexery - U4 Retrieval',
  5: 'Lexery - U5 Gate',
  6: 'Lexery - U6 Recovery',
  7: 'Lexery - U7 Evidence Assembly',
  8: 'Lexery - U8 Legal Reasoning',
  9: 'Lexery - U9 Assemble',
  10: 'Lexery - U10 Writer',
  11: 'Lexery - U11 Verify',
  12: 'Lexery - U12 Deliver',
};

const ALWAYS = ['Lexery - U1-U12 Runtime', 'Lexery - Brain Architecture', 'Lexery - Brain Test and Verify Map'];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasLink(raw, title) {
  const esc = escapeRe(title);
  return new RegExp(`\\[\\[\\s*${esc}(?:\\|[^\\]]+)?\\]\\]`).test(raw);
}

function ensureSeeAlsoSection(raw, bullets) {
  const missing = bullets.filter((t) => !hasLink(raw, t));
  if (missing.length === 0) return raw;

  const block = missing.map((t) => `- [[${t}]]`).join('\n') + '\n';
  const reSection = /^## See Also\s*$/im;
  if (reSection.test(raw)) {
    return raw.replace(reSection, (m) => `${m}\n${block}`);
  }
  return `${raw.trimEnd()}\n\n## See Also\n\n${block}`;
}

function uNumFromFilename(name) {
  const m = name.match(/^Lexery - U(\d{1,2}) /);
  return m ? Number(m[1]) : null;
}

const files = readdirSync(VAULT).filter((f) => f.startsWith('Lexery - U') && f.endsWith('.md'));

let touched = 0;
for (const f of files) {
  if (f === 'Lexery - U1-U12 Runtime.md') continue;
  const n = uNumFromFilename(f);
  if (n === null || n < 1 || n > 12) continue;

  const path = join(VAULT, f);
  let raw = readFileSync(path, 'utf8');
  const extra = [...ALWAYS];
  if (n > 1) {
    const prev = U_TITLE_BY_NUM[n - 1];
    if (prev) extra.push(prev);
  }
  if (n < 12) {
    const next = U_TITLE_BY_NUM[n + 1];
    if (next) extra.push(next);
  }

  const nextRaw = ensureSeeAlsoSection(raw, extra);
  if (nextRaw !== raw) {
    writeFileSync(path, nextRaw);
    touched += 1;
  }
}

console.log(`[apply-pipeline-backbone] updated ${touched} U-stage pages`);
