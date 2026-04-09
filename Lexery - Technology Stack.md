---
aliases: [Tech Stack, Stack]
tags: [lexery, product, brain, data]
status: active
layer: product
created: 2026-04-09
updated: 2026-04-09
sources: 3
---

> [!info] Compiled from
> - `raw/codebase-snapshots/monorepo-packages-2026-04-09.md`
> - `raw/codebase-snapshots/supabase-live-stats-2026-04-09.md`
> - `raw/codebase-snapshots/brain-config.ts`

# Lexery - Technology Stack

Повний реєстр технологій, що використовуються у Lexery. Кожен вибір має причину — дешевий AI через [[Lexery - Provider Topology|OpenRouter]], durable queues через Redis, multi-tenant через Supabase RLS.

## Runtime Stack

| Layer | Technology | Version / Detail | Purpose |
|-------|-----------|-----------------|---------|
| Frontend | Next.js + React 19 | `@lexery/portal` | Portal UI — чат, system prompt editor, subscription plans |
| UI Kit | shadcn/ui + Tailwind CSS | Latest | Component library + utility-first CSS |
| Backend API | NestJS + Prisma | `@lexery/api` | REST API, auth (email/sms/oauth), storage presigned URLs |
| Brain Pipeline | Node.js + TypeScript | `@lexery/brain`, port 3081 | U1-U12 legal agent runtime, 94 test files |
| Queue | Redis + BullMQ | `inmemory` or `redis` driver | Event-driven pipeline orchestration, DLQ, reclaim |
| Run Context | Redis | Compression > 8 KB | Per-run hot state during pipeline processing |
| Package Manager | pnpm | Workspaces | Monorepo dependency management |
| Build System | Turborepo | Turbo | Monorepo build orchestration |

## AI / LLM Layer

| Component | Model | Provider | Timeout | Max Tokens | Config Key |
|-----------|-------|----------|---------|------------|------------|
| Legal reasoning (U10) | `gpt-5.2` | OpenRouter | 55s | 4,096 | `LEGAL_AGENT_MODEL_ID` |
| Prompt composer (complex) | `gpt-5.2` | OpenRouter | 15s | 512 | `PROMPT_COMPOSER_MODEL_COMPLEX_ID` |
| Prompt composer (simple) | `gpt-5-nano` | OpenRouter | 15s | 512 | `PROMPT_COMPOSER_MODEL_SIMPLE_ID` |
| Classification (U2) | `gpt-4o-mini` | OpenRouter | 10s | — | `CLF_MODEL_ID` |
| AI domain classifier | `gpt-4o-mini` | OpenRouter | 6s | 224 | `U2_AI_DOMAIN_MODEL` |
| Retrieval planner (U4) | `gpt-4o-mini` | OpenRouter | 8s | 512 | `U4_PLANNER_MODEL_ID` |
| Act planner (U4) | `gpt-4o-mini` | OpenRouter | 8s | 320-550 | `U4_ACT_PLANNER_MODEL` |
| Query rewrite (U4) | `gpt-4o-mini` | OpenRouter | 15s | 720 | `U4_QUERY_REWRITE_MODEL` |
| Routing hints (U4) | `gpt-4o-mini` | OpenRouter | 10s | 384 | `U4_ROUTING_HINTS_MODEL` |
| Repair (U10 post-write) | `gpt-4o-mini` | OpenRouter | — | — | `U10_REPAIR_MODEL_ID` |
| Embeddings | `text-embedding-3-small` | OpenRouter→OpenAI | 5s | 1536d | `LLDBI_EMBED_MODEL_ID` |

**Стратегія:** GPT-5.2 тільки для legal reasoning і складних prompt composer calls. Все інше — gpt-4o-mini (дешевий, швидкий, достатньо якісний для structured JSON). Single API key: `OPENROUTER_API_KEY_BRAIN` > `OPENROUTER_API_KEY_ONLINE`.

## Storage Layer

| What | Technology | Provider | Scale |
|------|-----------|----------|-------|
| Legal Agent DB | PostgreSQL (Supabase) | Supabase Project 1 | 370 MB runs, 242 tenants, 935 sessions |
| Legislation RAG DB | PostgreSQL (Supabase) | Supabase Project 2 | 374 acts, 42-column schema |
| Vector DB (legislation) | Qdrant Cloud | Qdrant | `lexery_legislation_chunks` + `lexery_legislation_acts` |
| Vector DB (memory + docs) | Qdrant Cloud | Same or separate cluster | Semantic memory + MM Docs chunks |
| Object Storage (legislation) | Cloudflare R2 | `legislation` bucket | Canonical legislation JSON (parsed from rada.gov.ua) |
| Object Storage (runs) | Cloudflare R2 | `lexery-legal-agent` bucket | Retrieval traces, MM Docs payloads, query overflow |
| Queue/Cache | Redis | Self-hosted or managed | BullMQ queues + RunContext store |

