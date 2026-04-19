#!/usr/bin/env node
/**
 * Neural link engine v2: denser, scored suggestions + link graph JSON + vault hub page.
 * Scope: root-level `Lexery - *.md` only (ignores raw/, _system/, etc.) for truthfulness.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const VAULT_DIR = dirname(SYSTEM_DIR);
const LOGS_DIR = join(SYSTEM_DIR, 'logs');
const STATE_DIR = join(SYSTEM_DIR, 'state');

const runMode = (process.env.WIKI_RUN_MODE || 'deep').toLowerCase();
const lite = runMode === 'lite';

/** Code paths → canonical wiki pages (curated; extend as repo evolves). */
const CODE_PATH_HINTS = [
  { re: /apps\/brain\/gateway\b/i, page: 'Lexery - U1 Gateway', w: 4 },
  { re: /apps\/brain\/classify\b/i, page: 'Lexery - U2 Query Profiling', w: 4 },
  { re: /apps\/brain\/plan\b/i, page: 'Lexery - U3 Planning', w: 4 },
  { re: /apps\/brain\/retrieval\b/i, page: 'Lexery - U4 Retrieval', w: 5 },
  { re: /apps\/brain\/gate\b/i, page: 'Lexery - U5 Gate', w: 4 },
  { re: /apps\/brain\/expand\b/i, page: 'Lexery - U6 Recovery', w: 3 },
  { re: /apps\/brain\/doclist\b/i, page: 'Lexery - DocList Surface', w: 3 },
  { re: /apps\/brain\/evidence\b/i, page: 'Lexery - U7 Evidence Assembly', w: 4 },
  { re: /apps\/brain\/reasoning\b/i, page: 'Lexery - U8 Legal Reasoning', w: 4 },
  { re: /apps\/brain\/assemble\b/i, page: 'Lexery - U9 Assemble', w: 4 },
  { re: /apps\/brain\/write\b/i, page: 'Lexery - U10 Writer', w: 4 },
  { re: /apps\/brain\/(verify|outputValidator)/i, page: 'Lexery - U11 Verify', w: 4 },
  { re: /apps\/brain\/(deliver|deliverConsumer)\b/i, page: 'Lexery - U12 Deliver', w: 4 },
  { re: /apps\/brain\/orchestrator\b/i, page: 'Lexery - ORCH and Clarification', w: 4 },
  { re: /apps\/brain\/mm\b/i, page: 'Lexery - Pipeline Health Dashboard', w: 2 },
  { re: /apps\/portal\b/i, page: 'Lexery - Portal Surface Map', w: 3 },
  { re: /apps\/api\b/i, page: 'Lexery - API and Control Plane', w: 3 },
  { re: /apps\/lldbi\b/i, page: 'Lexery - LLDBI Surface', w: 3 },
  { re: /supabase\b/i, page: 'Lexery - Provider Topology', w: 2 },
  { re: /qdrant\b/i, page: 'Lexery - LLDBI Surface', w: 2 },
  { re: /redis\b/i, page: 'Lexery - Brain Environment Reference', w: 2 },
];

const TRIVIAL_TAGS = new Set(['lexery', 'obsidian', 'compiled-wiki', 'project-brain', 'meta']);

const HUB_PAGES = new Set([
  'Lexery - Index',
  'Lexery - Project Brain',
  'Lexery - Glossary',
  'Lexery - Source Registry',
  'Lexery - Log',
]);

