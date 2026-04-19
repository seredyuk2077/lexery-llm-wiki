---
aliases:
  - Stale Pages Queue
tags:
  - lexery
  - meta
  - maintenance
created: 2026-04-19
updated: 2026-04-19
status: observed
layer: meta
---

> [!info] Auto-generated
> Оновлюється `truth-audit.mjs`. Сторінки тут — кандидати на **оновлення `updated:` або змісту**, не автоматичне видалення.

# Lexery - Stale Pages Queue

Сторінки, у яких `updated:` у frontmatter старіший за поріг **freshness** (див. `truth-audit.json`).

_Наразі порушень freshness немає — черга порожня._

## Що робити

1. Онови зміст або хоча б поле `updated:` після перевірки проти репо / prod.
2. Якщо **raw новіший за сторінку** — див. [[Lexery - Data Integrity Dashboard]] (raw↔wiki) і [[Lexery - Wiki Quality Contract]].
3. Після правок — дочекайся наступного `truth-audit`.

## Див. також

- [[Lexery - Data Integrity Dashboard]]
- [[Lexery - Wiki Quality Contract]]
- [[Lexery - Maintenance Runbook]]
