---
aliases:
  - Provider Topology
  - Providers
  - External Services
tags:
  - lexery
  - data
  - infra
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: data
---

# Lexery — Provider Topology

Lexery's backend spans multiple **external providers**. This note is a **map**, not a billing sheet: use it to know **who owns what dependency** when debugging [[Lexery - Brain Architecture|Brain]], [[Lexery - LLDBI Surface|LLDBI]], and [[Lexery - API and Control Plane|API]].

## LLM routing: OpenRouter

**OpenRouter** є єдиним LLM provider для всіх model calls у системі. Замість прямих API-ключів до OpenAI, Anthropic чи інших провайдерів, Lexery маршрутизує всі запити через OpenRouter, що дає:

- **Multi-model routing** — один API endpoint для всіх моделей, без окремих SDK чи credentials per vendor
- **Cost tracking** — централізований dashboard з per-request cost visibility, budget alerts, usage breakdowns по моделях
- **Fallback** — якщо primary model provider недоступний, OpenRouter може автоматично переключитися на альтернативу
- **Unified billing** — один рахунок замість N окремих provider invoices

### Key Precedence

Система використовує ієрархію API ключів:

1. **`OPENROUTER_API_KEY_BRAIN`** — dedicated key для [[Lexery - Brain Architecture|Brain]] pipeline; має priority і окремий budget ceiling
2. **`OPENROUTER_API_KEY_ONLINE`** — fallback key для online/portal requests; використовується коли Brain key не задано або для non-pipeline calls

Ця ієрархія дозволяє ізолювати Brain pipeline billing від Portal user-facing traffic.

### Model Tiers

Кожна модель обрана під конкретний тип задачі в pipeline:

| Tier | Model | Призначення | Вартість |
|------|-------|-------------|----------|
| **Premium** | `gpt-5.2` | [[Lexery - ORCH and Clarification|ORCH]] decisions, [[Lexery - U8 Legal Reasoning|U8 Legal Reasoning]], [[Lexery - U10 Writer|U10 Writer]] — задачі, де якість юридичного аналізу критична | Висока |
| **Classification** | `gpt-4o-mini` | [[Lexery - U2 Query Profiling|U2 Query Profiling]], meta-triage, intent classification — швидкі lightweight tasks | Низька |
| **Routine** | `gpt-5-nano` | Delta summaries, [[Lexery - Memory and Documents|memory]] operations, routine formatting — максимально дешеві повторювані задачі | Мінімальна |

> [!info] Model drift
> Exact model IDs змінюються з evals; трактуйте OpenRouter як **integration point**, а code/config як **source of truth**.

## Compute / hosting: Azure

**Azure** є задокументованою deployment target для **Brain** і **API** (див. `docs/architecture/backend` in-repo). Pair with [[Lexery - Deployment and Infra]] для environments і secrets.

## Databases: Supabase (два проєкти)

Lexery використовує **два окремі Supabase проєкти** (не просто logical databases):

- **LegalAgentDB** (`lexery-legal-agent-db`) — [[Lexery - Run Lifecycle|runs]], [[Lexery - Import Proposal Loop|import proposals]], legal-agent tables, sessions, [[Lexery - Memory and Documents|memory]]
- **Legislation RAG DB** (`legislation-RAG`) — legislation documents, import jobs, catalog metadata для [[Lexery - DocList Surface|DocList]]

Обидва — **Postgres** під капотом; ізоляція — на рівні **Supabase projects** і **credentials**. Cross-DB joins не існують на SQL рівні.

## Redis

**Redis** забезпечує:

- **BullMQ** job queues — зазвичай **one queue per pipeline stage** ([[Lexery - Brain Architecture]])
- **Run context cache** — per-run working state під час активної обробки, що зберігає intermediate results між stages
- **Shared client management** (наприклад, **`redis-shared.ts`** patterns) з namespace isolation через **`REDIS_QUEUE_NAMESPACE`**

Див. [[Lexery - Storage Topology]] для різниці між Redis ephemeral state і durable snapshots.

## Qdrant Cloud

**Qdrant Cloud** — vector database для legislation і memory collections:

- **`lexery_legislation_acts`** — metadata по ~374 нормативних актах
- **`lexery_legislation_chunks`** — ~21,266 текстових chunks для semantic search
- **Lexery-LA Memory** — semantic index для [[Lexery - Memory and Documents|long-horizon agent memory]]
- **MM Docs** — vectors для [[Lexery - U9 Assemble|document assembly]] і multi-modal content

Cross-link: [[Lexery - LLDBI Surface]].

## Object storage: Cloudflare R2 (два бакети)

**Cloudflare R2** зберігає дані у двох окремих бакетах:

- **`legislation`** — canonical act JSON files, structured legislation data від [[Lexery - DocList Surface|Rada catalog]]
- **`lexery-legal-agent`** — run artifacts, [[Lexery - U9 Assemble|MM offload]], document chunks, user uploads

Доступ через **presigned URLs** для controlled direct access. Pair з [[Lexery - Retrieval, LLDBI, DocList|retrieval]] при debug "file present but chunks missing."

## Cloudflare Workers

**Cloudflare Workers** хостять lightweight API services:

- **`@lexery/doclist-resolver-api`** — act resolution і disambiguation endpoint для [[Lexery - DocList Surface|DocList]]
- Інші workers для edge-level routing і caching

## Legislative source: Rada API

**Verkhovna Rada** data feeds забезпечують [[Lexery - DocList Surface|DocList]] catalog updates і related importers.

## CI: GitHub Actions

**GitHub Actions** запускає portal CI і scheduled jobs, зокрема **`.github/workflows/lldbi-brain-admin.yml`** для [[Lexery - LLDBI Surface|LLDBI brain-admin]] scanning.

## Related

- [[Lexery - Deployment and Infra]]
- [[Lexery - Storage Topology]]
- [[Lexery - Brain Architecture]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - DocList Surface]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Cost Ledger]]

## See Also

- [[Lexery - Technology Stack]]
- [[Lexery - Glossary]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Decision Registry]]
