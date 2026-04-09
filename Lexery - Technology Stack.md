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
> - `raw/codebase-snapshots/supabase-schema-2026-04-09.md`
> - `raw/architecture-docs/LEXERY_LEGAL_AI_AGENT_ARCHITECTURE.md`

# Lexery - Technology Stack

## Runtime

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 + React 19 | Portal UI |
| UI Kit | shadcn/ui + Tailwind | Components |
| Backend API | NestJS + Prisma | Control plane, auth, storage |
| Brain Pipeline | Node.js + TypeScript | U1-U12 legal agent runtime |
| Queue | Redis + BullMQ | Pipeline orchestration |
| Run Context | Redis | Fast per-run state |

## AI / LLM

| Component | Provider | Model |
|-----------|----------|-------|
| Legal reasoning (U10) | OpenRouter | `gpt-5.2` (primary) |
| Classification (U2) | OpenRouter | `gpt-4o-mini` |
| Routine tasks | OpenRouter | `gpt-5-nano` |
| Embeddings | OpenRouter | OpenAI embeddings |
| Key precedence | env | `OPENROUTER_API_KEY_BRAIN` > `OPENROUTER_API_KEY_ONLINE` |

## Storage

| What | Technology | Details |
|------|-----------|---------|
| Legal Agent DB | Supabase (PostgreSQL) | runs, sessions, memory, documents |
| Legislation RAG DB | Supabase (PostgreSQL) | 374 Ukrainian legal acts |
| Vector DB | Qdrant | Legislation chunks + memory semantic |
| Object Storage | Cloudflare R2 | 2 buckets: `legislation`, `lexery-legal-agent` |
| Queue/Cache | Redis | BullMQ queues, run context |

## Monorepo

| Package | Type | Tech |
|---------|------|------|
| `@lexery/brain` | App | Node.js, TypeScript, BullMQ |
| `@lexery/api` | App | NestJS, Prisma, Supabase |
| `@lexery/portal` | App | Next.js, React 19, shadcn |
| `@lexery/lldbi` | CLI | Node.js, Qdrant, R2 |
| `@lexery/doclist-*` | Apps | Qdrant, Cloudflare Workers |
| Build | Turbo | Turborepo for monorepo orchestration |
| Package Manager | pnpm | Workspace management |

## Infrastructure

| Service | Provider | Role |
|---------|----------|------|
| Hosting | Cloudflare (Workers) | DocList resolver API |
| Database | Supabase (2 projects) | Persistence |
| Vectors | Qdrant Cloud | Semantic search |
| Objects | Cloudflare R2 | Docs, legislation canonical JSON |
| LLM | OpenRouter | All AI calls, multi-model |
| CI/CD | GitHub Actions | Weekly brain-admin batch |
| Version Control | GitHub | `lexeryAI/Lexery` monorepo |

## Data Sources

| Source | Volume | What |
|--------|--------|------|
| rada.gov.ua | 374 acts | Ukrainian legislation (parsed, chunked, indexed) |
| User uploads | 679 docs | Documents attached to conversations |
| User queries | 26,661 runs | Legal questions (Ukrainian) |
| Memory | 3,553 items | Extracted user knowledge |

## See Also

- [[Lexery - Brain Architecture]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - Provider Topology]]
- [[Lexery - Storage Topology]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Current State]]
