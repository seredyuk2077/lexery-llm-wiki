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

Lexery’s backend spans multiple **external providers**. This note is a **map**, not a billing sheet: use it to know **who owns what dependency** when debugging [[Lexery - Brain Architecture|Brain]], [[Lexery - LLDBI Surface|LLDBI]], and [[Lexery - API and Control Plane|API]].

## LLM routing: OpenRouter

**OpenRouter** fronts model selection and vendor routing. Representative assignments (evolve with prompts):

- **`gpt-5.2`** — [[Lexery - ORCH and Clarification|ORCH]] decisions
- **`gpt-5-nano` / `gpt-4o-mini`** — meta-triage and lighter tasks
- Additional models — [[Lexery - U10 Writer|writer]] / [[Lexery - U11 Verify|verifier]] stacks per stage configuration

> [!info] Model drift
> Exact model IDs change with evals; treat OpenRouter as the **integration point** and code/config as **source of truth**.

## Compute / hosting: Azure

**Azure** is the documented deployment target for **Brain** and **API** (see `docs/architecture/backend` in-repo). Pair with [[Lexery - Deployment and Infra]] for environments and secrets.

## Databases: Supabase (two logical DBs)

- **LegalAgentDB** — [[Lexery - Run Lifecycle|runs]], [[Lexery - Import Proposal Loop|import proposals]], legal-agent tables
- **Main app DB** — auth, workspaces, subscriptions — typically via **Prisma** from the **NestJS** API layer

Both are **Postgres** under the hood; isolation is **logical** and **credential**-based.

## Redis

**Redis** backs:

- **BullMQ** job queues (often **one queue per pipeline stage**)
- **Run context** for in-flight processing
- Shared client management (e.g. **`redis-shared.ts`** patterns)

See [[Lexery - Storage Topology]] for how this differs from durable snapshots.

## Qdrant

**Qdrant** is the **vector database** for legislation and memory collections, including:

- **`lexery_legislation_acts`**
- **`lexery_legislation_chunks`**
- **Memory** collections for long-horizon agent features

Cross-link: [[Lexery - LLDBI Surface]].

## Object storage: Cloudflare R2

**Cloudflare R2** stores **legislation documents** and **user uploads**, often via **presigned URLs** for controlled direct access. Pair with [[Lexery - Retrieval, LLDBI, DocList|retrieval]] when debugging “file present but chunks missing.”

## Legislative source: Rada API

The **Verkhovna Rada** data feeds power [[Lexery - DocList Surface|DocList]] catalog updates and related importers.

## CI: GitHub Actions

**GitHub Actions** runs portal CI and scheduled jobs such as **`.github/workflows/lldbi-brain-admin.yml`** for [[Lexery - LLDBI Surface|LLDBI brain-admin]] scanning.

## Related

- [[Lexery - Deployment and Infra]]
- [[Lexery - Storage Topology]]
- [[Lexery - Brain Architecture]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - DocList Surface]]
- [[Lexery - API and Control Plane]]
