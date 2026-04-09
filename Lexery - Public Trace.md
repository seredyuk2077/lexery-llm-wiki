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

> [!info] Compiled from
> - `raw/architecture-docs/app-README.md`
> - `raw/codebase-snapshots/supabase-schema-2026-04-09.md`

# Lexery — Public Trace

The **public execution trace** exposes a **stream of stage and decision events** for a run so clients, dashboards, and harnesses can observe progress **without** scraping internal logs. It complements the full [[Lexery - Run Lifecycle|run snapshot]].

## Purpose

Public Trace є **зовнішньо видимим** шаром прогресу виконання run — він зв'язує `run_id` з послідовністю trace events, що видимі у [[Lexery - Portal Surface Map|Portal]] chat UI. Коли користувач задає юридичне питання, Portal підписується на trace events для активного run і показує:

- який stage зараз виконується (classification, retrieval, reasoning, writing)
- скільки часу минуло на кожному stage
- чи очікується [[Lexery - ORCH and Clarification|clarification]] від користувача
- чи є [[Lexery - Coverage Gap Honesty|coverage gap]], про який система хоче повідомити

Це забезпечує transparency — користувач бачить, що система **працює** і **на якому етапі**, а не просто чекає невідомо скільки.

## Configuration

Public Trace контролюється через environment variables:

- **`PUBLIC_TRACE_ENABLED`** — master toggle: `true` / `false`. Коли `false`, trace events не emit'яться і API повертає empty array
- **`PUBLIC_TRACE_RETENTION_DAYS`** — скільки днів зберігати trace events після завершення run (default: 30)
- **`PUBLIC_TRACE_VERBOSE`** — коли `true`, включає додаткові metadata в events (timing breakdowns, intermediate state hashes) для debugging; `false` для production щоб зменшити payload size

Ці `PUBLIC_TRACE_*` env vars задаються в deployment config і не потребують rebuild — зміни підхоплюються при restart workers.

## HTTP API

- **`GET /v1/runs/:id/events`** — returns the event timeline for run `:id`

This is the **contract surface** for "what stage are we in?" and coarse latency visibility. It aligns with [[Lexery - API and Control Plane|API]] versioning under `/v1/`.

Response містить ordered array of events з timestamps, що дозволяє Portal відтворити timeline навіть якщо підписка на SSE почалася пізніше ніж run.

## Run ID Linkage

Кожен trace event прив'язаний до конкретного `run_id`. Portal chat UI використовує цей зв'язок для:

1. **Real-time progress** — SSE subscription на events для active run, rendering progress indicators у chat bubble
2. **Post-hoc inspection** — після завершення run, trace events доступні через API для review і debugging
3. **Cross-reference** — `run_id` зв'язує trace events з [[Lexery - Run Lifecycle|run snapshot]], [[Lexery - ORCH and Clarification|ORCH decisions]], і [[Lexery - Coverage Gap Honesty|coverage gap]] status

## Persistence

Events are also recorded inside the run as **`snapshot.public_trace`**, so they survive for analytics and post-hoc debugging alongside **`retrieval_trace`**, **`doclist_trace`**, and [[Lexery - ORCH and Clarification|ORCH]] data.

## Event types (representative)

- **`stage_started`** — a pipeline stage began
- **`stage_completed`** — a stage finished (success or failure semantics depend on payload)
- **`decision`** — [[Lexery - ORCH and Clarification|ORCH]] (or policy) recorded a **decision** with enough context to reconstruct **why** an action was chosen
- **`clarification_requested`** — система очікує відповіді від користувача для disambiguation
- **`coverage_gap_detected`** — [[Lexery - Coverage Gap Honesty|coverage gap]] виявлений і буде відображений у відповіді

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

Contract tests перевіряють:

- event ordering guarantees (events для одного run завжди в chronological order)
- serialization correctness (concurrent emit не створює corrupted events)
- API response format stability (backward compatibility для Portal consumers)
- `PUBLIC_TRACE_ENABLED=false` correctly suppresses all events

## Related

- [[Lexery - Run Lifecycle]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Brain Architecture]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Portal Surface Map]]

## See Also

- [[Lexery - U2 Query Profiling]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Pipeline Health Dashboard]]
