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
2. Якщо сторінка **більше не актуальна** — перенеси факти в [[Lexery - Log]] або архівний розділ, потім зменш scope або познач `status: deprecated` (узгодь у runbook).
3. Після правок — дочекайся наступного `truth-audit` (щоденний maintenance).

## Див. також

- [[Lexery - Data Integrity Dashboard]]
- [[Lexery - Maintenance Runbook]]
