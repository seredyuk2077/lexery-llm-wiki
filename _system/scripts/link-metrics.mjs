#!/usr/bin/env node
/**
 * Deep-only: derive graph topology metrics from link-graph.json → Lexery - Graph Metrics.md
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_DIR = join(__dirname, '..');
const VAULT_DIR = join(SYSTEM_DIR, '..');
const graphPath = join(SYSTEM_DIR, 'state', 'link-graph.json');
const outPath = join(VAULT_DIR, 'Lexery - Graph Metrics.md');

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

if (!existsSync(graphPath)) {
  console.warn('[link-metrics] link-graph.json missing — run suggest-links first');
  process.exit(0);
}

const graph = JSON.parse(readFileSync(graphPath, 'utf8'));
const nodes = graph.nodes || [];
const edges = graph.edges || [];

const wikilinkEdges = edges.filter((e) => e.kind === 'wikilink');
const suggestedEdges = edges.filter((e) => e.kind === 'suggested');
const ratio = wikilinkEdges.length ? (suggestedEdges.length / wikilinkEdges.length).toFixed(2) : 'n/a';

const inboundMap = new Map(nodes.map((n) => [n.title, n.inbound || 0]));
const outMap = new Map(nodes.map((n) => [n.title, n.out || 0]));

const hubScore = (t) => (inboundMap.get(t) || 0) * 1.15 + (outMap.get(t) || 0) * 0.35;
const ranked = [...nodes].sort((a, b) => hubScore(b.title) - hubScore(a.title));

const HUB_WHITELIST = new Set([
  'Lexery - Index',
  'Lexery - Project Brain',
  'Lexery - Neural Link Hub',
  'Lexery - Brain Architecture',
]);

const longTail = [...nodes]
  .filter((n) => (n.inbound || 0) <= 1 && !HUB_WHITELIST.has(n.title))
  .sort((a, b) => (a.inbound || 0) - (b.inbound || 0));

const meanIn =
  nodes.length > 0 ? (nodes.reduce((s, n) => s + (n.inbound || 0), 0) / nodes.length).toFixed(2) : '0';

let md = `---
aliases:
  - Graph Metrics
tags:
  - lexery
  - meta
  - graph
created: ${todayIso()}
updated: ${todayIso()}
status: observed
layer: meta
---

> [!lexery-hero] Graph metrics
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|200]]
>
> Автозвіт з \`link-graph.json\` після **suggest-links** (deep). Пояснення сигналів: [[Lexery - Graph Hygiene]] · [[Lexery - Wiki Quality Contract]]

> [!info] Auto-generated
> Не редагуй таблиці вручну — наступний deep run перегенерує сторінку.

# Lexery - Graph Metrics

## Глобальні показники

| Метрика | Значення |
|---------|----------:|
| Nodes | ${nodes.length} |
| Wikilink edges | ${wikilinkEdges.length} |
| Suggested edges (heuristic) | ${suggestedEdges.length} |
| Suggested ÷ Wikilink | **${ratio}** |
| Mean inbound degree | ${meanIn} |

> [!warning] Інтерпретація ratio
> Якщо **Suggested ÷ Wikilink** ≫ **2.5**, граф у Obsidian виглядатиме «густо» навіть без реальних wikilink — це нормально для **лог-файлу пропозицій**, але в самих нотатках краще впроваджувати лише перевірені зв’язки.

## Топ-хаби (за hubScore)

| Rank | Page | Inbound | Out |
|-----:|------|--------:|----:|
`;

ranked.slice(0, 18).forEach((n, i) => {
  md += `| ${i + 1} | [[${n.title}]] | ${n.inbound || 0} | ${n.out || 0} |\n`;
});

md += `\n## Long-tail (inbound ≤ 1, не whitelist)\n\n`;
md += '_Кандидати на додаткові вхідні посилання з hub-сторінок або MOC._\n\n';
md += '| Page | In | Out |\n|------|---:|----:|\n';
for (const n of longTail.slice(0, 22)) {
  md += `| [[${n.title}]] | ${n.inbound || 0} | ${n.out || 0} |\n`;
}

md += `\n## Див. також\n\n- [[Lexery - Neural Link Hub]]\n- [[Lexery - Graph Hygiene]]\n`;

writeFileSync(outPath, md);
console.log(`[link-metrics] wrote ${outPath}`);
