---
aliases:
  - Graph Metrics
tags:
  - lexery
  - meta
  - graph
created: 2026-04-19
updated: 2026-04-19
status: observed
layer: meta
---

> [!lexery-hero] Graph metrics
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|200]]
>
> Автозвіт з `link-graph.json` після **suggest-links** (deep). Пояснення сигналів: [[Lexery - Graph Hygiene]] · [[Lexery - Wiki Quality Contract]]

> [!info] Auto-generated
> Не редагуй таблиці вручну — наступний deep run перегенерує сторінку.

# Lexery - Graph Metrics

## Глобальні показники

| Метрика | Значення |
|---------|----------:|
| Nodes | 78 |
| Wikilink edges | 1284 |
| Suggested edges (heuristic) | 3339 |
| Suggested ÷ Wikilink | **2.60** |
| Mean inbound degree | 16.46 |

> [!warning] Інтерпретація ratio
> Якщо **Suggested ÷ Wikilink** ≫ **2.5**, граф у Obsidian виглядатиме «густо» навіть без реальних wikilink — це нормально для **лог-файлу пропозицій**, але в самих нотатках краще впроваджувати лише перевірені зв’язки.

## Топ-хаби (за hubScore)

| Rank | Page | Inbound | Out |
|-----:|------|--------:|----:|
| 1 | [[Lexery - Brain Architecture]] | 52 | 25 |
| 2 | [[Lexery - Current State]] | 27 | 51 |
| 3 | [[Lexery - Run Lifecycle]] | 34 | 19 |
| 4 | [[Lexery - U1-U12 Runtime]] | 31 | 22 |
| 5 | [[Lexery - ORCH and Clarification]] | 32 | 18 |
| 6 | [[Lexery - Provider Topology]] | 31 | 21 |
| 7 | [[Lexery - Retrieval, LLDBI, DocList]] | 32 | 16 |
| 8 | [[Lexery - Index]] | 11 | 85 |
| 9 | [[Lexery - Decision Registry]] | 28 | 20 |
| 10 | [[Lexery - Coverage Gap Honesty]] | 28 | 18 |
| 11 | [[Lexery - Retry and Recovery]] | 26 | 20 |
| 12 | [[Lexery - Project Brain]] | 11 | 69 |
| 13 | [[Lexery - U4 Retrieval]] | 25 | 21 |
| 14 | [[Lexery - Log]] | 14 | 53 |
| 15 | [[Lexery - DocList Surface]] | 25 | 16 |
| 16 | [[Lexery - Memory and Documents]] | 25 | 13 |
| 17 | [[Lexery - LLDBI Surface]] | 23 | 16 |
| 18 | [[Lexery - Storage Topology]] | 23 | 16 |

## Long-tail (inbound ≤ 1, не whitelist)

_Кандидати на додаткові вхідні посилання з hub-сторінок або MOC._

| Page | In | Out |
|------|---:|----:|
| [[Lexery - Auto Snapshot]] | 1 | 4 |

## Див. також

- [[Lexery - Neural Link Hub]]
- [[Lexery - Graph Hygiene]]
