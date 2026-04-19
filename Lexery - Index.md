---
aliases:
  - Index
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-19
status: observed
layer: meta
---

> [!lexery-hero] Lexery Wiki
> ![[_assets/brand/lexery-wordmark-dark-bg.svg|280]]
>
> Каталог `Lexery - *.md` + automation у `_system/`. **Hub:** [[Lexery - Project Brain]] · **Ops:** [[Lexery - Executive Ops Dashboard]] · **Integrity:** [[Lexery - Data Integrity Dashboard]] · **Graph:** [[Lexery - Graph Hygiene]]

> [!lexery-strip] Швидкий старт
> - [[Lexery - Project Brain]] — зони змісту та навігація
> - [[Lexery - Stale Pages Queue]] — що оновити за датою `updated:`
> - [[Lexery - Neural Link Hub]] — MOC + пропозиції лінків (мінімум wikilinkів у тілі)
> - У Obsidian увімкни CSS snippet **lexery-wiki** (*Appearance → CSS snippets*)

> [!info] Compiled from
> - Codebase analysis and session synthesis

# Lexery — Index

> Каталог усіх сторінок wiki. Оновлюється при **ingest** і **maintenance** (див. [[Lexery - Maintenance Runbook]]).

## Brain (Pipeline)

| Page | Summary | Layer |
|------|---------|-------|
| [[Lexery - U1-U12 Runtime]] | Повний довідник 12-етапного pipeline від Gateway до Deliver | brain |
| [[Lexery - Brain Architecture]] | Верхньорівнева архітектура `apps/brain` і межі сервісу | brain |
| [[Lexery - Run Lifecycle]] | Стани run, переходи та схема snapshot | brain |
| [[Lexery - Public Trace]] | Виконавчий trace і події API для спостереження за run | brain |
| [[Lexery - ORCH and Clarification]] | Обмежена оркестрація, пауза/відновлення, runtime control | brain |
| [[Lexery - Retry and Recovery]] | Контракти повторів і обмежені механізми відновлення | brain |
| [[Lexery - Pipeline Health Dashboard]] | Зведений health-дашборд pipeline: метрики, funnel, MM, throughput | brain |
| [[Lexery - Coverage Gap Honesty]] | Як система чесно поводиться при браку доказів | brain |
| [[Lexery - U1 Gateway]] | Intake: HTTP/черга, R2-вкладення | brain |
| [[Lexery - U2 Query Profiling]] | Класифікація запиту, LLDBI hints, виявлення домену | brain |
| [[Lexery - U3 Planning]] | Планування виконання та маршрутизація стадій | brain |
| [[Lexery - U4 Retrieval]] | RAG, пошук по корпусу, підготовка контексту | brain |
| [[Lexery - U5 Gate]] | Перевірки якості та політики після retrieval | brain |
| [[Lexery - U6 Recovery]] | Відновлення та альтернативні шляхи при збоях | brain |
| [[Lexery - U7 Evidence Assembly]] | Збір і структурування evidence для reasoning | brain |
| [[Lexery - U8 Legal Reasoning]] | Юридичне міркування на базі зібраних доказів | brain |
| [[Lexery - U9 Assemble]] | Збірка фінального контенту з проміжних артефактів | brain |
| [[Lexery - U10 Writer]] | Стадія writer / Legal Agent і генерація тексту | brain |
| [[Lexery - U11 Verify]] | Верифікація виходу та узгодженість із джерелами | brain |
| [[Lexery - U12 Deliver]] | Доставка результату клієнту та фіналізація run | brain |
| [[Lexery - Brain Test and Verify Map]] | Повний каталог pnpm scripts: unit, verify, stress, forensics | brain |
| [[Lexery - Brain Environment Reference]] | Довідник змінних середовища `apps/brain/lib/config.ts` | brain |
| [[Lexery - Legal Agent Quality Priorities]] | Пріоритети якості: soft queries, RAG mindset, мінімальні чеки | brain |

## Architecture & Infrastructure

