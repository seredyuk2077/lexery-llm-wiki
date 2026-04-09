---
aliases:
  - Current State
tags:
  - lexery
  - product
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: product
---

> [!info] Compiled from
> - `raw/codebase-snapshots/supabase-live-stats-2026-04-09.md`

# Lexery - Current State

## Snapshot Date

- This page reflects the observed local + GitHub state on:
`2026-04-09`

## One-Screen Summary

Lexery зараз already має:

- реальний legal brain runtime у `apps/brain`
- реальний product/frontend shell у `apps/portal`
- реальний control plane skeleton у `apps/api`
- реальні corpus/admin surfaces у `apps/lldbi` і doclist services

Але ці частини ще не зведені в один clean integrated mainline.

## Current Local Repo Status

### Branch

- Current local branch:
`legal-agent-brain-dev`
- Remote tracking:
`origin/legal-agent-brain-dev`
- Status:
ahead by `10` commits

### Worktree

- Dirty worktree concentrated in:
`apps/brain`, `apps/lldbi`, `apps/doclist-resolver-api`, `docs`
- Untracked files:
`apps/brain/lib/redis-shared.ts`
`apps/brain/tools/u4/test_query_rewrite_phase_units.ts`

### Meaning

- `Observed`:
the active center of work is still Brain/runtime, not just product shell.

## Current Remote Mainline Status

- Default branch:
`dev`
- `origin/dev` contains:
auth refactor, shared contracts, subscription plan UI, richer frontend profile/auth work.
- Divergence vs local `HEAD`:
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
- Recent branch history shows active ORCH / clarification / retry / bounded recovery work.

### Infra surfaces

- `apps/doclist-resolver-api` is a Cloudflare Worker surface.
- `apps/lldbi` has brain-admin and infra surfaces.
- Current and legacy docs still point to Supabase, Qdrant, R2, OpenRouter, Azure/Cloudflare split.

## What Is Still Partial

- billing provider integration
- fully unified plan contract
- fully integrated brain-to-api-to-portal mainline path
- fully trustworthy doc freshness across root docs and subsystem docs

## Strongest Current Truth

- `Observed`:
`apps/brain` is the most mature technical surface in domain depth.
- `Observed`:
`origin/dev` is the most current product-shell/mainline surface.
- `Inferred`:
the project’s central integration problem is not “what should we build?” but “how do we merge the two already-moving systems?”

## Live Production Metrics (Supabase, 2026-04-09)

### Pipeline Throughput


| Metric                            | Value          |
| --------------------------------- | -------------- |
| Total runs                        | **26,661**     |
| Completed                         | 17,169 (64.4%) |
| Failed                            | 277 (1.0%)     |
| Stuck (Intake/Profiling/Planning) | 9,039 (33.9%)  |
| In-flight (U10-U12)               | 195            |


### Daily Volume (14-day)

Пік: **1,122 runs** (Mar 27) — ймовірно load test. Поточний рівень: **~200-300 runs/day**.


| Period    | Avg runs/day |
| --------- | ------------ |
| Mar 26–31 | ~575         |
| Apr 1–4   | ~448         |
| Apr 5–9   | ~183         |


### Memory Manager


| Table           | Rows  | Note                     |
| --------------- | ----- | ------------------------ |
| mm_memory_items | 3,553 | Extracted user knowledge |
| mm_outbox       | 3,564 | 3,548 done, 35 pending   |
| mm_summaries    | 321   | Case summaries           |
| mm_doc_records  | 679   | Uploaded documents       |


### User Data


| Table         | Rows            |
| ------------- | --------------- |
| tenants       | 242             |
| chat_sessions | 928             |
| messages      | 7,224           |
| projects      | 0 (new feature) |


> [!warning] Stuck Runs
> ~9,039 runs (34%) зупинилися на ранніх стадіях. Ймовірні причини: timeouts до впровадження ORCH, queue issues в Redis, cancelled requests. Потребує forensic аналізу — див. [[Lexery - Retry and Recovery]], [[Lexery - ORCH and Clarification]].

## Current Risks

- branch divergence
- stale root docs
- plan/billing drift
- frontend/backend/brain expectations diverging faster than contracts
- dirty local worktree during active architectural changes

## Current Opportunity

- The repository already contains enough substance to become a strong integrated product.
- The missing step is convergence and contract hardening, not invention from scratch.

## See Also

- [[Lexery - Branch Divergence]]
- [[Lexery - Product Surface]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Open Questions and Drift]]
- [[Lexery - Drift Radar]]
- [[Lexery - PR Chronology]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]