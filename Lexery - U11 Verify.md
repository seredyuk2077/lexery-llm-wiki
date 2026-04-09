---
aliases:
  - U11 Verify
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - U11 Verify

## Runtime Role

U11 checks whether the drafted answer is complete, grounded, and acceptable to deliver.

## Current Code Surfaces

- `apps/brain/write/verify.ts`
- current consumer path still tied into write-runtime split

## Documented Surface

U11 docs explicitly mention:

- inputs / output
- current logic
- important April 9 truth
- concurrency and durable persistence
- code
- observability
- pipeline

## Current Observed Themes

- verifier now respects [[Lexery - Coverage Gap Honesty|coverage-gap]] reality more honestly
- citation requirements can be relaxed when coverage gap is real and explicit
- verify-complete finalization can skip unnecessary ORCH arbitration in some cases

## Why It Matters

U11 is Lexery’s last legal trust gate before user delivery.

## Best Reading

- `Observed`:
  U11 is no longer a trivial “answer exists?” check.
- `Inferred`:
  verifier behavior is one of the project’s strongest product-trust differentiators.

## See Also

- [[Lexery - U10 Writer]]
- [[Lexery - U12 Deliver]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Coverage Gap Honesty]]
- [[Lexery - Retry and Recovery]]
- [[Lexery - Run Lifecycle]]