| Page | Summary | Layer |
|------|---------|-------|
| [[Lexery - Deployment and Infra]] | Хостинг, керовані сервіси, топологія деплою | data |
| [[Lexery - Provider Topology]] | OpenRouter, Azure, Supabase, Redis, Qdrant, R2, Rada | data |
| [[Lexery - Storage Topology]] | Сховища, ролі та патерни доступу | data |

## Product

| Page | Summary | Layer |
|------|---------|-------|
| [[Lexery - Product Surface]] | Високорівнева оболонка продукту навколо Brain | product |
| [[Lexery - Portal Surface Map]] | Інвентаризація поточного `apps/portal` | product |
| [[Lexery - API and Control Plane]] | NestJS, Prisma, auth, tenant/workspace/subscription | product |
| [[Lexery - Contracts and Run Schema]] | Спільні boundary-об’єкти run, вкладень, auth snapshot | product |
| [[Lexery - Business Model]] | Плани, feature gating, монетизація, pricing drift | product |
| [[Lexery - Current State]] | Спостережуваний стан репо та GitHub на дату зрізу | product |
| [[Lexery - Technology Stack]] | Єдиний довідник runtime, AI, storage, monorepo, infra | product |
| [[Lexery - Branch Divergence]] | Розходження `origin/dev` і `legal-agent-brain-dev` | product |
| [[Lexery - Frontend Refactor Context]] | Linear-документ про логіку refactor vs feature | product |

## History

| Page | Summary | Layer |
|------|---------|-------|
| [[Lexery - Timeline]] | Хронологія від beta app до поточного monorepo | history |
| [[Lexery - Idea Evolution]] | Концептуальна трансформація продукту | history |
| [[Lexery - Repo Constellation]] | Усі релевантні репо та їхні ролі в екосистемі | meta |
| [[Lexery - Legacy Beta App]] | Найраніший consumer-facing ідентитет продукту | history |
| [[Lexery - Legacy Architecture Bridge]] | Критичний міст, де сформувалась архітектура Brain | history |
| [[Lexery - Legacy Branch Families]] | Історичні лінії гілок (v3, case-law RAG, legal-rag-foundation) | history |
| [[Lexery - Branch before-LawDatabase]] | Checkpoint перед прискоренням law-database | history |
| [[Lexery - Branch new-design-v3-final]] | Design v3 і зближення з law-database | history |
| [[Lexery - Branch Supreme Court Case Law RAG]] | Case-law і corpus-engineering mega-branch | history |
| [[Lexery - Branch Lexery Legal Agent Architecture]] | Найчіткіший прямий предок поточного Brain | history |
| [[Lexery - Branch codex legal-rag-foundation]] | Пізній попередник retrieval-hardening | history |
| [[Lexery - Corpus Evolution]] | Еволюція legislation / DocList / LLDBI як підсистеми | history |
| [[Lexery - Frontend and Brand Evolution]] | UI, workspace і бренд від beta до Lexery | history |
| [[Lexery - Naming Evolution]] | Mike Ross → Ukrainian Lawyer → Lexora → Lexery AI | history |
| [[Lexery - GitHub History]] | PR-реєстр, сім’ї гілок, remote, контриб’ютори | history |

## Team & People

| Page | Summary | Layer |
|------|---------|-------|
| [[Lexery - Team and Operating Model]] | Люди, ролі, agent-assisted розробка | team |
| [[Lexery - Who Built What]] | Мапа контрибуцій: хто що будував у репо | team |
| [[Lexery - Andrii Serediuk]] | Засновник, архітектурна влада, власник Brain-домену | team |
| [[Lexery - Yehor Puhach]] | Backend engineer: NestJS, monorepo, auth | team |
| [[Lexery - Olexandr]] | Frontend engineer: portal / workspace UI | team |
| [[Lexery - Linear Roadmap]] | Проєкти, issues, віхи: від архітектури до виконання | team |
| [[Lexery - PR Chronology]] | Журнал pull request і патерни merge | team |

## Governance & Meta

