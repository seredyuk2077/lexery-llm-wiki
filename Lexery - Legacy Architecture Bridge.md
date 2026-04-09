---
aliases:
  - Legacy Architecture Bridge
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: history
---

# Lexery - Legacy Architecture Bridge

## Why This Repo Is So Important

Якщо current monorepo показує “що будується зараз”, а old public beta repo показує “як усе починалось”, то bridge repo показує **найважливішу трансформацію**:

- від AI legal app
- до Lexery Legal AI Agent / Brain system

## Location

- Local path:
  `__PATH_UA_LLM_BETA_BRIDGE__`
- Main branch observed:
  `feature/lexery-legal-agent-architecture`

## What Coexists In This Repo

- old `src/` frontend
- `new-frontend/`
- `backend/`
- `scripts/legislation/`
- `scripts/lexery-legal-agent/`
- huge `docs/architecture/`
- huge `docs/plan_archinecture_Agnet/`
- `supabase/migrations`
- evidence and runs artifacts

## This Is The Missing Middle

### Why

- It contains the first fully explicit `Lexery Legal AI Agent` architecture.
- It contains the ancestor of `apps/brain`.
- It contains legislation/data stack evolution.
- It contains roadmap-to-implementation bridging via `PLAN_vs_LINEAR_GAPS.md`.

## Key Documents

### `plan.md`

- Big architecture of the microservice.
- Covers components, memory, retrieval, deployment, models, failure modes, billing-like limits.

### `answer.md`

- Massive compiled architecture brief.
- Gives full narrative for audience, constraints, multi-tenancy, provenance, online/offline maps, block matrix.

### `PLAN_vs_LINEAR_GAPS.md`

- Critical document that compares architecture plan to Linear execution coverage.
- Shows explicit translation from idea → tasks.

### `scripts/lexery-legal-agent/README.md`

- Closest direct ancestor of current `apps/brain`.

## Commit Arc

- late 2025:
  UI improvements, database, Rada API, legal DB management.
- Dec 2025 to Jan 2026:
  Supreme Court and legislation infra deepening.
- Jan 2026:
  [[Lexery - DocList Surface|DocList]] and legislation validation waves.
- Feb 2026:
  architecture solidifies into U1-U12 and implementation starts.

## Best Interpretation

- `Observed`:
  this repo is where Lexery stopped being “just a product idea” and became a systems program.
- `Observed`:
  it is also where product, infra, docs, and execution planning all lived in one place.
- `Inferred`:
  the current monorepo inherited both power and complexity from this bridge layer.

## Why It Should Stay In The Wiki

- Without it, the current repo can look abrupt or under-explained.
- With it, many strange current choices suddenly make sense:
  U1-U12 naming, LLDBI centrality, DocList, Memory Manager, Azure docs, contract-first workflow.

## See Also

- [[Lexery - Repo Constellation]]
- [[Lexery - Idea Evolution]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Linear Roadmap]]
- [[Lexery - Naming Evolution]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - DocList Surface]]
- [[Lexery - Decision Registry]]
