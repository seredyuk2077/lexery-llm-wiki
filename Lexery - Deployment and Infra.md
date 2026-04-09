---
aliases:
  - Deployment and Infra
tags:
  - lexery
  - data
  - infra
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: data
---

> [!info] Compiled from
> - `raw/codebase-snapshots/supabase-schema-2026-04-09.md`

# Lexery - Deployment and Infra

## Infrastructure Stack At A Glance

### Observed building blocks

- `apps/portal`:
  Next.js frontend
- `apps/api`:
  NestJS control plane
- `apps/brain`:
  Node legal runtime
- `apps/doclist-resolver-api`:
  Cloudflare Worker
- managed/storage layers across docs and code:
  Supabase, Qdrant, Cloudflare R2, OpenRouter

## Current Infra Roles

### Supabase

- identity / auth integration
- relational control-plane data
- run and supporting DB surfaces in architecture docs

### Qdrant

- vector / semantic retrieval roles
- present across legislation and memory architecture

### Cloudflare R2

- attachment overflow
- run artifacts
- legacy legislation canonical storage

### OpenRouter

- model routing layer for current AI calls in Brain and portal server routes

### Cloudflare Workers

- concrete current use in DocList resolver service

## Azure Target

### Observed in docs

- `03-azure-deployment.md` describes:
  `api-gateway`, `agent-gateway`, `agent-worker`
- Uses:
  ACA, VNet, KEDA, Key Vault, `ROLE=API` and `ROLE=WORKER`

### Drift warning

- `Observed`:
  current checked code does not yet prove this deployment split end-to-end.
- `Best reading`:
  Azure topology is a documented target architecture, not fully confirmed live runtime truth.

## GitHub / CI Evidence

- `apps/portal/.github/workflows/ci.yml`
- `.github/workflows/lldbi-brain-admin.yml`

### Meaning

- infra and verification are already subsystem-specific
- current project is not a single uniform deploy unit

## Portal Deployment Hints

- `apps/portal/Dockerfile` exists
- Portal README assumes server-side environment and OpenRouter key usage

## Legacy Infra Meaning

- Bridge repo legislation work shows infra maturation before monorepo productization.
- Lexery likely earned its current architecture through corpus and pipeline pain, not greenfield elegance.

## Best Synthesis

Lexery infra is currently a **hybrid stack**:

- product shell in modern web app form
- legal runtime in Node service form
- Cloudflare used concretely for data-plane utilities
- Azure described as target hosting shape
- managed data services used as domain scaffolding

## Main Risk

Documentation about desired deploy topology is richer than hard proof of current deployed topology.

## Топологія сховищ (за кодом)

У конфігурації [[Lexery - Brain Architecture|Brain]] (`apps/brain/lib/config.ts`) та CI видно **два логічні шари** керованих сервісів — окремо для продукту та для законодавчого корпусу.

### Supabase

- **Два проєкти (~2):** реляційна **Lexery legal-agent DB** (`SUPABASE_LEXERY_LEGAL_AGENT_DB_*`) для runs, control plane, MM-таблиць тощо, і окремий **Legislation** (`SUPABASE_LEGISLATION_*`) для метаданих законодавства / taxonomy (опційно, з graceful degrade).
- Детальніше про ролі: [[Lexery - Storage Topology]].

### Cloudflare R2

- **Два bucket за замовчуванням:** `legislation` (канонічний JSON / LLDBI) vs `lexery-legal-agent` (runs, overflow, MM Docs сирі артефакти — через `R2_RUNS_BUCKET` / `MM_DOCS_BUCKET`).
- Env aliases у коді: `R2_LEGISLATION_BUCKET`, `LLDBI_R2_BUCKET`, `R2_BUCKET_RUNS`.

### OpenRouter

- **Єдиний ключ для LLM і embeddings у Brain:** пріоритет **`OPENROUTER_API_KEY_BRAIN` > `OPENROUTER_API_KEY_ONLINE`** (`getOpenRouterKeyFromEnv`).

### Qdrant

- **Legislation cluster** — U4 law retrieval (`QDRANT_URL` / `QDRANT_CLUSTER_ENDPOINT_LEXERY_LEGISLATION_DB`), колекції на кшталт `lexery_legislation_chunks` / `lexery_legislation_acts`.
- **Lexery-LA cluster** — семантична пам’ять (`lexery_memory_semantic_v1`) та **MM Docs** (спільний endpoint за замовчуванням, окремі колекції); fallback на legislation для memory лише за явним прапором `MEMORY_QDRANT_ALLOW_LEGISLATION_FALLBACK`.

Перехресні пояснення: [[Lexery - Retrieval, LLDBI, DocList]], [[Lexery - Memory and Documents]], [[Lexery - Provider Topology]].

## See Also

- [[Lexery - Technology Stack]]
- [[Lexery - Product Surface]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Open Questions and Drift]]
- [[Lexery - Provider Topology]]
- [[Lexery - Storage Topology]]
- [[Lexery - Decision Registry]]
- [[Lexery - Drift Radar]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - DocList Surface]]
