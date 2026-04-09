---
aliases:
  - U4 Retrieval
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - U4 Retrieval

## Runtime Role

U4 is the main legal evidence retrieval engine.

## Current Code Surfaces

- `apps/brain/retrieval/*`
- helpers/finalization clusters

## Documented Surface

U4 docs cover:

- pipeline
- code
- refactor direction
- env
- smoke, quality, multi-goal, real-dev, act-type verification suites

## Why U4 Is Special

Current runtime docs explicitly say U4 already had the strongest intelligence in the system before ORCH upgrade.

## What U4 Handles

- [[Lexery - LLDBI Surface|LLDBI]]-first retrieval
- taxonomy support
- query rewrite
- planner/routing hints
- [[Lexery - Coverage Gap Honesty|coverage-gap]] derivation
- memory touchpoints
- retrieval trace shaping

## Historical Lineage

- legacy `CacheRAG`
- `codex/legal-rag-foundation` branch focused heavily on U4 helper clustering, soft-query honesty, multi-goal coverage
- current `legal-agent-brain-dev` continues this line with query rewrite and recovery optimization

## Current Risk/Opportunity

- strong on direct/hard references
- still weaker on soft multi-goal natural legal requests

## See Also

- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - U5 Gate]]
- [[Lexery - Corpus Evolution]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Provider Topology]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - U3 Planning]]
- [[Lexery - U6 Recovery]]