function todayCompact() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function parseFrontmatterAndBody(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    return { tags: [], aliases: [], layer: null, status: null, body: raw };
  }
  const fm = m[1];
  const body = m[2];

  let layer = null;
  const lm = fm.match(/^layer:\s*(.+)$/m);
  if (lm) layer = lm[1].trim();

  let status = null;
  const sm = fm.match(/^status:\s*(.+)$/m);
  if (sm) status = sm[1].trim();

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

  const aliases = [];
  const ablock = fm.match(/^aliases:\s*\n((?:[ \t]*-\s*.+\n)+)/m);
  if (ablock) {
    for (const line of ablock[1].split('\n')) {
      const t = line.match(/^\s*-\s*(.+)$/);
      if (t) aliases.push(t[1].trim());
    }
  }
  const ainline = fm.match(/^aliases:\s*\[([^\]]*)\]/m);
  if (ainline) {
    for (const part of ainline[1].split(',')) {
      const s = part.trim().replace(/^['"]|['"]$/g, '');
      if (s) aliases.push(s);
    }
  }

  return { tags, aliases, layer, status, body };
}

function extractSeeAlsoSection(body) {
  const m = body.match(/^## See Also\s*$/im);
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

function pageTitleFromFile(name) {
  return basename(name, '.md');
}

function uStageNum(title) {
  if (/\bU1[-–]U12\b/i.test(title)) return null;
  const m = title.match(/\bU(\d{1,2})\b/);
  return m ? Number(m[1]) : null;
}

function titleTokens(title) {
  const core = title.replace(/^Lexery -\s*/i, '');
  return core
    .toLowerCase()
    .split(/[^a-z0-9\u0400-\u04FF]+/g)
    .filter((t) => t.length > 2 && !['lexery', 'the', 'and'].includes(t));
}

function tokenOverlapScore(a, b) {
  const ta = new Set(titleTokens(a));
  const tb = new Set(titleTokens(b));
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  if (inter === 0) return 0;
  const union = ta.size + tb.size - inter;
  return inter / union;
}

function collectLexeryRootMarkdown(vaultDir) {
  const out = [];
  for (const ent of readdirSync(vaultDir, { withFileTypes: true })) {
    if (!ent.isFile() || !ent.name.endsWith('.md')) continue;
    if (!ent.name.startsWith('Lexery - ')) continue;
    out.push(join(vaultDir, ent.name));
  }
  return out;
}

if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR, { recursive: true });
if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });

const files = collectLexeryRootMarkdown(VAULT_DIR);
const titles = files.map((f) => pageTitleFromFile(f));
const titleSet = new Set(titles);

const byTag = new Map();
const byLayer = new Map();
const byU = new Map();
const pages = [];
const pageByTitle = new Map();

for (const file of files) {
  const title = pageTitleFromFile(file);
  const raw = readFileSync(file, 'utf8');
  const { tags, aliases, layer, status, body } = parseFrontmatterAndBody(raw);
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

  const codeHints = [];
  for (const { re, page, w } of CODE_PATH_HINTS) {
    if (re.test(body) && page !== title && titleSet.has(page)) codeHints.push({ page, w });
  }

  const row = {
    title,
    file,
    tags,
    aliases,
    layer,
    status,
    body,
    seeAlso,
    linked,
    u,
    codeHints,
  };
  pages.push(row);
  pageByTitle.set(title, row);
}

/** title → Set of 1-hop outbound wiki targets */
const outbound = new Map();
for (const p of pages) {
  outbound.set(p.title, new Set(p.linked));
}

function scoreSuggestion(reasons) {
  let s = 0;
  for (const r of reasons) {
    if (r.startsWith('code path:')) s += 5;
    else if (r.startsWith('shared tag')) s += 2;
    else if (r.startsWith('same layer')) s += 1.5;
    else if (r.startsWith('adjacent U')) s += 3;
    else if (r.startsWith('title token')) s += 2.5;
    else if (r.startsWith('via [[')) s += 2;
    else if (r.startsWith('title appears')) s += 4;
    else if (r.startsWith('hub')) s += 0.5;
    else if (r.startsWith('shared substantive tags')) s += 2.4;
    else s += 1;
  }
  return s;
}

const suggestions = [];
const MAX_PER_PAGE = lite ? 8 : 14;

function addSuggestion(from, target, reasons, weightBoost = 0) {
  if (!target || target === from) return;
  if (!titleSet.has(target)) return;
  const p = pageByTitle.get(from);
  if (!p) return;
  if (p.linked.has(target)) return;
  if (p.seeAlso.includes(`[[${target}]]`) || p.seeAlso.includes(`[[${target}|`)) return;

  suggestions.push({
    from,
    target,
    reasons: [...reasons],
    score: scoreSuggestion(reasons) + weightBoost,
  });
}

