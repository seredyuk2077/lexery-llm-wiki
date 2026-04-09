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

> [!info] Compiled from
> - `raw/codebase-snapshots/monorepo-packages-2026-04-09.md`
> - Direct codebase analysis: `apps/lldbi/`

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

## R2 і canonical JSON

Законодавчі артефакти для індексації живуть у **legislation** bucket (див. [[Lexery - Storage Topology]]): env `LLDBI_R2_BUCKET` / `R2_LEGISLATION_BUCKET` з опційним `LLDBI_R2_PREFIX`. Brain U4 читає snippets і повні traces через окремий **lexery-legal-agent** bucket — не плутати ролі двох bucket-ів.

## Legislation Supabase (metadata)

Таблиця **`legislation_documents`** (окремий Supabase project) тримає **metadata** актів: `qdrant_status`, `validity_status`, `chunks_count`, `r2_key`, sync health. Поточний знімок: **374** документи, усі **`indexed`** у Qdrant; частина **in_force** / **expired** — див. [[Lexery - Pipeline Health Dashboard]]. Це не заміна LLDBI vector index, а **джерело правди** для імпорту й моніторингу.

## Операційний цикл (operator view)

1. **Користувачі / Brain** створюють тиск на корпус через retrieval + `doclist_trace` / `lldbi_admin_hints`.
2. **`brain-admin`** (у `apps/lldbi/brain-admin/`) агрегує сигнали з недавніх runs.
3. **GitHub Actions** `.github/workflows/lldbi-brain-admin.yml` запускає batch (weekly / manual).
4. **Import proposals** потрапляють у `legislation_import_proposals`; після review — індексація в Qdrant + оновлення R2.

## Конфіг Brain, що торкається LLDBI

У `apps/brain/lib/config.ts`: `LLDBI_COLLECTION_*`, `LLDBI_TOP_K`, `LLDBI_EMBED_*`, `QDRANT_*` (legislation cluster), `ACT_TAXONOMY_TTL_SEC`, `LLDBI_ADMIN_HINTS_ENABLED`. Деталі: [[Lexery - Brain Environment Reference]].

## Розширені тести / аудити

- `pnpm brain:audit:lldbi-act-coverage`
- `pnpm brain:verify:lldbi-kku115`
- Retrieval suite: [[Lexery - Brain Test and Verify Map]]

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

## See Also

- [[Lexery - ORCH and Clarification]]
- [[Lexery - Memory and Documents]]
- [[Lexery - U5 Gate]]
- [[Lexery - Brain Environment Reference]]
- [[Lexery - Brain Test and Verify Map]]
