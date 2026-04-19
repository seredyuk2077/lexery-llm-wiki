---
aliases:
  - Auto Snapshot
tags:
  - lexery
  - meta
  - metrics
created: 2026-04-19
updated: 2026-04-19
status: observed
layer: meta
---

> [!lexery-hero] Live metrics
> ![[_assets/brand/lexery-mark-dark-bg.svg|44]]
>
> Автозріз з `raw/` (**перезапис** на кожному `auto-fill`). Контекст: [[Lexery - Current State]] · [[Lexery - PR Chronology]] · [[Lexery - Data Integrity Dashboard]]

> [!warning] Автогенерація
> Не покладайся на ручні правки тут — вони зникнуть на наступному прогоні.

# Lexery - Auto Snapshot

Зріз **2026-04-19** з `raw/` (джерело правди для цифр тут — файли на диску після `scan-codebase` / `sync-github`).

## Git (30d window у commits-recent)

- Рядків у `commits-recent.txt`: **67**

### Top authors (count in window)

- Andriy: 37
- puhachyeser: 17
- Олександр Бачинський: 10
- alexbach093: 3

## GitHub PRs

- Записів у `all-prs.json`: **10**
- Деталі: [[Lexery - PR Chronology]]

## Де дивитись граф знань

- [[Lexery - Neural Link Hub]] — MOC + пропозиції зв’язків
- `_system/state/link-graph.json` — машинний експорт ребер

## Raw

- `raw/github-commits/` — останні коміти (вікно з `scan-codebase`)
- `raw/github-prs/` — PR JSON + markdown витяги
- `raw/codebase-snapshots/` — package.json, config snippets, test inventory
- `raw/architecture-docs/` — копії ключових arch markdown з monorepo

## Як оновлюється

1. Локальний `run-maintenance.mjs` (або LaunchAgent на macOS).
2. `scan-codebase` / `sync-git` / `sync-github` наповнюють `raw/`.
3. `ingest` позначає нові raw-файли.
4. `auto-fill` оновлює таблиці та **цю сторінку**.
5. `suggest-links` + `apply-pipeline-backbone` зміцнюють граф знань.

## Як не плутати з «людськими» сторінками

- Тут лише **автоматичні агрегати** з файлів на диску.
- Інтерпретація продукту, ризики й narrative — у [[Lexery - Current State]] та [[Lexery - Open Questions and Drift]].
