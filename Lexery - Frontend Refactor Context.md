---
aliases:
  - Frontend Refactor Context
tags:
  - lexery
  - product
  - frontend
created: 2026-04-09
updated: 2026-04-09
status: draft
layer: product
---

# Lexery - Frontend Refactor Context

## Source

- Linear document:
  `Main Refactor -> Feature Integration Context Packet`
- Date:
  `2026-03-15`

## Technology Stack

Портал побудований на сучасному React-стеку, що забезпечує server-side rendering та type-safe UI:

- **Next.js 14** — App Router з server components, API routes для [[Lexery - Provider Topology|OpenRouter]] proxy, middleware для auth
- **React 19** — concurrent features, server actions, streaming SSR
- **shadcn/ui** — component library на базі Radix UI primitives; забезпечує консистентний design system без vendor lock-in
- **TypeScript** — strict mode у всіх frontend packages
- **Tailwind CSS** — utility-first стилі, інтегровані із shadcn/ui tokens

Ця комбінація дозволяє [[Lexery - Portal Surface Map|Portal]] функціонувати як повноцінний workspace shell, а не простий лендінг.

## Portal Feature Surface

Поточний Portal охоплює кілька ключових продуктових зон:

- **Chat interface** — основний user flow: введення юридичного запиту, отримання відповіді з [[Lexery - Brain Architecture|Brain]] pipeline, real-time streaming через SSE
- **Attachments** — завантаження документів, file preview, зв'язок з [[Lexery - Storage Topology|R2 object storage]] для збереження
- **Sidebar / history** — навігація між чатами, workspace switching, session history
- **Settings** — user preferences, API key management, [[Lexery - Provider Topology|provider]] configuration
- **Workspace layout** — multi-workspace підтримка з окремим контекстом для кожного workspace
- **System prompt editor** — PR #4 від [[Lexery - Olexandr|Sasha]]: кастомізація system prompt для юридичного агента, template management
- **Subscription plans** — PR #10 від [[Lexery - Olexandr|Sasha]]: UI для вибору тарифного плану, billing integration

## Central Situation

Frontend рухався двома паралельними треками:

- architecture/refactor track під керівництвом [[Lexery - Yehor Puhach|Yehor]]
- feature/UI track під керівництвом [[Lexery - Olexandr|Olexandr]]

## The Core Problem

Якщо feature branch [[Lexery - Olexandr|Олександра]] злити безпосередньо в рефакторений main, команда ризикувала:

- повернути старі патерни (direct Supabase calls замість repository layer)
- зламати візуальну/системну консистентність shadcn/ui design system
- дублювати state/data-access логіку між server і client components
- спровокувати ще один цикл cleanup одразу після merge

## Recent Pull Requests

### Sasha ([[Lexery - Olexandr|Олександр]])

- **PR #4** — System Prompt Redesign: повна переробка system prompt editor з template picker, markdown preview, validation rules для юридичного контексту
- **PR #7** — Auth Pages: нові login/register/forgot-password сторінки на shadcn/ui, server-side validation, redirect flow після авторизації
- **PR #10** — Subscription Plans: UI для тарифних планів, pricing table component, integration з billing через [[Lexery - API and Control Plane|API]]

### Yehor ([[Lexery - Yehor Puhach|Єгор]])

- **PR #1** — Monorepo Migration: перенесення Portal у monorepo структуру `apps/portal`, shared packages для types і utilities, turborepo configuration
- **PR #8** — Auth Refactor: заміна client-side auth на server-side sessions, middleware-based route protection, cookie management
- **PR #9** — Auth Infrastructure: Supabase auth provider setup, role-based access control foundation, session refresh logic

## The Intended Solution

- завершити refactor baseline в main
- заморозити нову feature роботу під час integration window
- портувати feature work на рефакторовану структуру
- злити тільки коли integrated branch технічно зелений і структурно консистентний
- задокументувати patterns і anti-patterns для подальшої AI-assisted роботи

## Why This Matters To The Wiki

- `Observed`:
  frontend architecture трактувалася як стратегічна операційна задача, а не просто coding style preference.
- `Observed`:
  repo docs мали слугувати guardrails для майбутнього AI-generated code — PR descriptions і Linear documents розглядалися як частина architectural memory.
- `Inferred`:
  це один із найсильніших прикладів того, як Lexery ставиться до архітектури як до team memory, а не лише code style.

## See Also

- [[Lexery - Frontend and Brand Evolution]]
- [[Lexery - Team and Operating Model]]
- [[Lexery - Linear Roadmap]]
- [[Lexery - Portal Surface Map]]
- [[Lexery - Olexandr]]
- [[Lexery - Yehor Puhach]]
