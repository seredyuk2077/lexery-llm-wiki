#!/usr/bin/env node
/**
 * Neural link growth: suggest cross-links from tags, layer, U-stage adjacency, and plain mentions.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const VAULT_DIR = dirname(SYSTEM_DIR);
const LOGS_DIR = join(SYSTEM_DIR, 'logs');

function todayCompact() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function parseFrontmatterAndBody(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    return { tags: [], layer: null, body: raw };
  }
  const fm = m[1];
  const body = m[2];

  let layer = null;
  const lm = fm.match(/^layer:\s*(.+)$/m);
  if (lm) layer = lm[1].trim();

  const tags = [];
  const block = fm.match(/^tags:\s*\n((?:[ \t]*-\s*.+\n)+)/m);
  if (block) {
    for (const line of block[1].split('\n')) {
      const t = line.match(/^\s*-\s*(.+)$/);
      if (t) tags.push(t[1].trim());
    }
  }
  const inline = fm.match(/^tags:\s*\[([^\]]*)\]/m);
  if (inline) {
    for (const part of inline[1].split(',')) {
      const s = part.trim().replace(/^['"]|['"]$/g, '');
      if (s) tags.push(s);
    }
  }

  return { tags, layer, body };
}

function extractSeeAlsoSection(body) {
  const m = body.match(/^## See Also\s*$/m);
  if (!m) return '';
  const start = m.index + m[0].length;
  const rest = body.slice(start);
  const next = rest.search(/^## /m);
  const section = next === -1 ? rest : rest.slice(0, next);
  return section;
}

function extractWikilinkTargets(md) {
  const set = new Set();
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  let x;
  while ((x = re.exec(md)) !== null) {
    set.add(x[1].trim());
  }
  return set;
}

function pageTitleFromPath(vaultDir, absPath) {
  const rel = relative(vaultDir, absPath);
  return basename(rel, '.md');
}

function uStageNum(title) {
  const m = title.match(/\bU(\d{1,2})\b/);
  return m ? Number(m[1]) : null;
}

function collectMarkdownFiles(dir, out = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith('.')) continue;
    const full = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === '_system' || name.name === '_templates') continue;
      collectMarkdownFiles(full, out);
    } else if (name.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });

const files = collectMarkdownFiles(VAULT_DIR);
const titles = files.map((f) => pageTitleFromPath(VAULT_DIR, f));
const titleSet = new Set(titles);

const byTag = new Map();
const byLayer = new Map();
const byU = new Map();

const pages = [];

for (const file of files) {
  const title = pageTitleFromPath(VAULT_DIR, file);
  const raw = readFileSync(file, 'utf8');
  const { tags, layer, body } = parseFrontmatterAndBody(raw);
  const seeAlso = extractSeeAlsoSection(body);
  const linked = extractWikilinkTargets(body);
  const u = uStageNum(title);
  if (u !== null) {
    if (!byU.has(u)) byU.set(u, []);
    byU.get(u).push(title);
  }
  for (const t of tags) {
    if (!byTag.has(t)) byTag.set(t, []);
    byTag.get(t).push(title);
  }
  if (layer) {
    if (!byLayer.has(layer)) byLayer.set(layer, []);
    byLayer.get(layer).push(title);
  }
  pages.push({ title, file, tags, layer, body, seeAlso, linked, u });
}

const suggestions = [];
const MAX_PER_PAGE = 8;

for (const p of pages) {
  const seen = new Set();
  const add = (target, reasons) => {
    if (!target || target === p.title) return;
    if (!titleSet.has(target)) return;
    if (p.linked.has(target)) return;
    const so = p.seeAlso;
    if (so.includes(`[[${target}]]`) || so.includes(`[[${target}|`)) return;
    const key = target;
    if (seen.has(key)) return;
    seen.add(key);
    suggestions.push({ from: p.title, target, reasons: [...reasons] });
  };

  const TRIVIAL_TAGS = new Set(['lexery', 'obsidian', 'compiled-wiki', 'project-brain']);
  for (const tag of p.tags) {
    if (TRIVIAL_TAGS.has(tag)) continue;
    const peers = byTag.get(tag) || [];
    for (const peer of peers) {
      if (peer !== p.title) add(peer, [`shared tag: ${tag}`]);
    }
  }

  if (p.layer) {
    const peers = byLayer.get(p.layer) || [];
    for (const peer of peers) {
      if (peer !== p.title) add(peer, [`same layer: ${p.layer}`]);
    }
  }

  if (p.u !== null) {
    for (const delta of [-1, 1]) {
      const adj = p.u + delta;
      if (adj < 1 || adj > 12) continue;
      const peers = byU.get(adj) || [];
      for (const peer of peers) {
        add(peer, [`adjacent U-stage: U${p.u} ↔ U${adj}`]);
      }
    }
  }

  for (const other of titles) {
    if (other === p.title) continue;
    if (other.length < 12) continue;
    if (!p.body.includes(other)) continue;
    if (p.linked.has(other)) continue;
    const escaped = other.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const linkedPat = new RegExp(`\\[\\[\\s*${escaped}(?:\\||\\]\\])`);
    if (linkedPat.test(p.body)) continue;
    add(other, ['title appears in body (unlinked)']);
  }
}

const compact = todayCompact();
const outPath = join(LOGS_DIR, `link-suggestions-${compact}.md`);
const headingDate = new Date().toISOString().slice(0, 10);

let md = `# Link Suggestions — ${headingDate}\n\n`;
md += `_Heuristic suggestions only — review before editing notes._\n\n`;

const byFrom = new Map();
for (const s of suggestions) {
  if (!byFrom.has(s.from)) byFrom.set(s.from, []);
  byFrom.get(s.from).push(s);
}

for (const p of pages) {
  const list = byFrom.get(p.title);
  if (!list || list.length === 0) continue;
  const unique = new Map();
  for (const s of list) {
    const prev = unique.get(s.target);
    if (!prev) unique.set(s.target, s);
    else prev.reasons = [...new Set([...prev.reasons, ...s.reasons])];
  }
  const merged = [...unique.values()].slice(0, MAX_PER_PAGE);
  md += `## ${p.title}\n\n`;
  for (const s of merged) {
    const r = s.reasons.join('; ');
    md += `- Consider linking [[${s.target}]] — _${r}_\n`;
  }
  md += '\n';
}

if (suggestions.length === 0) {
  md += '_No suggestions this run._\n';
}

writeFileSync(outPath, md);
console.log(`Link suggestions written to ${outPath}`);
