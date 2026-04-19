---
aliases:
  - Executive Ops Dashboard
tags:
  - lexery
  - meta
  - operations
created: 2026-04-19
updated: 2026-04-19
status: observed
layer: meta
---

> [!lexery-hero] Executive pulse
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|240]]
>
> **Trust** 82/100 · **Health** ATTENTION · **Last run** lite · Деталі сигналів: [[Lexery - Wiki Quality Contract]] · [[Lexery - Data Integrity Dashboard]]

> [!warning] System health — **ATTENTION REQUIRED**

> [!abstract] Trust & integrity
> - **Trust score:** 82/100
> - **Freshness issues:** 0
> - **Consistency issues:** 0
> - **Provenance gaps:** 0
> - **Raw↔wiki drift:** 2
> - **Suspicious claims:** 1
> - **Contradiction candidates:** 0
> - **Last run mode:** lite

> [!tip] Throughput (останній local raw)
> - **PRs tracked:** 10
> - **Commits (window):** 67

> [!note] Runbook checks
> - Maintenance log today: **present**
> - Truth audit state: **present**
> - Machine history: `_system/state/truth-history.jsonl`

# Lexery - Executive Ops Dashboard

## Trust trend (останні записи)

| Дата | Trust | Fresh | Cons | Prov | RawΔ | Claims |
|------|------:|------:|-----:|-----:|-----:|-------:|
| 2026-04-19 | 82 | 0 | 0 | 0 | 2 | 1 |



## What to do next

1. Якщо **raw↔wiki drift > 0** — спочатку онови [[Lexery - PR Chronology]] / [[Lexery - Current State]], потім перевір [[Lexery - Auto Snapshot]].
2. Якщо **provenance > 0** — прогін `enforce-provenance.mjs` або ручне джерело для `observed` сторінок.
3. Якщо **consistency > 0** — вирівняй метрики PR (маркери `AUTO_PR_TABLE`).
4. Якщо trust **падає кілька днів** — розгорни [[Lexery - Wiki Quality Contract]] §9.

## Quick links

| Зона | Посилання |
|------|-----------|
| Контракт якості | [[Lexery - Wiki Quality Contract]] |
| Integrity | [[Lexery - Data Integrity Dashboard]] |
| Snapshot | [[Lexery - Auto Snapshot]] |
| Продукт | [[Lexery - Current State]] |
| Журнал | [[Lexery - Log]] |
| Граф | [[Lexery - Neural Link Hub]] · [[Lexery - Graph Metrics]] |
| Ops rollup | [[Lexery - Ops Rollup]] |
| Сирі аудити | `_system/logs/contradiction-audit-*.md` |
