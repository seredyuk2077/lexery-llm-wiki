---
aliases:
  - Current State
tags:
  - lexery
  - product
  - metrics
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: product
---

> [!info] Compiled from
> - Live Supabase snapshot (Lexery legal agent DB), `2026-04-09`
> - Prior wiki baseline: `raw/codebase-snapshots/supabase-live-stats-2026-04-09.md`
> - Legislation RAG corpus counts (Qdrant + document registry), `2026-04-09`

# Lexery - Current State

## Snapshot Date

- This page reflects **production-adjacent** database metrics and the observed repo/integration posture on **`2026-04-09`**.
- Numbers below are point-in-time; for how runs move through stages, see [[Lexery - Run Lifecycle]] and [[Lexery - Contracts and Run Schema]].

## One-Screen Summary

Lexery зараз already має:

- реальний legal brain runtime у `apps/brain` — див. [[Lexery - Brain Architecture]], [[Lexery - U1-U12 Runtime]]
- реальний product/frontend shell у `apps/portal` — [[Lexery - Portal Surface Map]], [[Lexery - Product Surface]]
- реальний control plane skeleton у `apps/api` — [[Lexery - API and Control Plane]]
- реальні corpus/admin surfaces у `apps/lldbi`, doclist services, and retrieval paths — [[Lexery - LLDBI Surface]], [[Lexery - DocList Surface]], [[Lexery - Retrieval, LLDBI, DocList]]

Але ці частини ще не зведені в один clean integrated mainline — [[Lexery - Branch Divergence]], [[Lexery - Open Questions and Drift]].

## Current Local Repo Status

### Branch

- Current local branch (typical active line):
  `legal-agent-brain-dev`
- Remote tracking:
  `origin/legal-agent-brain-dev`
- Status:
  ahead by `10` commits *(local snapshot; verify with `git status` before relying on this narrative)*

### Worktree

- Dirty worktree concentrated in:
  `apps/brain`, `apps/lldbi`, `apps/doclist-resolver-api`, `docs`
- Untracked files (example from prior snapshot):
  `apps/brain/lib/redis-shared.ts`
  `apps/brain/tools/u4/test_query_rewrite_phase_units.ts`

### Meaning

- **Observed:** the active center of work is still Brain/runtime and orchestration policy, not only the product shell.
- For pipeline-stage semantics and recovery knobs, tie metrics below to [[Lexery - Retry and Recovery]], [[Lexery - ORCH and Clarification]], [[Lexery - U6 Recovery]].

## Current Remote Mainline Status

- Default branch:
  `dev`
- `origin/dev` contains:
  auth refactor, shared contracts, subscription plan UI, richer frontend profile/auth work.
- Divergence vs local `HEAD` (historical snapshot):
  `21` commits only on `origin/dev`
  `26` commits only on local `HEAD`

## What Is Already Real

### Product surfaces

- `apps/portal` is a real Next.js app, not a placeholder.
- `apps/api` is a real NestJS control plane skeleton with auth, workspace, storage.
- `apps/portal` already has chat, attachments, sidebar, settings, workspace screen, local repository layers, server-side OpenRouter routes.

### Brain surfaces

- `apps/brain` has module directories for:
  gateway, classify, plan, retrieval, gate, expand, doclist, import, assemble, reasoning, verify, write, deliver, mm, orchestrator.
- Stage-level detail maps to wiki units such as [[Lexery - U1 Gateway]], [[Lexery - U3 Planning]], [[Lexery - U4 Retrieval]], [[Lexery - U5 Gate]], [[Lexery - U7 Evidence Assembly]], [[Lexery - U9 Assemble]], [[Lexery - U10 Writer]], [[Lexery - U11 Verify]], [[Lexery - U12 Deliver]].
- Recent branch history shows active ORCH / clarification / retry / bounded recovery work — align operational views with [[Lexery - Pipeline Health Dashboard]] and [[Lexery - Public Trace]].

### Infra surfaces

- `apps/doclist-resolver-api` is a Cloudflare Worker surface — [[Lexery - Deployment and Infra]].
- `apps/lldbi` has brain-admin and infra surfaces.
- Storage and provider layout: [[Lexery - Storage Topology]], [[Lexery - Provider Topology]], [[Lexery - Technology Stack]].

## What Is Still Partial

- billing provider integration
- fully unified plan contract across API, portal, and brain envelopes
- fully integrated brain-to-api-to-portal mainline path
- fully trustworthy doc freshness across root docs and subsystem docs — [[Lexery - Drift Radar]], [[Lexery - Maintenance Runbook]]

## Strongest Current Truth

- **Observed:** `apps/brain` is the most mature technical surface in domain depth.
- **Observed:** `origin/dev` is the most current product-shell/mainline surface.
- **Inferred:** the project’s central integration problem is not “what should we build?” but “how do we merge the two already-moving systems?” — see [[Lexery - Frontend Refactor Context]], [[Lexery - Decision Registry]].

## Production Metrics

This section is the **authoritative numeric snapshot** for `2026-04-09`. Use it alongside [[Lexery - Cost Ledger]] for economics and [[Lexery - Corpus Evolution]] for how corpora grow over time.

### Run status distribution

Total recorded runs (**all statuses**): **~26,704**.

