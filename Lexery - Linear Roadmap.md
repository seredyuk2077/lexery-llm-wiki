---
aliases:
  - Linear Roadmap
tags:
  - lexery
  - team
  - operations
created: 2026-04-09
updated: 2026-04-09
status: planned
layer: team
---

# Lexery - Linear Roadmap

## Why Linear Matters

Linear у Lexery важливий не просто як таск-трекер. Він показує, **як велика ідея була декомпозована** в реальні будівельні блоки.

## Team

- Team:
  `Lexery`
- Team key:
  `LEX`
- Observed members:
  [[Lexery - Andrii Serediuk|Andrii Serediuk]], [[Lexery - Yehor Puhach|Yehor Puhach]], [[Lexery - Olexandr|Olexandr]]

## Key Projects

### Agent Architecture

- Status:
  Completed
- Summary:
  4C architecture for Lexery Legal AI Agent Brain.
- Lead:
  Andrii Serediuk
- Major milestone pattern:
  concept, components, pipelines/failures, memory/billing, Azure, final docs.
- Anchor issue:
  `LEX-31`

### Lexery Legal Agent Dev

- Status:
  In Progress
- Summary:
  implementation of Brain according to architecture project.
- Lead:
  Andrii Serediuk
- Key milestone still visible:
  `Stabilization Wave: U2/U9/U10`

### Backend

- Status:
  In Progress
- Lead:
  Andrii Serediuk
- Members:
  Andrii, Olexandr
- Observed meaning:
  monorepo/backend/control-plane line distinct from pure brain implementation.

### Frontend

- Status:
  In Progress
- Lead:
  Olexandr
- Observed meaning:
  portal/workspace/auth/UI track has enough autonomy to be its own project.

## Important Issue Clusters

### Architecture completion cluster

- `LEX-31`:
  epic for agent brain architecture.
- `LEX-32`, `LEX-42`, `LEX-43`, `LEX-46`, `LEX-51`, `LEX-52`, `LEX-53`, `LEX-55`:
  show exact decomposition from concept into final architecture artifacts.

### Contract-first runtime cluster

- `LEX-105`:
  `SearchPlan` contract.
- `LEX-106`:
  `RawHit + RetrievalTrace` schema.
- `LEX-109`:
  `EvidencePack` handoff contract.

### Dev/stabilization cluster

- `LEX-132`:
  U9 prompt assembler skeleton.
- `LEX-136`:
  MM outbox writer design.
- `LEX-139`:
  stabilization cycle around U9/U10/reliability/observability.
- `LEX-151`, `LEX-153`, `LEX-155`:
  migration integrity, outbox correctness, beta gate.

### Monorepo migration cluster

- `LEX-195`:
  backend foundation based on scripts/LLDBI/DocList/Agent.
- `LEX-197`:
  migrate legal agent into new repo.
- `LEX-199`:
  auth guard and DB in NestJS.
- `LEX-200`, `LEX-202`, `LEX-203`:
  client endpoint, NestJS-to-agent bridge, async run status.

## What Linear Reveals About Project Evolution

- `Observed`:
  Lexery did not jump directly from idea to current monorepo.
- `Observed`:
  there was a clean architecture phase, then implementation phase, then product/backend/frontend integration phase.
- `Observed`:
  issues explicitly encode branch/commit/document evidence.
- `Inferred`:
  Linear is acting as a second-order memory system for the project.

## Biggest Strategic Reading

- `Agent Architecture` explains why the Brain is shaped this way.
- `Lexery Legal Agent Dev` explains which parts were actively hardened.
- `Backend` and `Frontend` show where monorepo productization is heading.
- The most important unfinished story is:
  convergence of brain-runtime branch and product/control-plane branch.

## See Also

- [[Lexery - Team and Operating Model]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Current State]]
- [[Lexery - Drift Radar]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]
- [[Lexery - Decision Registry]]
- [[Lexery - PR Chronology]]
- [[Lexery - Log]]
