---
aliases:
  - Public Trace
  - Trace
  - Events API
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery — Public Trace

The **public execution trace** exposes a **stream of stage and decision events** for a run so clients, dashboards, and harnesses can observe progress **without** scraping internal logs. It complements the full [[Lexery - Run Lifecycle|run snapshot]].

## HTTP API

- **`GET /v1/runs/:id/events`** — returns the event timeline for run `:id`

This is the **contract surface** for “what stage are we in?” and coarse latency visibility. It aligns with [[Lexery - API and Control Plane|API]] versioning under `/v1/`.

## Persistence

Events are also recorded inside the run as **`snapshot.public_trace`**, so they survive for analytics and post-hoc debugging alongside **`retrieval_trace`**, **`doclist_trace`**, and [[Lexery - ORCH and Clarification|ORCH]] data.

## Event types (representative)

- **`stage_started`** — a pipeline stage began
- **`stage_completed`** — a stage finished (success or failure semantics depend on payload)
- **`decision`** — [[Lexery - ORCH and Clarification|ORCH]] (or policy) recorded a **decision** with enough context to reconstruct **why** an action was chosen

Exact payloads evolve; treat **type** + **timestamps** as the stable observability backbone.

## Concurrency and serialization

The implementation **serializes per run** so concurrent stage execution does not drop or interleave events in ways that confuse consumers. That matters when [[Lexery - Brain Architecture|multiple workers]] touch the same run artifact.

## Stage timing caveats

The trace captures **per-stage latency** where start/completed pairs exist. Not every stage yet emits **perfectly matched** pairs; dashboards should tolerate **partial** spans and fall back to snapshot traces for deep dives.

> [!warning] Incomplete pairs
> A missing `stage_completed` does not always mean the stage hung — instrumentation may lag behind code paths. Cross-check **`verify_result`** and worker logs when investigating stalls.

## Decision events

**Decision** events carry [[Lexery - ORCH and Clarification|ORCH]] **action choices** and **state context** sufficient for harnesses to assert policy behavior (for example, whether a retry was allowed).

## Harness usage

The **agentivity live verification harness** uses this trace to measure **real per-stage cost** on production-like paths — connecting SLO thinking to **observed** timings rather than synthetic micro-benchmarks only.

## Code and tests

- **Implementation**: `apps/brain/public-trace/*`
- **Contract tests**: `apps/brain/tools/public-trace/test_public_trace_contract_units.ts`

## Related

- [[Lexery - Run Lifecycle]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Brain Architecture]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - Retry and Recovery]]
