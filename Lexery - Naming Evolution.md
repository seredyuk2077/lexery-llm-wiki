---
aliases:
  - Naming Evolution
  - Naming
  - Brand History
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: history
---

# Naming evolution

Full **product and brand arc** from the earliest public beta through today's **Lexery** identity. This note complements [[Lexery - Idea Evolution]] (what we built) and [[Lexery - Timeline]] (when), but focuses strictly on **names** as they appeared in repos, READMEs, and React components.

## Stages (chronological)

### Mike Ross

- **Earliest product identity**, named after the *Suits* character.
- Visible in the **public beta** repo README and early positioning.
- Technical and product context: [[Lexery - Legacy Beta App]].

### Український Юрист / Ukrainian Lawyer

- **Public-facing product name** during much of the beta period (repo title / marketing language).
- Bilingual label reflects **UA market** focus; same codebase family as Mike Ross era, rebranded for clarity and locale.

### Lexora

- **Intermediate identity** before Lexery stabilized.
- **Evidence:** `LexoraLogo.tsx` under the bridge repo's `new-frontend/src/components/branding/` (see [[Lexery - Legacy Architecture Bridge]]).
- Sits between beta naming and the final Lexery component set.

### Lexery

- **Current canonical identity** for the product and engineering org.
- **Evidence:** `LexeryLogo.tsx` in the same branding folder; `Sidebar.tsx` and `LoadingScreen.tsx` import **`LexeryLogo`** — runtime UI is unambiguously Lexery-branded.

### Lexery AI

- **Workspace / product line phrasing** visible in the bridge repo's **new-frontend layout** (headers, shell copy, or meta — check git history for exact strings).
- Use when distinguishing **the AI product** from the company name "Lexery" in prose.

## Original Names in Early Commits

Ранні коміти в публічному beta repo показують еволюцію самоідентифікації проєкту:

- **"Lexery AI"** — з'являється в commit messages і README як початковий positioning: "AI-powered legal assistant"
- **"Chat-based legal assistant"** — описовий термін у перших PR descriptions і issue titles, до того як з'явилася formalized architecture
- **"Ukrainian legal AI"** — marketing language в landing page copy і social media posts під час beta launch

Ці назви відображали простий product vision: чат-бот для юридичних питань. Архітектурна складність прийшла пізніше.

## Evolution Through Branches

Гілки в репозиторії відображають еволюцію product thinking і architectural complexity:

### Simple Chat Phase

Ранні гілки (`new-design-v3-final`, early feature branches) — фокус на **chat UI**, simple request-response pattern. Naming: "chat", "assistant", "AI helper". Див. [[Lexery - Branch new-design-v3-final]].

### Law Database Phase

Гілки `before-LawDatabase` і `codex legal-rag-foundation` маркують перехід від generic chat до **law-specific retrieval**. Naming зміщується до "legal database", "legislation search", "law lookup". Див. [[Lexery - Branch before-LawDatabase]], [[Lexery - Branch codex legal-rag-foundation]].

### Legal Agent Architecture Phase

Гілка `Lexery-Legal-Agent-Architecture` — формалізація **agent pipeline** з stages (U1-U12), orchestrator, contracts. Naming: "legal agent", "pipeline", "stages". Це момент, коли "chat assistant" став "legal agent". Див. [[Lexery - Branch Lexery Legal Agent Architecture]].

### Brain Pipeline Phase

Поточна фаза — `apps/brain` як central pipeline engine. Naming: "Brain", "pipeline", "ORCH", "stages". Architecture matured від простого agent до multi-stage pipeline з recovery, retry, verification. Див. [[Lexery - Brain Architecture]].

## Current Naming Convention

### Product Components

| Name | What It Is | Package |
|------|-----------|---------|
| **Brain** | Pipeline engine — U1-U12 stages, ORCH, workers | `@lexery/brain` або `apps/brain` |
| **Portal** | Frontend — Next.js workspace shell, chat UI | `@lexery/portal` або `apps/portal` |
| **API** | Control plane — NestJS, REST endpoints, auth | `@lexery/api` або `apps/api` |
| **LLDBI** | Legislation admin — brain-admin, import management | частина `apps/brain` + workflows |

### Package Naming Convention

Monorepo packages follow `@lexery/` scope:

- **`@lexery/brain`** — core pipeline
- **`@lexery/api`** — control plane
- **`@lexery/portal`** — frontend
- **`@lexery/doclist-resolver-api`** — [[Lexery - DocList Surface|DocList]] resolver (Cloudflare Worker)
- **`@lexery/doclist-updater-db`** — [[Lexery - DocList Surface|DocList]] incremental updater
- **`@lexery/doclist-full-import`** — [[Lexery - DocList Surface|DocList]] full importer

Всі пакети живуть під `apps/` або `packages/` у monorepo структурі (PR #1 від [[Lexery - Yehor Puhach|Yehor]]).

## Approximate timeline

| Period | Dominant name |
| --- | --- |
| ~early 2025 | Mike Ross |
| ~mid 2025 | Ukrainian Lawyer (public) |
| ~late 2025 | Lexora (components / bridge) |
| ~2026 | Lexery / Lexery AI (current) |

Cross-check dates against [[Lexery - Timeline]] and [[Lexery - GitHub History]]; this table is **observed-order**, not audited to the day.

## How we know (evidence types)

1. **Git history** — renames, README edits, and import path changes.
2. **File names** — `LexoraLogo.tsx` vs `LexeryLogo.tsx` side by side in branding.
3. **Component imports** — which logo component the shell actually loads.
4. **README and package metadata** — repo titles and descriptions during beta.
5. **Branch names** — architectural phases reflected in branch naming conventions.

## Relations to other layers

- **Bridge repo** — carries both Lexora and Lexery artifacts; see [[Lexery - Legacy Architecture Bridge]].
- **Frontend narrative** — UI consolidation and design iterations: [[Lexery - Frontend and Brand Evolution]].
- **People** — who drove the bridge and pipeline: [[Lexery - Andrii Serediuk]].

## Related notes

- [[Lexery - Idea Evolution]]
- [[Lexery - Legacy Beta App]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Frontend and Brand Evolution]]
- [[Lexery - Timeline]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Corpus Evolution]] — naming of *data* products (LLDBI, legislation) vs *consumer* brand
- [[Lexery - Brain Architecture]]
- [[Lexery - DocList Surface]]

## Українською (коротко)

**Дуга назв:** Mike Ross → **Український Юрист** → Lexora → **Lexery / Lexery AI**. Докази — README, назви компонентів (`LexoraLogo` / `LexeryLogo`), імпорти в `Sidebar` / `LoadingScreen`, історія git у [[Lexery - Legacy Architecture Bridge|bridge-репо]].

**Поточна конвенція:** Brain (pipeline engine), Portal (frontend), API (control plane), LLDBI (legislation admin). Пакети під `@lexery/` scope у monorepo структурі.
