---
aliases:
  - Run Lifecycle
  - Run States
  - Run Schema
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery — Run Lifecycle

A **Legal Agent run** is the unit of work from accepted user request through pipeline stages to a terminal outcome. This note summarizes **states**, **persistence**, and **resume** behavior; pair it with [[Lexery - Contracts and Run Schema]] for field-level contracts.

## State machine

Typical progression:

```text
pending → processing → terminal
```

**Terminal states** include:

- **`completed`** — successful end-to-end completion
- **`failed`** — unrecoverable error or policy stop
- **`clarification_pending`** — waiting on user clarification ([[Lexery - ORCH and Clarification|ORCH]] may pause downstream work)

Exact naming and transitions are enforced in API and worker code; treat the above as the user-visible mental model.

## Run snapshot (what gets stored)

The persisted **`snapshot`** (conceptually; see [[Lexery - Contracts and Run Schema]]) aggregates traces and results, including (non-exhaustive):

- **`retrieval_trace`** — [[Lexery - U4 Retrieval|U4]] / retrieval story
- **`doclist_trace`** — [[Lexery - DocList Surface|DocList]] resolver story
- **`expand_trace`** — expansion stage
- **`evidence_assembly`** — assembled evidence package
- **`legal_reasoning`** — reasoning stage output
- **`clarification`** — questions / answers
- **`llm_result`** — writer-facing LLM payload where applicable
- **`verify_result`** — [[Lexery - U11 Verify|U11]] outcome
- **`orch.*`** — orchestrator subtree (decisions, masks)

## ORCH decisions

Under **`snapshot.orch`**, **decisions** are recorded as **`snapshot.orch.decisions[*]`** with:

- **`allowed_actions`** — what the orchestrator permitted next
- **`state_snapshot`** — captured state for audit and replay debugging

These tie [[Lexery - ORCH and Clarification|ORCH]] policy to concrete per-run history.

## Public trace vs full snapshot

Operators and harnesses may use [[Lexery - Public Trace|GET `/v1/runs/:id/events`]] for **stage timing** and **decision events** without loading the entire snapshot. The durable form includes **`snapshot.public_trace`**.

## Clarification resume

**`POST /v1/runs/:id/clarification`** submits answers and triggers **resume** along the governed path (see [[Lexery - Retry and Recovery]] for interaction with retrieval retry).

## Write retry and stale artifacts

[[Lexery - U11 Verify|U11]] can request a **write retry**; the pipeline clears **stale writer artifacts** before rerunning [[Lexery - U10 Writer|U10]]. Bounded by **`U11_DIRECT_WRITE_RETRY_MAX`** (default **1**) to cap cost and oscillation.

## Databases and ephemeral state

- **Supabase `legal_agent_runs`** ([[Lexery - Storage Topology|LegalAgentDB]]) — authoritative run row and snapshot storage
- **Redis** — [[Lexery - Provider Topology|per-run context]] during active processing (queues via BullMQ, shared clients)

> [!info] Debugging order
> For “what happened?”, start with **terminal state** + **`verify_result`**, then **`orch.decisions`**, then **traces** (`retrieval_trace`, `doclist_trace`).

## Related

- [[Lexery - Contracts and Run Schema]]
- [[Lexery - U1 Gateway]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Public Trace]]
- [[Lexery - U12 Deliver]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Coverage Gap Honesty]]
