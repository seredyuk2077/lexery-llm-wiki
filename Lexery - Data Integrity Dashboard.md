---
aliases:
  - Data Integrity Dashboard
tags:
  - lexery
  - meta
  - quality
created: 2026-04-19
updated: 2026-04-19
status: observed
layer: meta
---

> [!lexery-hero] Data integrity
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|220]]
>
> Зведення **freshness**, **consistency**, **provenance**, **raw↔wiki drift** і евристики «сильних» тверджень. Детальна семантика: [[Lexery - Wiki Quality Contract]].

> [!info] Auto-generated
> Не редагуй числові блоки вручну — наступний прогін перезапише їх.

# Lexery - Data Integrity Dashboard

> [!abstract] Health at a glance
> - **Trust score:** 82/100
> - **Pages audited:** 84
> - **Freshness issues:** 0
> - **Consistency issues:** 0
> - **Provenance gaps:** 0
> - **Raw↔wiki drift:** 2
> - **Suspicious high-confidence claims:** 1

> [!tip] Як читати ці цифри
> **Trust** падає не через «думку скрипта», а через вимірювані сигнали: прострочені дати, PR mismatch, сирі GitHub-експорти новіші за текст сторінки, відсутній `Compiled from` на `observed` сторінках, абсолютні формулювання без джерела. Повний контракт: [[Lexery - Wiki Quality Contract]].

## Critical checks

- PR count parity (Auto Snapshot vs PR Chronology): OK
- Raw GitHub bundle latest change: **2026-04-19T15:17:27Z**

## Drift & provenance

| Signal | Count | Дія |
|--------|------:|-----|
| Raw newer than key wiki pages | 2 | Онови [[Lexery - PR Chronology]], [[Lexery - Current State]] або підтяни narrative |
| Provenance gaps (no `Compiled from`) | 0 | Запусти `enforce-provenance.mjs` або додай джерела вручну |
| Suspicious absolute claims | 1 | Заміни на перевірювані формулювання + посилання |

## Actions

- Machine state: `_system/state/truth-audit.json` · history: `_system/state/truth-history.jsonl`
- Черга застарілих сторінок: [[Lexery - Stale Pages Queue]]
- Граф і ступінь зв’язності: [[Lexery - Graph Metrics]] · [[Lexery - Graph Hygiene]]
- Related: [[Lexery - Auto Snapshot]], [[Lexery - Log]], [[Lexery - Executive Ops Dashboard]]
