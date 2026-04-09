---
aliases:
  - U10 Writer
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - U10 Writer

## Runtime Role

U10 is the main legal answer writer.

## Current Code Surfaces

- `apps/brain/write/legalAgent.ts`
- `apps/brain/write/consumer.ts`
- `apps/brain/write/outputValidator.ts`

## Documented Surface

U10 docs explicitly cover:

- inputs and output
- prompt stack
- evidence insufficient policy
- context structure
- context budget warnings
- prompt composer
- memory readiness
- model/config
- repair policy
- concurrency/idempotency
- observability
- code
- historical notes
- verification

## Current Observed Themes

- retry-write idempotency fixes
- effective [[Lexery - Coverage Gap Honesty|coverage-gap]] propagation
- evidence insufficient honesty
- output validation hardening
- still a major tail-latency and cost hotspot

## Why It Matters

U10 is where all prior bounded work can still be ruined if the answer layer becomes too free or too expensive.

## Best Reading

- `Observed`:
  U10 is powerful but expensive.
- `Observed`:
  current branch still spends meaningful effort on U10 reliability and repair behavior.
- `Inferred`:
  this is one of the main remaining bottlenecks between “good architecture” and “consistently great product behavior”.

## See Also

- [[Lexery - U9 Assemble]]
- [[Lexery - U11 Verify]]
- [[Lexery - Current State]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Provider Topology]]