for (const p of pages) {
  for (const tag of p.tags) {
    if (TRIVIAL_TAGS.has(tag)) continue;
    const peers = byTag.get(tag) || [];
    for (const peer of peers) {
      if (peer !== p.title) addSuggestion(p.title, peer, [`shared tag: ${tag}`]);
    }
  }

  if (p.layer) {
    const peers = byLayer.get(p.layer) || [];
    for (const peer of peers) {
      if (peer !== p.title) addSuggestion(p.title, peer, [`same layer: ${p.layer}`]);
    }
  }

  if (!lite) {
    const meaningful = p.tags.filter((t) => !TRIVIAL_TAGS.has(t));
    if (meaningful.length >= 1) {
      for (const other of titles) {
        if (other === p.title) continue;
        const po = pageByTitle.get(other);
        if (!po) continue;
        const ot = po.tags.filter((t) => !TRIVIAL_TAGS.has(t));
        const shared = meaningful.filter((t) => ot.includes(t));
        if (shared.length >= 2) {
          addSuggestion(
            p.title,
            other,
            [`shared substantive tags (${shared.length}): ${shared.slice(0, 4).join(', ')}`],
            0.55,
          );
        }
      }
    }
  }

  if (p.u !== null) {
    for (const delta of [-2, -1, 1, 2]) {
      const adj = p.u + delta;
      if (adj < 1 || adj > 12) continue;
      const peers = byU.get(adj) || [];
      for (const peer of peers) {
        addSuggestion(p.title, peer, [`adjacent U-stage: U${p.u} ↔ U${adj}`]);
      }
    }
  }

  for (const { page, w } of p.codeHints) {
    addSuggestion(p.title, page, [`code path: ${page}`], w);
  }

  for (const other of titles) {
    if (other === p.title) continue;
    if (other.length < 14) continue;
    if (!p.body.includes(other)) continue;
    const escaped = other.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\[\\[\\s*${escaped}(?:\\||\\]\\])`).test(p.body)) continue;
    addSuggestion(p.title, other, ['title appears in body (unlinked)']);
  }

  if (!lite) {
    for (const other of titles) {
      if (other === p.title) continue;
      const j = tokenOverlapScore(p.title, other);
      if (j >= 0.35) addSuggestion(p.title, other, [`title token overlap (Jaccard ${j.toFixed(2)})`], 1);
    }

    const hop = outbound.get(p.title);
    if (hop) {
      for (const mid of hop) {
        if (!titleSet.has(mid)) continue;
        const second = outbound.get(mid);
        if (!second) continue;
        for (const tgt of second) {
          if (tgt === p.title) continue;
          if (hop.has(tgt)) continue;
          addSuggestion(p.title, tgt, [`via [[${mid}]] (2-hop)`], 0.5);
        }
      }
    }
  }

  const outDeg = p.linked.size;
  if (outDeg < 6) {
    for (const hub of HUB_PAGES) {
      if (titleSet.has(hub) && hub !== p.title) {
        addSuggestion(p.title, hub, ['hub: low out-degree → core map'], 0.25);
      }
    }
  }
}

const mergedByFrom = new Map();
for (const s of suggestions) {
  if (!mergedByFrom.has(s.from)) mergedByFrom.set(s.from, new Map());
  const m = mergedByFrom.get(s.from);
  const prev = m.get(s.target);
  if (!prev || s.score > prev.score) {
    m.set(s.target, {
      target: s.target,
      reasons: [...new Set([...(prev?.reasons || []), ...s.reasons])],
      score: Math.max(prev?.score || 0, s.score),
    });
  } else {
    prev.reasons = [...new Set([...prev.reasons, ...s.reasons])];
    prev.score = Math.max(prev.score, s.score);
  }
}

const compact = todayCompact();
const outPath = join(LOGS_DIR, `link-suggestions-${compact}.md`);
const headingDate = todayIso();

let md = `# Link Suggestions — ${headingDate}\n\n`;
md += `_Scored heuristics — prefer **code path** and **unlinked title in body** first. Review before editing notes._\n\n`;

for (const p of pages) {
  const map = mergedByFrom.get(p.title);
  if (!map || map.size === 0) continue;
  const list = [...map.values()].sort((a, b) => b.score - a.score).slice(0, MAX_PER_PAGE);
  md += `## ${p.title}\n\n`;
  for (const s of list) {
    const r = s.reasons.join('; ');
    md += `- **[[${s.target}]]** — score ${s.score.toFixed(1)} — _${r}_\n`;
  }
  md += '\n';
}

if (mergedByFrom.size === 0) {
  md += '_No suggestions this run._\n';
}

writeFileSync(outPath, md);
console.log(`Link suggestions written to ${outPath}`);

const edges = [];
const edgeKey = (a, b) => `${a}>>${b}`;
const seenE = new Set();

for (const p of pages) {
  for (const t of p.linked) {
    if (!titleSet.has(t)) continue;
    const k = edgeKey(p.title, t);
    if (seenE.has(k)) continue;
    seenE.add(k);
    edges.push({ from: p.title, to: t, kind: 'wikilink' });
  }
}

for (const s of suggestions) {
  const k = edgeKey(s.from, s.target);
  if (seenE.has(k)) continue;
  seenE.add(k);
  edges.push({
    from: s.from,
    to: s.target,
    kind: 'suggested',
    score: s.score,
    reasons: s.reasons,
  });
}

const inbound = new Map();
for (const t of titles) inbound.set(t, 0);
for (const e of edges) {
  if (e.kind !== 'wikilink') continue;
  inbound.set(e.to, (inbound.get(e.to) || 0) + 1);
}

const graphPath = join(STATE_DIR, 'link-graph.json');
writeFileSync(
  graphPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      nodeCount: titles.length,
      wikilinkEdgeCount: edges.filter((e) => e.kind === 'wikilink').length,
      suggestedEdgeCount: edges.filter((e) => e.kind === 'suggested').length,
      nodes: titles.map((t) => ({
        title: t,
        inbound: inbound.get(t) || 0,
        out: [...(outbound.get(t) || [])].length,
      })),
      edges,
    },
    null,
    2,
  ),
);
console.log(`Link graph written to ${graphPath}`);