| Page | Summary | Layer |
|------|---------|-------|
| [[Lexery - Index]] | Майстер-навігація: каталог усіх сторінок wiki | meta |
| [[Lexery - Project Brain]] | Центральний hub і головна навігація compiled wiki | meta |
| [[Lexery - Source Map]] | Ієрархія джерел, trust model, кластери документів | meta |
| [[Lexery - Log]] | Хронологічний журнал ingest і обслуговування wiki | meta |
| [[Lexery - Open Questions and Drift]] | Відомі суперечності, неповні істини, невирішені інтеграції | governance |
| [[Lexery - Decision Registry]] | Журнал архітектурних і продуктових рішень | governance |
| [[Lexery - Glossary]] | Словник термінів і лексики Lexery | meta |
| [[Lexery - Drift Radar]] | Активні суперечності та розходження джерел | governance |
| [[Lexery - Unknowns Queue]] | Відомі невідомі, що потребують розслідування | governance |
| [[Lexery - Source Registry]] | Реєстр усіх ingested джерел | meta |
| [[Lexery - Neural Link Hub]] | Авто-MOC, scored link ideas, orphans, експорт `link-graph.json` | meta |
| [[Lexery - Auto Snapshot]] | Автозріз метрик з `raw/` (перезаписується auto-fill) | meta |
| [[Lexery - Data Integrity Dashboard]] | Trust, consistency, freshness (truth-audit) | meta |
| [[Lexery - Executive Ops Dashboard]] | Щоденний операційний зріз | meta |
| [[Lexery - Ops Rollup]] | Історія maintenance-прогонів (deep) | meta |
| [[Lexery - Stale Pages Queue]] | Сторінки з простроченим `updated:` | meta |
| [[Lexery - Graph Hygiene]] | Як прибрати хаос у Obsidian Graph | meta |
| [[Lexery - Graph Metrics]] | Ступінь зв’язності з link-graph (deep) | meta |
| [[Lexery - Wiki Quality Contract]] | Контракт якості, raw↔wiki, trust | governance |
| [[Lexery - Cost Ledger]] | Облік витрат AI на підтримку wiki | meta |
| [[Lexery - Maintenance Runbook]] | Як підтримувати second brain | meta |
| [[Lexery - Automation Architecture]] | Дизайн самопідтримуваного ingest-pipeline | meta |

## Data & Retrieval

| Page | Summary | Layer |
|------|---------|-------|
| [[Lexery - Retrieval, LLDBI, DocList]] | Поточні площини retrieval і корпусу | data |
| [[Lexery - Memory and Documents]] | Memory manager і документні поверхні | data |
| [[Lexery - LLDBI Surface]] | Qdrant legislation index, admin CLI, витягування сигналів | data |
| [[Lexery - DocList Surface]] | Каталог Rada, reason codes дизамбігуації | data |
| [[Lexery - Import Proposal Loop]] | Pipeline Brain → LLDBI import proposals | data |

## Canvases

| Canvas | Description |
|--------|-------------|
| [[Lexery - Master Map.canvas|🗺️ Master Map]] | Повна топологія wiki — 6 зон |
| [[Lexery - Runtime Graph.canvas|⚙️ Runtime Graph]] | U1-U12 pipeline flow |
| [[Lexery - Product Graph.canvas|📦 Product Graph]] | Product surfaces and state |
| [[Lexery - History Graph.canvas|📜 History Graph]] | Historical evolution |
| [[Lexery - Infrastructure Graph.canvas|🏗️ Infrastructure Graph]] | Storage, cloud, retrieval topology |
| [[Lexery - Team Graph.canvas|👥 Team Graph]] | Team structure and ownership |
| [[Lexery - Branch Lineage.canvas|🌿 Branch Lineage]] | Git branch family tree |

## Raw Sources

Raw immutable sources live in `raw/`:
- `github-prs/` — 10 PRs (JSON + markdown)
- `github-commits/` — 66 commits (2026)
- `architecture-docs/` — 4 canonical architecture docs
- `codebase-snapshots/` — DB schema, monorepo packages

## Statistics

- **Pages:** 82+ markdown hub pages (`Lexery - *.md`; canvas-и окремо)
- **Lines (content pages):** ~11.5k+ (aggregate `wc -l`; зростає з кожним deep pass)
- **Canvases:** 7
- **Raw sources:** `raw/` (оновлюється `scan-codebase.mjs`)
- **Frontmatter coverage:** 100%
- [[Lexery - Contributing]]
