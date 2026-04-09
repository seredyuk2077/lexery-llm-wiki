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

> [!info] Compiled from
> - `raw/codebase-snapshots/supabase-schema-2026-04-09.md`
> - `raw/codebase-snapshots/supabase-live-stats-2026-04-09.md`
> - Production `legal_agent_runs.status` distribution (snapshot 2026-04-09)

# Lexery — Run Lifecycle

A **Legal Agent run** is the unit of work from accepted user request through pipeline stages to a terminal outcome. This note summarizes **states**, **persistence**, **performance**, and **resume** behavior; pair it with [[Lexery - Contracts and Run Schema]] for field-level contracts.

## State machine (user-visible)

Typical high-level progression:

```text
pending → processing → terminal
```

**Terminal states** include:

- **`completed`** — successful end-to-end completion
- **`failed`** — unrecoverable error or policy stop
- **`clarification_pending`** — waiting on user clarification ([[Lexery - ORCH and Clarification|ORCH]] may pause downstream work)

Exact naming and transitions are enforced in API and worker code; the sections below ground this mental model in **production status values** and **live counts**.

## Detailed Status Machine

Production rows advance through **fine-grained `legal_agent_runs.status` values** that reflect queue placement and writer/verify/deliver stages. The path below is the **observed canonical ordering** from intake through completion (U4 and U5 are **transparent** in the sense that they do not always surface as distinct persisted status labels in the same way as stage gates; work still occurs in the pipeline).

```text
Intake
  → Profiling
  → Planning
  → (U4 Retrieval, U5 Gate — transparent in status progression)
  → U10_RUNNING
  → U10_DONE
  → U11_RUNNING
  → U11_DONE
  → U12_RUNNING
  → completed | failed
```

**Notes:**

- **Intake / Profiling / Planning** — early lifecycle: request acceptance, profiling, and plan materialization before heavy retrieval and downstream units dominate wall time.
- **U4 / U5** — retrieval and gating execute as part of the orchestrated flow; operators may not see a dedicated `U4_*` / `U5_*` row status for every run depending on how status is stamped at handoff boundaries.
- **`U10_*` / `U11_*` / `U12_*`** — explicit writer, verify, and deliver phases with **RUNNING** vs **DONE** separation for observability and retries.
- **Terminal** — only **`completed`** and **`failed`** close the accounting loop for the run row; intermediate failures may still land in **`failed`** after partial progress.

## Live Status Distribution

Counts below are a **point-in-time snapshot** of production `legal_agent_runs` by `status` (same date as wiki `updated` front matter). Use them for capacity intuition, not as a guaranteed steady-state ratio.

| Status | Count |
| --- | ---: |
| completed | 17,183 |
| Planning | 7,449 |
| Profiling | 895 |
| Intake | 705 |
| failed | 277 |
| U10_RUNNING | 100 |
| U11_DONE | 60 |
| U12_RUNNING | 20 |
| U10_DONE | 12 |
| U11_RUNNING | 3 |

**Reading the table:** the large **Planning** bucket reflects runs actively or recently scheduled in the planning phase relative to this snapshot; **completed** dominates historical volume. Active **writer/verify/deliver** states (**U10_***, **U11_***, **U12_***) are smaller but operationally critical for tail latency and incident triage.

## Run Performance

**Average completion time (completed runs):** **23.6 seconds** — end-to-end wall time for runs that reached **`completed`**, as observed in the same production stats window (method: aggregate timing from run lifecycle metrics aligned with `legal_agent_runs`).

**`legal_agent_runs` table footprint:** approximately **370 MB** — total on-disk / reported size for the runs table at snapshot time, including JSONB snapshot payloads and indexed columns.

Treat both numbers as **environment-specific**: they move with traffic, payload sizes, and retention.

## RunContext vs RunRecord

| Dimension | RunContext (Redis) | RunRecord (Supabase `runs` / `legal_agent_runs`) |
| --- | --- | --- |
| Role | **Hot** pipeline state for workers | **Durable** source of truth for the run row |
| Latency | **Sub-millisecond** read/write for hot paths | Network + Postgres; optimized for durability and query |
| Compression | **zstd** when serialized payload **> 8 KB** | N/A (stored as **JSONB** columns in Postgres) |
| Content shape | **Full pipeline state** in flight (orchestrator, stage handoffs, ephemeral scratch) | **Structured row** with **JSONB** for snapshot subtrees; **22 columns** in the authoritative runs schema |
| Size signal | Bounded by worker memory and TTL policies | **~370 MB** table size at snapshot (see Run Performance) |

**Practical rule:** debug **“what is the worker doing right now?”** in **Redis RunContext**; debug **“what do we persist and show in admin/API?”** in **Supabase RunRecord**.

## Recovery and Resume Paths

Governed resume behavior ties [[Lexery - ORCH and Clarification|ORCH]], [[Lexery - Retry and Recovery]], and stage consumers together.

1. **`clarification_pending` → user answers → ORCH resumes from U7**  
   After the user submits clarification via **`POST /v1/runs/:id/clarification`**, the orchestrator **resumes downstream work from U7 (evidence assembly)** rather than restarting the entire pipeline from intake, preserving prior traces where policy allows.

2. **`retry_write` → U10 reruns (bounded by `U11_DIRECT_WRITE_RETRY_MAX=1`)**  
   When [[Lexery - U11 Verify|U11]] signals a **write retry**, the pipeline **clears stale writer artifacts** and **reruns [[Lexery - U10 Writer|U10]]**. **`U11_DIRECT_WRITE_RETRY_MAX`** defaults to **1**, capping oscillation and cost.

3. **`retry_retrieval` → U6→U4 with `retrieval_retry_request`**  
   A retrieval retry is modeled as **U6 (recovery) handing back to U4** with a **`retrieval_retry_request`** (or equivalent signal in the run snapshot / orch decisions), so retrieval is re-executed under recovery policy without silently reusing a failed or incomplete retrieval trace.

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

**`POST /v1/runs/:id/clarification`** submits answers and triggers **resume** along the governed path (see [[Lexery - Retry and Recovery]] for interaction with retrieval retry). The **Detailed Status Machine** and **Recovery and Resume Paths** sections above spell out how this maps to **U7** and ORCH.

## Write retry and stale artifacts

[[Lexery - U11 Verify|U11]] can request a **write retry**; the pipeline clears **stale writer artifacts** before rerunning [[Lexery - U10 Writer|U10]]. Bounded by **`U11_DIRECT_WRITE_RETRY_MAX`** (default **1**) to cap cost and oscillation — summarized again under **Recovery and Resume Paths**.

## Databases and ephemeral state

- **Supabase `legal_agent_runs`** ([[Lexery - Storage Topology|LegalAgentDB]]) — authoritative run row and snapshot storage (**RunRecord**)
- **Redis** — [[Lexery - Provider Topology|per-run context]] during active processing (**RunContext**); queues via BullMQ, shared clients

> [!info] Debugging order
> For “what happened?”, start with **terminal state** + **`verify_result`**, then **`orch.decisions`**, then **traces** (`retrieval_trace`, `doclist_trace`). For **in-flight** behavior, correlate with **Redis RunContext** and queue depth by stage.

## Related

- [[Lexery - Contracts and Run Schema]]
- [[Lexery - U1 Gateway]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Public Trace]]
- [[Lexery - U12 Deliver]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Coverage Gap Honesty]]

## See Also

- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - U6 Recovery]]
- [[Lexery - U1-U12 Runtime]]
- [[Lexery - Decision Registry]]
