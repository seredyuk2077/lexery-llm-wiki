---
aliases:
  - Import Proposal Loop
  - Import Loop
  - Corpus Gap Pipeline
tags:
  - lexery
  - data
  - infra
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: data
---

# Lexery — Import Proposal Loop

This note describes the **closed loop** from a user query through [[Lexery - Brain Architecture|Brain]] to a **human- or AI-governed** import decision in Supabase. It is the operational bridge between [[Lexery - DocList Surface|catalog truth]] and [[Lexery - LLDBI Surface|indexed corpus]].

## End-to-end flow

```text
User query
  → Brain retrieval
  → [[Lexery - DocList Surface|DocList]] check
  → gap detected
  → U6 emits `lldbi_admin_hints` (and/or trace-derived signals)
  → LLDBI admin scans recent runs
  → import **proposal** created
  → `legislation_import_proposals` (Supabase)
  → human / AI review → import or reject
```

The Brain **signals**; **LLDBI admin** owns **lifecycle** and **deduplication**. This keeps the hot path fast and the corpus changes **deliberate**.

## Signal types

| Signal | Meaning |
|--------|---------|
| **`catalog_gap`** | Act exists in [[Lexery - DocList Surface|DocList]] catalog but is missing or inadequate in [[Lexery - LLDBI Surface|LLDBI]] Qdrant |
| **`import_requested`** | Explicit pipeline or operator intent to import |
| **`touch`** | Act was referenced or touched; may warrant refresh or prioritization |

These are the primary categories extracted from `snapshot.lldbi_admin_hints` and related run data.

## Fallback: `doclist_trace`

When explicit `lldbi_admin_hints` are absent, **`brainSignals.ts`** can still derive usable signals from **`snapshot.doclist_trace`**. That fallback prevents “silent” gaps when hints were not wired for a particular path but the trace still encodes catalog/index tension.

> [!warning] Conservative by design
> Emitting a signal is not the same as **importing**. Proposals aggregate noise; dedupe and review prevent thrash.

## Supabase: `legislation_import_proposals`

Proposals are **durable** rows — audit trail, reviewer identity, and outcome. They connect [[Lexery - Run Lifecycle|run-time traces]] to **offline** corpus operations.

**Deduplication**: new proposals are checked against **existing pending** rows and **recent decisions** so the same gap does not spawn unbounded duplicate tickets.

## Observed live state

As of recent observation, the **latest pending** proposal example was:

- **`rada_nreg = 2811-20`**
- **`proposed_by = ai`**

Treat this as an **instance** illustrating the pipeline, not a permanent invariant.

## Relationship to U6 and recovery

[[Lexery - U6 Recovery|U6]] is where many hints originate after retrieval and DocList interaction. [[Lexery - Coverage Gap Honesty|Coverage gap honesty]] and [[Lexery - Retry and Recovery|retry]] logic must remain consistent with “we know the act exists in catalog but not in index” scenarios — those are prime **`catalog_gap`** drivers.

## Relationship to LLDBI admin CI

Scheduled scans (see [[Lexery - LLDBI Surface]] and `.github/workflows/lldbi-brain-admin.yml`) widen the funnel beyond a single run: they catch recurring gaps across many sessions.

## Related

- [[Lexery - LLDBI Surface]]
- [[Lexery - DocList Surface]]
- [[Lexery - U6 Recovery]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Storage Topology]]
- [[Lexery - Corpus Evolution]]
