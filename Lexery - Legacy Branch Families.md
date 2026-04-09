---
aliases:
  - Legacy Branch Families
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: history
---

# Lexery - Legacy Branch Families

## Why This Page Matters

У старому public repo історія йшла не лише по одній `main`, а через окремі branch families. Це дуже важливо для mental map, бо кожна така гілка відображає окрему лінію еволюції продукту.

## Branch Family 1 — `new-design-v3-final`

### Commit arc

- `🎨 New Design Version 3 - Enhanced Chat Interface`
- `Major UI improvements and chat management enhancements`
- `rada gov UA API + data base upd`
- `Implement comprehensive legal database management system`
- final branch tip:
  `Law Database`

### Meaning

- `Observed`:
  this is the UI/design-first evolution line.
- `Inferred`:
  product experience and legal database ambitions were already being combined here.

### Child page

- [[Lexery - Branch new-design-v3-final]]

## Branch Family 2 — `before-LawDatabase`

### Tip

- `Documentation Update + Tests Consolidation`

### Meaning

- `Observed`:
  acts like a checkpoint before database-heavy evolution.
- `Inferred`:
  useful as a boundary marker between simpler app phase and law-data phase.

### Child page

- [[Lexery - Branch before-LawDatabase]]

## Branch Family 3 — `feature/supreme-court-case-law-rag`

### Commit arc

- starts from the same early design/database line
- adds:
  `refresh legal agent architecture`
  `Supreme Court RAG integration`
  legislation architecture and open data portal index
  huge DocList / importer / validator / verify phase wave
  finishes with legislation completion summary

### Meaning

- `Observed`:
  this branch became much bigger than “case law only”.
- `Inferred`:
  it turned into the corpus-engineering spine of the project.

### Child page

- [[Lexery - Branch Supreme Court Case Law RAG]]

## Branch Family 4 — `feature/lexery-legal-agent-architecture`

### Commit arc

- legislation completion
- full architecture documentation
- U1, U2, U3, U4, U5 implementation
- later runtime stabilization and tool/doc structure cleanup

### Meaning

- `Observed`:
  this is the most direct ancestor of current `apps/brain`.

### Child page

- [[Lexery - Branch Lexery Legal Agent Architecture]]

## Branch Family 5 — `codex/legal-rag-foundation`

### Observed recent commit cluster

- `Improve soft-query honesty and multi-goal coverage`
- `Refactor U4 helpers and add soft-query audit pack`
- `Refactor U4 finalization cluster and reverify soft audits`
- `Cluster U4 retrieval helpers and clean structure`

### Meaning

- `Observed`:
  this branch sits much later in time, around late March 2026.
- `Inferred`:
  it looks like a focused precursor to the current retrieval-hardening line in `legal-agent-brain-dev`.

### Child page

- [[Lexery - Branch codex legal-rag-foundation]]

## Strategic Interpretation

These branches suggest at least five semi-independent historical lines:

- design/UI line
- early law database line
- Supreme Court / case-law line
- legislation/corpus infra line
- legal brain/runtime hardening line

Lexery did not evolve through one straight pipeline.
It evolved through a **fan-out of branch families**, later partially re-absorbed into the current monorepo.

## See Also

- [[Lexery - GitHub History]]
- [[Lexery - Timeline]]
- [[Lexery - Corpus Evolution]]
- [[Lexery - Legacy Architecture Bridge]]
