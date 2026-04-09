---
aliases:
  - U6 Recovery
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - U6 Recovery

## Runtime Role

U6 is the expand/recovery stage when first-pass evidence is not enough.

## Current Code Surfaces

- `apps/brain/expand/consumer.ts`
- supporting retry / retrieval state in neighboring runtime modules

## Documented Surface

U6 docs explicitly mention:

- runtime role
- live code
- outputs
- recovery behaviors
- cost-aware policy
- April 8 / April 9 runtime notes
- verification

## Current Observed Themes

- seeded rerun reuse
- reduced cost for repeated U4 retry paths
- clarification-aware resume behavior
- exact-cue [[Lexery - DocList Surface|DocList]] prioritization before broad noise

## Why It Matters

U6 is where Lexery tries to recover truthfully instead of fabricating completeness.

## Historical Lineage

- started as a stub in legacy implementation
- now central to bounded agentivity and ambiguity recovery

## Best Reading

- `Observed`:
  U6 went from conceptual placeholder to one of the hottest current runtime surfaces.
- `Inferred`:
  this is where Brain is most clearly learning to behave like a bounded agent.

## See Also

- [[Lexery - U5 Gate]]
- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - DocList Surface]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Import Proposal Loop]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - U4 Retrieval]]
