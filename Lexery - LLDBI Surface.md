---
aliases:
  - LLDBI Surface
  - LLDBI
  - Legislation Database Index
tags:
  - lexery
  - data
  - infra
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: data
---

# Lexery — LLDBI Surface

**LLDBI** (Lexery Legislation DataBase Index) is the vector-backed legislation corpus that powers retrieval against Ukrainian acts. It sits alongside [[Lexery - DocList Surface|DocList]] (catalog and disambiguation) and feeds [[Lexery - Retrieval, LLDBI, DocList|retrieval]] paths in the Legal Agent.

## Where the code lives

Implementation is concentrated under `apps/lldbi/` in the Lexery monorepo. That tree holds indexing logic, admin tooling, and integration points with Brain snapshots and CI.

> [!info] Mental model
> Think of LLDBI as **what is indexed and searchable**; DocList is **what exists in the Rada catalog**. Gaps between them drive [[Lexery - Import Proposal Loop|import proposals]].

## Qdrant collections

| Collection | Role | Scale (observed) |
|------------|------|------------------|
| `lexery_legislation_acts` | Act-level vectors / metadata | 374 acts |
| `lexery_legislation_chunks` | Chunk-level retrieval | 21,266 chunks |

These names are the operational contract for [[Lexery - U4 Retrieval|U4]] and related retrieval stages when they query the legislation corpus.

## Admin CLI

`admin-cli.ts` exposes CLI operations for maintenance, inspection, and workflows that do not belong in the hot request path. Operators and automation (for example [[Lexery - Deployment and Infra|GitHub Actions]]) invoke it for batch tasks.

## `brain-admin/` module

The `brain-admin/` area scans **Brain runs** for structured signals:

- `snapshot.lldbi_admin_hints` — explicit hints from the pipeline
- `snapshot.doclist_trace` — trace data used when hints need derivation

From these, it extracts signals such as:

- **`catalog_gap`** — act appears in the catalog story but is missing or weak in LLDBI
- **`import_requested`** — explicit import intent
- **`touch`** — act was accessed or referenced and may deserve freshness attention

This connects LLDBI operations to live [[Lexery - Run Lifecycle|run]] behavior without coupling indexing to every request.

## Import proposal pipeline

End-to-end flow:

1. [[Lexery - Brain Architecture|Brain]] retrieval and DocList checks surface a **corpus gap**.
2. LLDBI admin aggregates signals from recent runs.
3. Proposals land in Supabase table **`legislation_import_proposals`**.
4. Humans (or governed AI) review and decide.

See [[Lexery - Import Proposal Loop]] for the full cycle and deduplication rules.

## Tests and CI

- **`runner.test.ts`** — exercise runner / orchestration paths for LLDBI tooling.
- **`policy.test.ts`** — policy and guardrail behavior around admin and proposals.

Scheduled and on-demand automation: **`.github/workflows/lldbi-brain-admin.yml`** runs the brain-admin scan job against recent Brain activity.

## Operational gotcha: `nreg` case sensitivity

For **inspect** and related identifier handling, casing matters: e.g. **`ВР`** vs **`вр`** can change whether a probe matches as expected. Treat `nreg` (and related IDs) as **case-sensitive** unless tooling explicitly normalizes.

> [!warning] Inspect failures
> If inspect “finds nothing” for an act you know exists, verify **exact** `nreg` / registry string casing before assuming a catalog or index gap.

## Signal density (observed)

`brainSignalCount` varies by scan window and hybrid configuration. One recent **hybrid** scan reported on the order of **54 signals** from **310 runs** — useful as a rough magnitude for dashboards, not as a fixed SLA.

## Related

- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - DocList Surface]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - Brain Architecture]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - Corpus Evolution]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - Provider Topology]]
- [[Lexery - Storage Topology]]
