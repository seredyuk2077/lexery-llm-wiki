---
aliases:
  - Open Questions and Drift
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: governance
---

# Lexery - Open Questions and Drift

## Purpose

LLM Wiki має не лише збирати знання, а й позначати **місця невідповідності**. Ця сторінка фіксує саме такі зони.

## Drift 1 — Root README vs reality

### Observed

- Root `README.md` current repo says `apps/portal` is a reserved placeholder.
- `apps/portal` is in fact a real Next.js app with many product surfaces.

### Meaning

- Root orientation docs are stale.

## Drift 2 — Plan taxonomy

### Observed

- Backend schema comment:
  `free/pro/enterprise`
- Frontend plan UI:
  `free/starter/mentor/pro`

### Meaning

- Subscription model is not normalized across layers.

## Drift 3 — Verify/Deliver ownership

### Observed

- Architecture language suggests clean `U11` and `U12` separation.
- Current active consumers still live in `write/verifyConsumer.ts` and `write/deliverConsumer.ts`.

### Meaning

- Runtime is ahead of folder cleanup.

## Drift 4 — Azure docs vs checked code

### Observed

- Azure docs describe `api-gateway`, `agent-gateway`, `agent-worker` split with `ROLE=API/WORKER`.
- Current repo does not fully prove that deploy topology in code.

### Meaning

- Azure topology should be read as target architecture unless separately verified live.

## Drift 5 — Business model vs billing plumbing

### Observed

- Plans and subscriptions are visible.
- Payment provider integration is not.

### Meaning

- Monetization semantics exist earlier than billing implementation.

## Drift 6 — Docs maturity vs integration maturity

### Observed

- Brain architecture is extensively documented.
- Product shell is visibly progressing.
- End-to-end integration between portal/api/brain is still incomplete.

### Meaning

- Documentation completeness in one subsystem can give a false sense of total product integration.

## Drift 7 — Legacy naming and repo lineage

### Observed

- Older repos are still named `Ukrainan-Lawyer-LLM(-BETA)`.
- Current product identity is `Lexery`.

### Meaning

- Repository naming still reflects historical layers, not current brand/system boundaries.

## Key Open Questions

- Which branch will become the real convergence branch:
  `dev`, `legal-agent-brain-dev`, or a new integration branch?
- What is the final canonical plan taxonomy?
- How will payments actually be wired?
- Which pieces of memory/docs ship in first productized form?
- Is Azure really the final host shape, or only one planning target?
- What is the real production path:
  portal → api → brain, or portal direct route layers plus later migration?

## Recommended Future Wiki Expansions

- add customer / user interview history if it exists locally
- ingest Figma or frontend design sources if available
- ingest more Linear documents, especially context packets
- ingest LLDBI admin reports and runtime forensics as first-class pages

## See Also

- [[Lexery - Source Map]]
- [[Lexery - Current State]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Business Model]]
- [[Lexery - Drift Radar]]
- [[Lexery - Unknowns Queue]]
- [[Lexery - Decision Registry]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Log]]
