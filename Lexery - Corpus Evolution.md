---
aliases:
  - Corpus Evolution
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: history
---

# Lexery - Corpus Evolution

## Why This Page Exists

Corpus evolution is one of the deepest invisible stories in Lexery. Without it, the Brain can look overdesigned. With it, Brain architecture reads as a response to real retrieval pain.

## Phase 1 — simple legal knowledge base

- Early beta app referenced a legal knowledge base and law lists.
- At this stage, legal grounding was still relatively app-level.

## Phase 2 — law database seriousness

### Signals

- `rada gov UA API + data base upd`
- `Implement comprehensive legal database management system`

### Meaning

- `Observed`:
  project moved from “assistant with legal knowledge” to “system with legal data pipeline”.

## Phase 3 — Supreme Court and legislation broadening

### Signals

- Supreme Court RAG branch
- `docs/supreme_court_rag.md`
- `docs/supreme_court_benchmark.md`

### Meaning

- legislation remained central
- case law became an explored expansion path

## Phase 4 — DocListDB and validation waves

### Strongly observed in Jan 2026 history

- daily updater
- Qdrant sync
- document type validation
- importer phases
- soak/batch control loops
- gate audits
- health reduction to zero criticals

### Meaning

- `Observed`:
  this is where corpus work became production discipline.

## Phase 5 — standalone legislation infra packaging

### Observed

- `Lexery Legislation DB Infra` packaged as standalone prod microservice
- portable runs in R2
- cleanup, completion docs

### Meaning

- corpus stack became something close to a product subsystem of its own

## Phase 6 — Brain-admin loop

### Observed in current monorepo

- `apps/lldbi/brain-admin`
- corpus-gap recovery docs
- import proposals / conservative worker policy

### Meaning

- the corpus is no longer just background data.
- the Brain is starting to talk back to corpus/admin processes.

## Best Synthesis

Lexery’s corpus story evolved through:

- knowledge base
- law database
- retrieval infra
- validation discipline
- standalone legislation subsystem
- Brain-admin feedback loop

This is one of the clearest signs that the project is trying to build defensible legal infrastructure, not only a nicer UI around an LLM.

## See Also

- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Legacy Branch Families]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Deployment and Infra]]
