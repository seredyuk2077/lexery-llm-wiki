---
aliases:
  - U12 Deliver
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

# Lexery - U12 Deliver

## Runtime Role

U12 persists and delivers the final result.

## Current Code Surfaces

- `apps/brain/write/deliverConsumer.ts`
- outbox and downstream persistence hooks

## Documented Surface

U12 docs explicitly mention:

- inputs
- actions
- output
- code
- idempotency and concurrency
- pipeline
- DB schema notes

## What U12 Owns

- final message delivery
- persistence semantics
- outbox/event emission
- completion handoff

## Current Observed Themes

- direct `verify complete -> U12` shortcut in some runtime paths
- preservation of delivery semantics even when orchestration vocabulary expands

## Why It Matters

U12 is where Lexery stops being an internal runtime and becomes an actual user-visible system effect.

## See Also

- [[Lexery - U11 Verify]]
- [[Lexery - Memory and Documents]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Public Trace]]