| Status        | Count  | Notes |
| ------------- | ------ | ----- |
| `completed`   | 17,183 | Terminal success path |
| `Planning`    | 7,449  | Dominant non-terminal bucket; queue / planner backlog |
| `Profiling`   | 895    | Early pipeline / profiling stage |
| `Intake`      | 705    | Earliest stage; ingress + classification neighborhood |
| `failed`      | 277    | Terminal failure |
| `U10_RUNNING` | 100    | Writer in flight |
| `U11_DONE`    | 60     | Post-writer verify handoff region |
| `U12_RUNNING` | 20     | Deliver stage active |
| `U10_DONE`    | 12     | Writer finished; downstream pending |
| `U11_RUNNING` | 3      | Verify in flight |

**Derived shares (rounded):**

| Slice | Count | ~% of total |
| ----- | ----- | ----------- |
| Completed | 17,183 | **64.3%** |
| Failed | 277 | **1.0%** |
| Early backlog (Intake + Profiling + Planning) | 9,049 | **33.9%** |
| Late-stage in-flight (U10–U12 running/done intermediates) | 195 | **0.7%** |

> [!tip] Reading the backlog
> The large **`Planning`** population usually dominates “stuck” narratives. Treat it as a **hypothesis surface**: cancelled client requests, orchestrator timeouts before hardening, Redis/queue visibility gaps, or policy gates that never transitioned the run row. Cross-check with [[Lexery - Retry and Recovery]] and runtime notes in [[Lexery - U3 Planning]].

### Completed-run latency

| Metric | Value |
| ------ | ----- |
| Average duration (completed runs) | **23.6 s** |

Interpretation hook: sub-30s average for **completed** work suggests healthy end-to-end paths when they finish; tail latency and failure modes still need trace-backed review ([[Lexery - Public Trace]], [[Lexery - Automation Architecture]]).

### Entity counts (application domain)

| Entity | Count |
| ------ | ----- |
| Tenants | **242** |
| Chat sessions | **935** |
| Messages | **7,239** |
| MM memory items | **3,565** |
| MM outbox rows | **3,596** |
| MM doc records | **679** |

Link to conceptual model: [[Lexery - Memory and Documents]], [[Lexery - Project Brain]].

### Table sizes (storage footprint)

Largest Postgres relations by observed size (approximate):

| Table | Size |
| ----- | ---- |
| `runs` | **370 MB** |
| `mm_outbox` | **5,336 kB** |
| `messages` | **5,200 kB** |
| `mm_memory_items` | **2,304 kB** |

For how this sits next to object storage and vector tiers, see [[Lexery - Storage Topology]].

### Daily volume (14-day) — historical context

Пік: **1,122 runs** (Mar 27) — ймовірно load test. Поточний рівень: **~200–300 runs/day** (verify against current dashboards).

| Period    | Avg runs/day |
| --------- | ------------ |
| Mar 26–31 | ~575         |
| Apr 1–4   | ~448         |
| Apr 5–9   | ~183         |

Tie operational monitoring to [[Lexery - Pipeline Health Dashboard]].

### Memory Manager (MM) — row-level snapshot

| Table | Rows | Role |
| ----- | ---- | ---- |
| `mm_memory_items` | **3,565** | Extracted user knowledge |
| `mm_outbox` | **3,596** | Async MM work queue / fan-out |
| `mm_doc_records` | **679** | Uploaded documents tracked for MM |

> [!note] Prior snapshot drift
> An earlier same-day export listed `mm_memory_items` at 3,553 and `mm_outbox` at 3,564. The tables above reflect the **latest** recount provided for this page.

### User/session tables

| Table | Rows |
| ----- | ---- |
| `tenants` | **242** |
| `chat_sessions` | **935** |
| `messages` | **7,239** |
| `projects` | 0 *(new feature; empty)* |

### Legislation RAG (Qdrant)

Corpus status as of **`2026-04-09`**:

| Metric | Value |
| ------ | ----- |
| Documents (total) | **374** |
| Indexed in Qdrant | **374** (100%) |
| `in_force` | **360** |
| `expired` | **13** |
| `not_in_force` | **1** |

Wikilink map: retrieval behavior [[Lexery - U4 Retrieval]], corpus governance [[Lexery - Corpus Evolution]], honesty about coverage [[Lexery - Coverage Gap Honesty]], branch history for legislation work [[Lexery - Branch before-LawDatabase]].

## Current Risks

- branch divergence — [[Lexery - Branch Divergence]], [[Lexery - GitHub History]]
- stale root docs — [[Lexery - Drift Radar]]
- plan/billing drift — [[Lexery - Business Model]]
- frontend/backend/brain expectations diverging faster than contracts — [[Lexery - Contracts and Run Schema]]
- dirty local worktree during active architectural changes — [[Lexery - Contributing]]

## Current Opportunity

- The repository already contains enough substance to become a strong integrated product.
- The missing step is convergence and contract hardening, not invention from scratch — [[Lexery - Linear Roadmap]], [[Lexery - Team and Operating Model]].

## See Also

- [[Lexery - Branch Divergence]]
- [[Lexery - Product Surface]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Open Questions and Drift]]
- [[Lexery - Drift Radar]]
- [[Lexery - PR Chronology]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Index]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]