let hubMd = `---
aliases:
  - Neural Link Hub
tags:
  - lexery
  - meta
created: ${headingDate}
updated: ${headingDate}
status: observed
layer: meta
---

> [!lexery-hero] Neural graph
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|220]]
>
> Автоген MOC + scored ideas. **Мінімум wikilinkів** тут — граф у Obsidian лишається читабельним.

> [!info] Auto-generated
> Оновлюється скриптом \`suggest-links.mjs\` під час maintenance.

# Lexery - Neural Link Hub

## Як користуватись

- Таблиці нижче — **куди ще подивитись** з кожної сторінки (високий score спочатку).
- Детальні пропозиції по всіх сторінках — у \`_system/logs/link-suggestions-${compact}.md\`.
- Реальні вже існуючі посилання див. у [[Lexery - Index]].
- Експорт графа: \`_system/state/link-graph.json\` (для візуалізацій / зовнішніх інструментів).

## Orphans (0 вхідних wikilink з інших Lexery-сторінок)

`;

const orphans = titles.filter((t) => t !== 'Lexery - Index' && t !== 'Lexery - Project Brain' && (inbound.get(t) || 0) === 0);
if (orphans.length === 0) hubMd += '_Немає — усі сторінки мають хоча б один вхідний wikilink._\n\n';
else {
  hubMd += '| Page |\n|------|\n';
  for (const t of orphans.sort()) hubMd += `| [[${t}]] |\n`;
  hubMd += '\n';
}

const byLayerHub = new Map();
for (const p of pages) {
  const L = p.layer || 'unknown';
  if (!byLayerHub.has(L)) byLayerHub.set(L, []);
  byLayerHub.get(L).push(p.title);
}

hubMd += `## MOC by layer (чистий огляд)\n\n`;

for (const layer of [...byLayerHub.keys()].sort()) {
  hubMd += `### layer: ${layer}\n\n`;
  const pts = byLayerHub.get(layer).sort();
  for (const title of pts) {
    const map = mergedByFrom.get(title);
    const top = map
      ? [...map.values()].sort((a, b) => b.score - a.score).slice(0, 5)
      : [];
    // Keep a single canonical wikilink per row to avoid graph clutter.
    hubMd += `- **[[${title}]]**`;
    if (top.length) {
      // Suggested targets are plain text (not wikilinks) to keep Graph view readable.
      hubMd += ` → ${top.map((x) => `${x.target} (${x.score.toFixed(1)})`).join(', ')}`;
    }
    hubMd += '\n';
  }
  hubMd += '\n';
}

hubMd += `## Див. також\n\n- [[Lexery - Index]]\n- [[Lexery - Project Brain]]\n- [[Lexery - Graph Hygiene]]\n- [[Lexery - Glossary]]\n- [[Lexery - Log]]\n\n## Graph hygiene\n\n- Ця сторінка навмисно містить **мінімум wikilinks**.\n- Для масових link-ідей використовуй лог-файл \`link-suggestions-*.md\`, а не wikilinks у hub.\n`;

const hubPath = join(VAULT_DIR, 'Lexery - Neural Link Hub.md');
writeFileSync(hubPath, hubMd);
console.log(`Neural hub page written to ${hubPath}`);