**Зв'язок:** Supabase stores metadata and durable state; R2 stores large payloads; Qdrant provides semantic search; Redis handles hot orchestration state. Підхід "best tool for each job" замість monolithic DB.

## Monorepo Packages

| Package | Type | Stack | Description |
|---------|------|-------|-------------|
| `@lexery/brain` | App | Node.js, TS, BullMQ | U1-U12 pipeline runtime |
| `@lexery/api` | App | NestJS, Prisma, Supabase | Backend API, auth, storage |
| `@lexery/portal` | App | Next.js 14, React 19, shadcn | User-facing web application |
| `@lexery/lldbi` | CLI | Node.js, Qdrant, R2 | Legislation database management |
| `@lexery/doclist-resolver` | App | Cloudflare Workers | Act disambiguation API |
| `@lexery/doclist-updater` | App | Node.js | Rada catalog synchronization |
| `@lexery/contracts` | Package | Zod | Shared schemas between frontend/backend/agent |
| Build | Turbo | Turborepo | Workspace orchestration |

## Infrastructure Services

| Service | Provider | Billing | Role |
|---------|----------|---------|------|
| Database (2 projects) | Supabase | Free tier + Pro | Persistence, RLS, auth |
| Vectors | Qdrant Cloud | Managed | Semantic search over legislation + memory |
| Objects (2 buckets) | Cloudflare R2 | Pay-per-use | Canonical docs, traces, overflow |
| LLM routing | OpenRouter | Pay-per-token | All AI calls, multi-model |
| DocList API | Cloudflare Workers | Free tier | Act resolver edge function |
| CI/CD | GitHub Actions | Free tier | Weekly `brain-admin` batch, linting |
| VCS | GitHub | `lexeryAI/Lexery` | Private monorepo |

## Key Config Knobs (brain `lib/config.ts`)

| Category | Key Knobs | Default |
|----------|-----------|---------|
| Rate limiting | `RUNS_PER_MINUTE`, `MAX_CONCURRENT_RUNS` | 30 rpm, 10 concurrent |
| U2 concurrency | `U2_WORKER_CONCURRENCY`, `U2_LLM_CONCURRENCY` | 10 workers, 4 LLM |
| U4 retrieval | `LLDBI_TOP_K`, `U4_GOALS_MAX`, `U4_HITS_CAP` | 40, 3, 100 |
| U5 gate | `GATE_MIN_HITS_THRESHOLD`, `GATE_MIN_AVG_SCORE` | 3 hits, 0.18 score |
| U9 budget | `U9_MAX_LAW_SNIPPETS`, `U9_MAX_TOTAL_LAW_CHARS` | 20 snippets, 30K chars |
| U10 write | `LEGAL_AGENT_MAX_TOKENS`, `LEGAL_AGENT_TIMEOUT_SEC` | 4096 tokens, 55s |
| Attachments | `ATTACHMENT_INLINE_MAX_BYTES` | 512 KB inline, 2 MB request |
| Query overflow | `QUERY_R2_THRESHOLD_BYTES` | 32 KB → R2 |

Повний config: 635 рядків у `apps/brain/lib/config.ts` — кожна стадія має свої env knobs із bounded ranges.

## Data Sources and Volumes

| Source | Volume | What |
|--------|--------|------|
| rada.gov.ua | 374 acts (360 in force) | Ukrainian legislation, parsed → Qdrant + R2 |
| Supreme Court case law | ~1000 entries in R2 | Case law for future RAG expansion |
| User queries | 26,704 runs | Legal questions in Ukrainian |
| User uploads | 679 docs | Documents attached via MM Docs |
| Memory extraction | 3,565 items | Semantic user knowledge |
| Messages | 7,239 | User + assistant conversation messages |

## CI/CD Pipeline

| Trigger | What | Details |
|---------|------|---------|
| `brain-admin` (weekly) | LLDBI batch: import proposals, act updates | GitHub Actions, `apps/lldbi/brain-admin` |
| pnpm test scripts | 94 test files covering U2-U12, MM, ORCH, gateway | Local `tsx` runners + CI |
| Manual smoke | `brain:verify:*`, `brain:concurrency:smoke` | Live dev environment validation |

## See Also

- [[Lexery - Brain Architecture]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - Provider Topology]]
- [[Lexery - Storage Topology]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Current State]]
- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - Cost Ledger]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Memory and Documents]]
