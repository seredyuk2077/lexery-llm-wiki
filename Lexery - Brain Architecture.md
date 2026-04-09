---
aliases:
  - Brain Architecture
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - Brain Architecture

## Best Short Definition

`apps/brain` is the current **core legal runtime** of Lexery: a staged, evidence-first, bounded legal agent rather than a single-prompt chatbot.

## What Brain Owns

### Observed boundaries

- Legal runtime and stage orchestration
- Verification tooling
- Run-level state handling
- Prompt assembly across law, docs, memory, history
- Writer / verifier / deliver path

### Explicit non-ownership

- LLDBI corpus/admin infra lives outside Brain in `apps/lldbi`
- DocList services live in `apps/doclist-*`
- Product shell/control plane lives in `apps/api` and `apps/portal`

## Current Module Atlas

- `gateway/`
- `classify/`
- `plan/`
- `retrieval/`
- `gate/`
- `expand/`
- `assemble/`
- `reasoning/`
- `write/`
- `verify/`
- `deliver/`
- `mm/`
- `orchestrator/`
- `tools/`
- `lib/`

## Current Runtime Shape

### Earlier graph

`U1 -> U2 -> U3 -> U3a -> U4 -> U5 -> (U6|U9) -> U10 -> U11 -> U12`

### Upgraded graph

`U1 -> U2 -> (U3 | ORCH) -> U3a -> U4 -> U5 -> ORCH -> (U6 | U7) -> ORCH -> (U4 | U8 | ASK_USER) -> ORCH -> U9 -> ORCH -> U10 -> ORCH -> U11 -> ORCH -> U12`

### Meaning

- `Observed`:
  Brain moved from a mostly linear staged pipeline to a hybrid staged-plus-orchestrated runtime.
- `Observed`:
  deterministic fast paths still exist.
- `Inferred`:
  the project is trying to gain agentivity without losing legal controllability.

## Important Architectural Principles

### Principle 1 — retrieval-first legal grounding

- U4 is treated as the strongest intelligence layer for law retrieval.
- Writer is downstream of evidence, not a free generator.

### Principle 2 — bounded orchestration

- ORCH appears only where the next move is no longer single-path.
- Not every stage transition is handed to an LLM.

### Principle 3 — explicit state surfaces

- `runs` row
- `runs.snapshot`
- `RunContext`
- retrieval/gate/orch/clarification substructures
- R2 overflow storage

### Principle 4 — additive compatibility

- Existing API and run semantics stay stable where possible.
- New orchestration state is added into snapshot/context rather than by hard schema explosion.

## Transitional Reality

### Observed

- `write/verifyConsumer.ts` and `write/deliverConsumer.ts` are still the live U11/U12 entrypoints.
- `verify/` and `deliver/` directories remain placeholders.
- `expand/consumer.ts` is the live U6 entrypoint.

### Meaning

- The architecture is real, but module boundaries are still being cleaned up.

## Quality Posture

- stage-specific verifiers are important
- retrieval verifiers intentionally isolate upstream truth from downstream writer noise
- real-mode runs are cost-bounded
- docs emphasize honest degradation, not hallucinated completeness

## Best Reading Of Brain Maturity

- `Observed`:
  Brain is the most technically mature domain surface in the project.
- `Observed`:
  its stage vocabulary is stable enough to act as the project’s shared ontology.
- `Inferred`:
  a lot of Lexery’s strategic moat, if it works, will live here rather than in generic chat UI.

## Key Sources

- `apps/brain/README.md`
- `apps/brain/LEGAL_AGENT_README.md`
- `docs/lexery-current-runtime-map.md`
- `apps/brain/docs/architecture/app/**`

## Monorepo Structure

| Package | Path | Purpose |
|---------|------|---------|
| `@lexery/brain` | `apps/brain` | Legal Agent Brain: HTTP server, U1–U12 pipeline, retrieval, MM / MM Docs |
| `@lexery/lldbi` | `apps/lldbi` | LLDBI admin CLI: Qdrant / R2 / Supabase legislation ops |
| `@lexery/api` | `apps/api` | NestJS backend (Prisma, Supabase, S3) |
| `@lexery/portal` | `apps/portal` | Next.js frontend (React 19) |
| `@lexery/doclist-updater-db` | `apps/doclist-updater-db` | Daily DocListDB incremental updater (Rada → embeddings → Qdrant) |
| `@lexery/doclist-full-import` | `apps/doclist-full-import` | Full DocList catalog importer into Qdrant |
| `@lexery/doclist-resolver-api` | `apps/doclist-resolver-api` | Cloudflare Worker: act resolution via Qdrant |
| `@lexery/typescript-config` | `packages/config/typescript` | Shared TypeScript config |

## Architecture Docs in Repo

Canonical architecture documentation lives under `apps/brain/docs/architecture/` (100+ markdown files), including:

- `LEXERY_LEGAL_AI_AGENT_ARCHITECTURE.md` — full-stack narrative (Ukrainian)
- `MEGA_DIAGRAM_FULL.md` — system-wide Mermaid diagram
- `app/README.md` — implementation index mapping U1–U12 to consumers
- `app/context/CURRENT_PIPELINE_STATE.md` — live snapshot of what runs (updated 2026-04-09)

## Testing Infrastructure

Roughly **61** test-oriented TypeScript modules under `apps/brain/tools/`, with naming conventions:

- `test_*_units.ts` — unit test suites per stage
- `stress_test_*.ts` — load / stress tests (especially U4 retrieval)
- `verify_*.ts` — live verification harnesses

Script aliases in the monorepo: `pnpm brain:test:*` / `pnpm brain:verify:*`.

## CI/CD

Single GitHub Action: `.github/workflows/lldbi-brain-admin.yml`

- Weekly cron: **Monday 04:15 UTC** plus **manual** `workflow_dispatch`
- Flow: **brain-admin** batch → **process approved proposals** → **upload artifacts** (`report.json`, `approved-proposals-report.json`)

## See Also

- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Memory and Documents]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Decision Registry]]
- [[Lexery - Provider Topology]]
- [[Lexery - Storage Topology]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Public Trace]]
- [[Lexery - Glossary]]
