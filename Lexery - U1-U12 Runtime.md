---
aliases:
  - U1-U12 Runtime
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

> [!info] Compiled from
> - `raw/architecture-docs/app-README.md`
> - `raw/architecture-docs/CURRENT_PIPELINE_STATE.md`

# Lexery - U1-U12 Runtime

## Why This Page Exists

U1-U12 — це найважливіша “внутрішня мова” Lexery Brain. Через неї однаково читаються architecture docs, Linear tasks, legacy bridge repo і current `apps/brain`.

## Stage Map

### Child pages

- [[Lexery - U1 Gateway]]
- [[Lexery - U2 Query Profiling]]
- [[Lexery - U3 Planning]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - U5 Gate]]
- [[Lexery - U6 Recovery]]
- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - U9 Assemble]]
- [[Lexery - U10 Writer]]
- [[Lexery - U11 Verify]]
- [[Lexery - U12 Deliver]]

### U1 — Gateway / Intake

- Role:
  HTTP intake, auth, limits, dry-run, attachments, run creation.
- Evidence:
  `POST /v1/runs`, `GET /health`, gateway storage/queue/observability.

### U2 — Classify

- Role:
  intent, domain, entities, ambiguity, routing flags.
- Importance:
  defines how query enters the system.

### U3 / U3a — Plan

- Role:
  build `SearchPlan`, step list, execution strategy.
- Importance:
  translates classification into retrieval behavior.

### U4 — Retrieval

- Role:
  LLDBI-first retrieval, memory touchpoints, query rewrite, trace shaping, fragment loading.
- Current reading:
  strongest mature intelligence surface.

### U5 — Gate

- Role:
  decide whether current evidence is enough or expansion is needed.

### U6 — Expand

- Role:
  query expansion / iterative retrieval continuation.
- Current reading:
  once a stub, now active and important.

### U7 — DocList

- Role:
  act-catalog discovery / resolver surface.
- Current reading:
  explicit stage conceptually, but not always isolated as a clean top-level current runtime directory.

### U8 — Legal reasoning / import-support branch

- Role:
  deepening after discovery; bridge between new evidence and answerability.
- Current reading:
  conceptually explicit, operationally distributed across adjacent consumers and orchestration paths.

### U9 — Assemble

- Role:
  compile law + docs + memory + history into bounded prompt context.

### U10 — Write

- Role:
  legal answer generation with bounded helper layers before senior writer call.

### U11 — Verify

- Role:
  coverage/citation/completeness validation and corrective loops.
- Current reading:
  much more serious than simple existence check in architecture vision; active consumers still partly housed under `write/`.

### U12 — Deliver

- Role:
  stream response, finalize run, persist artifacts, emit post-run effects.

## Meta-Layers Around U1-U12

### ORCH

- Adaptive controller inserted only when routing is non-trivial.

### ASK_USER / clarification

- Formal pause/resume path rather than ad hoc interruption.

### MM

- Memory and docs layer that supplements runtime context.

## What Changed Over Time

- Earlier system:
  mostly linear.
- Current system:
  hybrid with ORCH, clarification, richer retries, explicit public trace, Brain-admin hints.

## Current Maturity Reading

- `U1-U5`:
  mature and heavily exercised.
- `U6-U8`:
  where a lot of recent innovation and architecture tightening is happening.
- `U9-U12`:
  active stabilization zone, especially around quality, retries, verify semantics, and tail latency.

## Most Important Insight

Lexery’s runtime is not just a sequence of helper functions.
It is a **legal reasoning contract**:

- U2 decides what the query is
- U3 decides how to look
- U4 decides what law exists
- U5 decides if enough law exists
- U6-U8 decide how to recover when evidence is weak
- U9-U12 decide how that becomes a user-trustworthy answer

## See Also

- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Memory and Documents]]
- [[Lexery - Linear Roadmap]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Public Trace]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Log]]
