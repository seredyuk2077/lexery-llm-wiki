#!/usr/bin/env node
/**
 * Heuristic contradiction audit.
 * always/never: same-page + proximity + strong phrasing.
 * integration / guarantee: cross-page, capped.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const VAULT_DIR = join(SYSTEM_DIR, '..');
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const STATE_DIR = join(SYSTEM_DIR, 'state');

const MAX_CROSS_FINDINGS = 80;
const MAX_INTRA_PER_PAGE = 12;
const INTRA_MAX_LINE_GAP = 14;

function todayCompact() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });
if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

function lineHasStrongAlways(text) {
  const t = text;
  if (/\bnot\s+always\b/i.test(t) || /\bnot\s+never\b/i.test(t)) return false;
  if (
    /\b(?:we|you|it|this|lexery|the\s+system|I)\s+(?:always|завжди)\s+(?:default|defaulted|uses|use|enables?|disables?|runs|applies|blocks?|requires?|stores?|sends?)\b/i.test(
      t,
    )
  )
    return true;
  if (/\b(?:always|завжди)\s+(?:enabled|disabled|on|off|true|false|active|inactive|required|blocked)\b/i.test(t))
    return true;
  if (/\b(?:always|завжди)\s+(?:runs|applies|fires|executes)\b/i.test(t)) return true;
  return false;
}

function lineHasStrongNever(text) {
  const t = text;
  if (/\bnot\s+never\b/i.test(t)) return false;
  if (
    /\b(?:we|you|it|this|lexery|the\s+system|I)\s+(?:never|ніколи)\s+(?:writes?|sends?|stores?|enables?|disables?|runs|applies|uses?)\b/i.test(
      t,
    )
  )
    return true;
  if (/\b(?:never|ніколи)\s+(?:enabled|writes?|sends?|runs|applies|stores?)\b/i.test(t)) return true;
  return false;
}

const files = readdirSync(VAULT_DIR).filter((f) => f.startsWith('Lexery - ') && f.endsWith('.md'));

const lines = [];
for (const f of files) {
  const p = join(VAULT_DIR, f);
  const txt = readFileSync(p, 'utf8');
  const page = f.replace(/\.md$/, '');
  txt.split('\n').forEach((ln, i) => {
    const t = ln.trim();
    if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|')) return;
    lines.push({ page, line: i + 1, text: t });
  });
}

const crossRules = [
  {
    pos: /\b(fully integrated|повністю інтегр)\b/i,
    neg: /\b(not fully integrated|не повністю інтегр)\b/i,
    key: 'integration_conflict',
  },
  {
    pos: /\b(guaranteed|гарантовано)\b/i,
    neg: /\b(may fail|може зламатися|ризик)\b/i,
    key: 'guarantee_vs_risk',
  },
];

const findings = [];

for (const rule of crossRules) {
  const pos = lines.filter((x) => rule.pos.test(x.text));
  const neg = lines.filter((x) => rule.neg.test(x.text));
  for (const a of pos.slice(0, 40)) {
    for (const b of neg.slice(0, 40)) {
      if (a.page === b.page) continue;
      findings.push({ type: rule.key, a, b });
      if (findings.length >= MAX_CROSS_FINDINGS) break;
    }
    if (findings.length >= MAX_CROSS_FINDINGS) break;
  }
}

for (const f of files) {
  const page = f.replace(/\.md$/, '');
  const p = join(VAULT_DIR, f);
  const txt = readFileSync(p, 'utf8');
  const rawLines = txt.split('\n');
  const hits = [];
  rawLines.forEach((ln, i) => {
    const t = ln.trim();
    if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('|')) return;
    const al = lineHasStrongAlways(t);
    const ne = lineHasStrongNever(t);
    if (al) hits.push({ line: i + 1, text: t, kind: 'pos' });
    if (ne) hits.push({ line: i + 1, text: t, kind: 'neg' });
  });
  let intra = 0;
  for (let i = 0; i < hits.length && intra < MAX_INTRA_PER_PAGE; i++) {
    for (let j = i + 1; j < hits.length && intra < MAX_INTRA_PER_PAGE; j++) {
      const hi = hits[i];
      const hj = hits[j];
      if (hi.kind === hj.kind) continue;
      if (Math.abs(hi.line - hj.line) > INTRA_MAX_LINE_GAP) continue;
      const a = hi.kind === 'pos' ? hi : hj;
      const b = hi.kind === 'neg' ? hi : hj;
      findings.push({
        type: 'always_vs_never',
        a: { page, line: a.line, text: a.text },
        b: { page, line: b.line, text: b.text },
      });
      intra++;
    }
  }
}

const compact = todayCompact();
const logPath = join(LOGS_DIR, `contradiction-audit-${compact}.md`);
const statePath = join(STATE_DIR, 'contradiction-audit.json');

let md = `# Contradiction Audit — ${todayIso()}\n\n`;
md += `- Heuristic findings: **${findings.length}**\n\n`;
if (!findings.length) {
  md += `_No contradiction candidates found._\n`;
} else {
  for (const f of findings.slice(0, 120)) {
    md += `- [${f.type}] **${f.a.page}:${f.a.line}** vs **${f.b.page}:${f.b.line}**\n`;
    md += `  - A: \`${f.a.text.slice(0, 180)}\`\n`;
    md += `  - B: \`${f.b.text.slice(0, 180)}\`\n`;
  }
}

writeFileSync(logPath, md);
writeFileSync(
  statePath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      findingsCount: findings.length,
      findings: findings.slice(0, 200),
    },
    null,
    2,
  ),
);

console.log(`Contradiction audit written to ${logPath}`);
console.log(`Contradiction state written to ${statePath}`);
console.log(`Summary: findings=${findings.length}`);
