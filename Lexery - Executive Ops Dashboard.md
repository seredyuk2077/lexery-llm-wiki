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
> **Trust** 92/100 · **Health** GREEN · **Last run** lite · Автозбірка з truth / contradiction / maintenance state.

> [!success] System health — **GREEN**

> [!abstract] Trust & integrity
> - **Trust score:** 92/100
> - **Freshness issues:** 0
> - **Consistency issues:** 0
> - **Provenance issues:** 0
> - **Suspicious claims:** 2
> - **Contradiction candidates:** 0
> - **Last run mode:** lite

> [!tip] Throughput (останній local raw)
> - **PRs tracked:** 10
> - **Commits (window):** 67

> [!note] Runbook checks
> - Maintenance log today: **present**
> - Truth audit state: **present**
> - Детальніше: [[Lexery - Data Integrity Dashboard]]

# Lexery - Executive Ops Dashboard

## What to do next

1. Якщо **consistency > 0** — вирівняй метрики (Auto Snapshot ↔ PR Chronology).
2. Якщо **freshness > 0** — онови high-impact сторінки (Current State, Index, Project Brain).
3. Якщо **suspicious** або **contradictions > 0** — truth-triage перед розширенням контенту.

## Quick links

| Зона | Посилання |
|------|-----------|
| Integrity | [[Lexery - Data Integrity Dashboard]] |
| Snapshot | [[Lexery - Auto Snapshot]] |
| Продукт | [[Lexery - Current State]] |
| Журнал | [[Lexery - Log]] |
| Граф | [[Lexery - Neural Link Hub]] |
| Ops rollup | [[Lexery - Ops Rollup]] |
| Сирі аудити | `_system/logs/contradiction-audit-*.md` |
