---
aliases:
  - Memory and Documents
tags:
  - lexery
  - data
  - infra
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: data
---

# Lexery - Memory and Documents

## Why This Page Matters

Пам’ять у Lexery — це не дрібна embellishment-фіча. У legacy architecture вона була однією з центральних систем, а в current repo її сліди вже існують у runtime, contracts, outbox patterns і document surfaces.

## Legacy Vision

### Memory Manager

- Full logical scheme in bridge repo `plan.md` includes:
  users, profiles, cases, conversations, messages, summaries, memory items, run snapshots.
- Scopes:
  conversation, case/project, user-global.
- Types:
  preferences, facts, constraints, glossary, notes.
- Flow:
  proposed → confirmed/rejected.

### ContextPack

- Memory was designed to enter the runtime in bounded blocks:
  profile, case, rolling summary, memory items, recent messages, retrieved history.

### Case digest / rolling summaries

- Memory was expected to produce structured case-level and conversation-level summaries for lawyer workflow continuity.

## Current Observed Surfaces

### In apps/brain

- `mm/`
- `mm/doc/`
- memory tools
- outbox-related stabilization issues in Linear

### In contracts and product surfaces

- Attachments already appear in shared request schemas.
- Portal already has attachments UI.
- Gateway and R2 attachment overflow already exist in Brain docs/readmes.

## Document Story

### Observed

- Portal includes attachments panel and file preview/UI.
- API includes presigned upload endpoint.
- Brain README describes R2 overflow attachments under `runs/{tenant_id}/{run_id}/attachments/`.
- MM docs are explicitly mentioned as a runtime surface.

### Inferred

- Documents are intended to become a first-class retrieval/memory layer, not just chat add-ons.

## Current Maturity Reading

- `Observed`:
  the architectural vision for memory is far ahead of what is clearly exposed as stable product behavior today.
- `Observed`:
  memory/outbox correctness is still an active stabilization topic in Linear.
- `Inferred`:
  Lexery sees durable context as one of the key differentiators for professional legal use.

## Tension

### Strong vision

- structured memory
- semantic indexing
- scoped recall
- doc-aware context
- post-run extraction

### Strong implementation risk

- cross-tenant correctness
- outbox integrity
- ordering and idempotency
- privacy and retention
- keeping memory useful rather than noisy

## Best Synthesis

Memory in Lexery is best understood as **the second brain behind the Brain**:

- retrieval answers “what law is relevant?”
- memory answers “what from this user/case/project history still matters?”

The vision is already clear.
The implementation is partially present and still being hardened.

## See Also

- [[Lexery - Brain Architecture]]
- [[Lexery - Product Surface]]
- [[Lexery - Linear Roadmap]]
- [[Lexery - Open Questions and Drift]]
- [[Lexery - Storage Topology]]
- [[Lexery - Provider Topology]]
- [[Lexery - U9 Assemble]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Unknowns Queue]]
