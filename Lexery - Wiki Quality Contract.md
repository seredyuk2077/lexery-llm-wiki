---
aliases:
  - Wiki Quality Contract
  - Quality Contract
tags:
  - lexery
  - meta
  - governance
created: 2026-04-19
updated: 2026-04-19
status: observed
layer: governance
---

> [!info] Compiled from
> - Repository maintenance scripts (`truth-audit`, `run-maintenance`, `link-metrics`)
> - Team policy; оновлюється вручну при зміні правил якості

# Lexery - Wiki Quality Contract

Цей документ задає **що саме вважається «якістю»** для Lexery LLM Wiki: не естетика заради естетики, а **перевірювана узгодженість** між `raw/`, автоматичними сторінками та людськими high-trust нотатками.

## 1. Шари правди (layer)

| Layer | Що це | Джерело правди |
|-------|--------|----------------|
| **meta** | Навігація, runbook, dashboards | Репо скриптів + цей контракт |
| **brain / product / data / …** | Зміст про систему | Код, arch docs, `raw/`, prod метрики |
| **history** | Еволюція рішень | Git, PR, Linear, логи |

Правило: **жоден текст у `observed` не стверджує факт про прод без прив’язки** до джерела (коміт, PR, snapshot, API-зріз) або явного `inferred` / `planned`.

## 2. Статуси frontmatter (`status`)

- **`observed`** — зібрано з артефактів; має бути або `> [!info] Compiled from`, або явний виняток у [[Lexery - Wiki Quality Contract]] (рідко).
- **`inferred`** — інтерполяція, гіпотеза; не використовувати для P0 рішень.
- **`planned`** — намір; не плутати з реалізацією.
- **`deprecated`** — історичний шар; не видаляти мовчки — перенести висновок у [[Lexery - Log]].

## 3. Freshness (`updated:`)

- **Meta** сторінки: поріг **14 днів** (швидкий рух навігації).
- **Решта**: **21 день** за замовчуванням.
- Якщо `updated:` прострочено — сторінка потрапляє в [[Lexery - Stale Pages Queue]]; це **сигнал triage**, не «погана нотатка».

## 4. Raw ↔ wiki drift

`truth-audit.mjs` порівнює **останню зміну** у `raw/github-commits/` та `raw/github-prs/` з полем `updated:` на:

- [[Lexery - PR Chronology]]
- [[Lexery - Current State]]
- [[Lexery - GitHub History]]

Якщо **сирі дані новіші за текст** більш ніж на ~36 год — це **drift**: таблиці PR або narrative «застигли», хоча `auto-fill` вже міг оновити цифри в [[Lexery - Auto Snapshot]]. Тоді:

1. Переконайся, що `auto-fill` пройшов після `sync-github`.
2. Онови prose / дати на сторінці або поясни, чому свідомо лишаєш старий текст (тимчасово).

## 5. Контракт PR-таблиці

- Таблиця в [[Lexery - PR Chronology]] живе **між** `<!-- AUTO_PR_TABLE_BEGIN -->` … `END`.
- Будь-який ручний текст **над / під** маркерами зберігається.
- Паритет рядків таблиці з `all-prs.json` перевіряється в **Data Integrity**; mismatch = P1 для triage.

## 6. Граф Obsidian vs «кулі в купі»

- **Wikilink** = договір навигації; **suggested** edges у `link-graph.json` = лише евристика (див. [[Lexery - Graph Metrics]]).
- **Neural Link Hub** тримає мінімум wikilinkів у тілі — щоб глобальний граф не став зіркою з тисячі променів.
- Практичні кроки: [[Lexery - Graph Hygiene]], пресет `.obsidian/graph.json` у репо.

## 7. Trust score (0–100)

Складові (спрощено):

- прострочений `updated:`,
- PR mismatch,
- **raw↔wiki drift**,
- **provenance gaps** (observed без `Compiled from`),
- **absolute claims** без джерела.

Trust **не** оцінює глибину думки; він ловить **роз’їзд сигналів**. Динаміка: `_system/state/truth-history.jsonl`.

## 8. Що не робить automation

- Не переписує юридичні висновки й продуктові обіцянки без людини.
- Не видаляє контент через staleness.
- Не викликає дорогі LLM у дефолтному daily pass (лише `generate-delta` за наявності ключа).

## 9. Ескалація

| Симптом | Дія |
|---------|------|
| Trust < 85 кілька днів поспіль | Рев’ю [[Lexery - Drift Radar]] + raw bundle |
| raw↔wiki > 0 стабільно | Онови Current State / PR chronology |
| Provenance > N | Прогін `enforce-provenance.mjs` + ручний review спірних сторінок |

## Див. також

- [[Lexery - Data Integrity Dashboard]]
- [[Lexery - Executive Ops Dashboard]]
- [[Lexery - Maintenance Runbook]]
- [[Lexery - Automation Architecture]]
- [[Lexery - Source Map]]
