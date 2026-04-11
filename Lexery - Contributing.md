---
aliases: [Contributing, Як контрибутити]
tags: [lexery, meta]
status: active
layer: meta
created: 2026-04-09
updated: 2026-04-10
sources: 1
---

> [!info] Compiled from
> - `AGENTS.md` (wiki schema)

# Lexery - Contributing

> Інструкція для команди: як додавати інформацію до Lexery Second Brain.

## Швидкий старт

### 1. Відкрити vault в Obsidian

```bash
# Vault знаходиться всередині монорепо
open "__PATH_LEXERY_MONOREPO__/LLM Wiki"
```

В Obsidian: `Open folder as vault` → вибрати `LLM Wiki`.

### 2. Створити або редагувати сторінку

Кожна сторінка wiki має:

```yaml
---
aliases: [Short Name]
tags: [lexery, <category>]
status: observed | active | archived
layer: product | brain | data | history | team | meta
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Naming convention:** `Lexery - <Title>.md` (Title Case)

### 3. Додати raw source (якщо є нове джерело)

Скинь файл у відповідну папку:

| Тип джерела | Папка |
|------------|-------|
| Нотатки зустрічей | `raw/misc/` |
| Скріншоти, дизайн | `raw/misc/` |
| Telegram фрагменти | `raw/telegram/` |
| Linear tickets | `raw/linear/` |
| Будь-що інше | `raw/misc/` |

Система автоматично підхопить нові файли при наступному `ingest`.

### 4. Commit

```bash
cd "__PATH_LEXERY_MONOREPO__/LLM Wiki"
git add -A
git commit -m "add: <що додав>"
```

## Що додавати

### Саша (@alexbach093)

Ти — **frontend lead і operational partner**. Додавай інформацію про:

- **Portal UI** — нові компоненти, сторінки, UX рішення
- **Auth flow** — як працює реєстрація, login, OAuth
- **Subscription plans** — pricing, features, Stripe integration
- **Design decisions** — чому обрали такий UI pattern
- **Figma** — посилання на дизайни, screenshots

Сторінки де ти expert:
- [[Lexery - Portal Surface Map]]
- [[Lexery - Frontend and Brand Evolution]]
- [[Lexery - Frontend Refactor Context]]
- [[Lexery - Business Model]]

### Єгор (@puhachyeser)

Ти — **backend engineer і infrastructure specialist**. Додавай інформацію про:

- **API endpoints** — нові routes, middleware, guards
- **Auth service** — user schema, JWT, OAuth providers
- **Shared contracts** — Zod schemas, types between backend/agent
- **Storage** — presigned URLs, S3/R2 integration
- **Monorepo infra** — pnpm workspace, turborepo, shared configs
- **Linear tickets** — контекст з тікетів (LEX-XXX)

Сторінки де ти expert:
- [[Lexery - API and Control Plane]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - Deployment and Infra]]

## Як правильно писати

### Мова
- **Технічні терміни** — англійською: pipeline, retrieval, PR, consumer, middleware
- **Описовий текст** — українською: "Ця сторінка описує...", "Основна мета..."
- Не перекладай назви файлів, функцій, змінних

### Wikilinks
Завжди використовуй `Lexery - Page Name` для посилань на інші сторінки. Більше зв'язків = краще.

### See Also
В кінці кожної сторінки — `## See Also` з посиланнями на пов'язані сторінки.

### Callout-и
```markdown
> [!info] Compiled from
> - Джерело 1
> - Джерело 2

> [!warning] Відома проблема
> Опис проблеми

> [!note] Примітка
> Додаткова інформація
```

## Автоматизація

Система працює автоматично:

| Що | Як | Коли |
|----|----|------|
| Git sync | `sync-git.mjs` | Щоденно 08:00 |
| GitHub PRs | `sync-github.mjs` | Щоденно 08:00 |
| AI delta summary | `generate-delta.mjs` | Щоденно 08:00 |
| Link suggestions | `suggest-links.mjs` | Щоденно 08:00 |
| Lint check | `lint.mjs` | Щоденно 08:00 |
| Ingest raw sources | `ingest.mjs` | Щоденно 08:00 |

Ручний запуск maintenance:
```bash
node "__PATH_LEXERY_MONOREPO__/LLM Wiki/_system/scripts/run-maintenance.mjs"
```

## Web доступ

Wiki доступна онлайн: **https://seredyuk2077.github.io/lexery-wiki**

Зміни автоматично публікуються після push на GitHub.

## Правила

1. **Не видаляй** існуючі сторінки — архівуй (`status: archived`)
2. **Не редагуй** файли в `raw/` — вони immutable
3. **Завжди** додавай frontmatter до нових сторінок
4. **Оновлюй** `updated` дату в frontmatter коли редагуєш сторінку
5. **Пиши правдиво** — це база знань, не PR

## See Also

- [[Lexery - Index]]
- [[Lexery - Project Brain]]
- [[Lexery - Team and Operating Model]]
- [[Lexery - Automation Architecture]]
