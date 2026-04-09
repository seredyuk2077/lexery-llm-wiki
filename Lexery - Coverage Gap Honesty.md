---
aliases:
  - Coverage Gap Honesty
  - Coverage Gap
  - Evidence Honesty
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery — Coverage Gap Honesty

When the Legal Agent **cannot** ground an answer in sufficient retrieved legal evidence, the system must **say so** — not invent citations. This note captures the **coverage gap** model and how [[Lexery - U10 Writer|U10]] / [[Lexery - U11 Verify|U11]] cooperate.

## Core idea

**Honesty over completeness**: a partial or missing corpus is an **explicit state**, not something to paper over with confident prose. That posture connects to [[Lexery - DocList Surface|DocList]] reason codes and [[Lexery - Import Proposal Loop|import proposals]] when the gap is **fixable** by indexing.

## `coverage_gap_status` values

Representative values (as used across stages):

- **`none`** — no acknowledged corpus-level gap for this answer path
- **`likely_missing_act`** — strong suspicion the act is absent or unreachable in [[Lexery - LLDBI Surface|LLDBI]]
- **`partial_coverage`** — some evidence exists but not enough for a fully grounded answer

Exact enums live in code; names here track operational meaning.

## Resolution chain (effective gap)

When multiple layers emit signals, precedence follows:

1. **`evidence_assembly.coverage_gap_status`**
2. Else **`doclist_trace.corpus_gap_status`**
3. Else **`retrieval_trace.meta.coverage_gap`**

This ordering prefers **late-stage assembly truth** over earlier retrieval noise, while still surfacing catalog-level gaps from [[Lexery - DocList Surface|DocList]].

## U10 Writer: `resolveEffectiveCoverageGap(runContext)`

[[Lexery - U10 Writer|U10]] calls **`resolveEffectiveCoverageGap(runContext)`** to decide what gap narrative and constraints apply **before** drafting. That function is the **single choke point** for “what should the writer believe about coverage?”

## U11 Verifier: relaxed citation rules

When **`coverage_gap != none`**, [[Lexery - U11 Verify|U11]] **relaxes citation requirements** appropriately — the verifier should not demand impossible pinpoint cites for text that cannot exist in the index.

> [!info] Policy intent
> Relaxation is **not** a license to hallucinate; it is recognition that **verification criteria must match available evidence**.

## Terminal blockers and “write-compatible” corpus gaps

Certain [[Lexery - DocList Surface|DocList]] outcomes are treated as **write-compatible terminal blockers** for corpus-gap answers, including:

- **`ACT_FOUND_IN_CATALOG_NOT_INDEXED`**
- **`ACT_NOT_FOUND_IN_CATALOG`**

In those modes the system can still produce a **controlled** answer that explains the limitation while feeding [[Lexery - Import Proposal Loop|import]] or research follow-ups.

## Live proof pattern (observed)

A **virtual assets gap** style case completed with:

- **`evidence_insufficient = true`**
- **`U11` verdict `complete`**

That demonstrates the intended coupling: **insufficient evidence** is **compatible** with a **completed** run when the user receives an honest, policy-compliant outcome.

## Open questions

See [[Lexery - Open Questions and Drift]] for naming drift, enum expansion, and product copy around “we don’t have this act indexed yet.”

## Related

- [[Lexery - U10 Writer]]
- [[Lexery - U11 Verify]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Open Questions and Drift]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Retry and Recovery]]
