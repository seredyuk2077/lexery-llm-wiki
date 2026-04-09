---
aliases:
  - Team and Operating Model
tags:
  - lexery
  - team
  - operations
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: team
---

# Lexery — Team and Operating Model

## Команда

### [[Lexery - Andrii Serediuk|Андрій Середюк]] — Founder / Architect

- **Domain:** Brain pipeline (U1-U12), ORCH, retrieval, LLDBI/DocList, architecture authority
- **GitHub:** `seredyuk2077`
- **Стиль:** задає напрямок, делегує execution, тримає architecture authority. Єдиний хто торкається `apps/brain`.
- **Роль у команді:** de facto CTO + product vision holder. Не мікроменеджить, але тримає високий бар якості.

### [[Lexery - Yehor Puhach|Єгор Пугач]] — Backend Engineer

- **Domain:** NestJS API, Prisma, auth, monorepo infra, shared contracts, file upload
- **GitHub:** `puhachyeser`
- **Стиль:** системний, foundational-first. Найвищий PR volume в команді (7 PR за 2 тижні). Лінкує Linear issues.
- **Роль у команді:** backend infrastructure owner. Будує фундамент, на якому стоїть і portal, і agent pipeline.

### [[Lexery - Olexandr|Олександр (Sanya/Sasha)]] — Frontend Lead / Operations

- **Domain:** Portal UI, auth pages, subscriptions, system prompt editor, Figma, operational coordination
- **GitHub:** `alexbach093`
- **Стиль:** виконавчий, рішення-орієнтований. Адмініструє Telegram-групу, координує work links.
- **Роль у команді:** frontend owner + operational partner Андрія. Handles accounts, Figma, admin.

## Non-Human Operators

- **Codex / Cursor agents** — делегати на scoped tasks у Linear (`LEX-139`, `LEX-151`, `LEX-153`). Частина операційної моделі, не експеримент.
- **Obsidian Second Brain** — autonomous compiled knowledge system з `launchd`-based maintenance.

## Як команда працює

### Комунікація

| Канал | Використання |
| --- | --- |
| **Telegram** (Lexery.ai group) | Основний чат. Канали: General, Work links, Ideas, Useful content. 100% українська. |
| **GitHub PRs** | Delivery + merge. Self-merge без формальних review. |
| **Linear** | Task tracking, roadmap. Issue IDs у PR bodies. |
| **Figma** | Design. Координує Саша. |

### Ownership розподіл

```
Brain / Agent pipeline ──── Андрій (exclusive)
Backend API / Auth    ──── Єгор
Frontend / Portal     ──── Саша
Operations / Admin    ──── Саша (delegates from Андрій)
Architecture decisions ─── Андрій (final authority)
```

### Decision flow

1. Андрій визначає напрямок (архітектура, product, priorities)
2. Єгор і Саша execute у своїх доменах
3. PRs self-merge без formal review (high trust model)
4. Linear трекає tasks, GitHub трекає code
5. Agents (Codex/Cursor) виконують scoped tasks під supervision

### Ритм

- **PR cadence:** ~1 PR на день від Єгора, ~1 PR на 2-3 дні від Саші
- **No sprint ceremonies:** async, task-driven
- **No standup:** координація через Telegram chat
- **Branch strategy:** feature branches → `dev`, self-merge

## Інтерфейси між людьми

### Андрій ↔ Саша

- Андрій задає задачу коротко ("Треба X зробити")
- Саша уточнює якщо потрібно, потім робить
- Операційні справи: акаунти, LinkedIn, email credentials
- Не challenged рішення Андрія в спостережуваних чатах
- **Зв'язок:** peer-to-peer, не boss-subordinate

### Андрій ↔ Єгор

- Координація через GitHub + Linear + тег у Telegram
- **Контракт:** shared types (Zod schemas, PR #5 LEX-198)
- Єгор не торкається Brain, Андрій не торкається NestJS backend
- **Зв'язок:** complementary technical domains

### Єгор ↔ Саша

- Backend-frontend interface через contracts
- Єгор будує auth backend (#3, #8), Саша будує auth frontend (#7)
- Незалежні PR, без cross-review
- **Зв'язок:** coordinate via contracts, execute independently

## Сильні сторони моделі

- Швидка архітектурна ітерація (короткий decision chain)
- Low ceremony — async, task-driven, no meetings overhead
- Висока continuity між ідеєю і кодом
- Agents як force multipliers (scoped delegation в Linear)
- Clear domain boundaries (Brain / Backend / Frontend)

## Ризики моделі

- **Branch divergence** — Андрій працює на окремих гілках (`legal-agent-brain-dev`), може розходитись з main cadence. Див. [[Lexery - Branch Divergence]].
- **Single point of failure** — Brain domain тільки в Андрія. Knowledge transfer = ця wiki.
- **No code review** — якість залежить від self-discipline кожного
- **Architectural context founder-heavy** — Андрій тримає весь контекст; якщо він недоступний, decision-making зупиняється
- **Docs staleness** — при швидкому темпі docs можуть відставати від коду

## Team Evidence

- **GitHub contributors:** `seredyuk2077` (Brain + architecture), `puhachyeser` (backend), `alexbach093` (frontend)
- **Linear workspace:** Lexery — 3 team members + agent delegates
- **Telegram:** Lexery.ai group (owned by Sanya)

## See Also

- [[Lexery - Who Built What]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]
- [[Lexery - Repo Constellation]]
- [[Lexery - Linear Roadmap]]
- [[Lexery - Current State]]
- [[Lexery - PR Chronology]]
- [[Lexery - Decision Registry]]
- [[Lexery - Drift Radar]]
- [[Lexery - Brain Architecture]]
