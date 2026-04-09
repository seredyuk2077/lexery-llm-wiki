---
aliases:
  - DocList Surface
  - DocList
  - Document List Resolver
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
> - `raw/architecture-docs/app-README.md`

# Lexery — DocList Surface

**DocList** is the **document list / legislation catalog resolver** layer: it turns messy user language and partial identifiers into **structured act identity** against the Rada legislation catalog. It pairs with [[Lexery - LLDBI Surface|LLDBI]] (what is indexed) in [[Lexery - Retrieval, LLDBI, DocList|retrieval]].

## Three applications

| App | Responsibility |
|-----|----------------|
| **`doclist-resolver-api`** | Lookup and **disambiguation** for act identification |
| **`doclist-full-import`** | **Bulk** catalog import / rebuild workflows |
| **`doclist-updater-db`** | **Incremental** updates as the catalog changes |

Together they keep the **catalog** aligned with parliament data while exposing a **stable API** for the agent pipeline.

## Role in the product

**Rada legislation catalog** → **structured lookup** → Brain can ask “which act does this query mean?”

When [[Lexery - Brain Architecture|Brain]] must bind a query to a concrete act, DocList is the authority for **catalog membership** and **identifier normalization** (subject to the caveats below). [[Lexery - LLDBI Surface|LLDBI]] then answers whether that act is **indexed** for vector search.

## Reason codes (disambiguation and gaps)

DocList and downstream stages emit reasons that downstream logic (including [[Lexery - U6 Recovery|U6]]) interprets:

- **`AMBIGUOUS_ACT_MATCH`** — multiple plausible acts; may need [[Lexery - ORCH and Clarification|clarification]]
- **`ACT_FOUND_IN_CATALOG_NOT_INDEXED`** — catalog hit but not in [[Lexery - LLDBI Surface|LLDBI]] / Qdrant → ties to [[Lexery - Import Proposal Loop|import proposals]]
- **`ACT_FOUND_BUT_ARTICLE_NOT_RETRIEVED`** — act known but retrieval did not surface the article slice
- **`ACT_NOT_FOUND_IN_CATALOG`** — no catalog anchor; different recovery path

These codes are part of [[Lexery - Coverage Gap Honesty|honest coverage]] and [[Lexery - Retry and Recovery|retry policy]].

## Integration: U6 Recovery

[[Lexery - U6 Recovery|U6 Recovery]] calls DocList when **retrieval** needs **disambiguation** or catalog confirmation — especially after a weak or ambiguous [[Lexery - U4 Retrieval|U4]] pass. The resolver output feeds traces consumed by [[Lexery - Run Lifecycle|run snapshots]] (`doclist_trace`).

## Exact identifiers: `interpret.ts` and `pipeline.ts`

For **`nreg`** probes, **`interpret.ts`** and **`pipeline.ts`** **strip year-hardening filters** so exact structured identifiers are not over-constrained by year heuristics. That preserves precision when the user (or upstream) already supplied a registry-grade key.

## Lookup priority (conceptual)

1. **Exact structured identifiers** first (strongest signal)
2. **Act-title cues** and metadata matches
3. **Broad rewrite** / noisy text last (highest false-positive risk)

This ordering reduces accidental binding when [[Lexery - U4 Retrieval|query rewrite]] adds generic terms.

## Historical note

The **DocList updater** lineage starts in the public beta repo under paths such as `scripts/legislation/Documentation List DB/UpdaterDB/`. The current split apps are the production evolution of that script-era updater.

> [!info] Catalog vs index
> DocList can say “act exists”; [[Lexery - LLDBI Surface|LLDBI]] must still contain chunks for **retrieval**. Always cross-check both when triaging “missing law” reports.

## Related

- [[Lexery - LLDBI Surface]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - U6 Recovery]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - Corpus Evolution]]
- [[Lexery - Legacy Beta App]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Coverage Gap Honesty]]

## See Also

- [[Lexery - Storage Topology]]
- [[Lexery - Decision Registry]]
- [[Lexery - Deployment and Infra]]
