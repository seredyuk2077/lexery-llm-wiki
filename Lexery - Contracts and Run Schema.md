---
aliases:
  - Contracts and Run Schema
tags:
  - lexery
  - product
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: product
---

# Lexery - Contracts and Run Schema

## Why This Page Exists

One of the most important convergence layers in Lexery is the run contract:

- what portal/API submit
- what Brain accepts
- how auth/plan/attachments enter runtime

## Shared Contract Signals

### From `origin/dev` `packages/contracts`

- `CreateRunRequestSchema`
- `AttachmentInputSchema`
- `CreateRunResponse`
- `AuthContext`
- `RunEvent`
- `RunSnapshot`

## CreateRun Request Fields

- `query`
- `tenant_id`
- `user_id`
- `conversation_id`
- `locale`
- `client_context`
- `attachments`
- `dry_run`
- `debug`
- `idempotency_key`
- `allow_anonymous`

## Attachment Shape

Each attachment must provide exactly one source:

- `contentBase64`
- or `presignedUrl`

## Auth Context Shape

- `tenant_id`
- `user_id`
- `plan_tier`
- `features`

## Snapshot Meaning

The runtime contract already anticipates:

- request snapshotting
- auth snapshotting
- flags
- version
- overflow references
- project/mm context

## Why This Matters

- `Observed`:
  Lexery is trying to make the product-to-brain boundary explicit and typed.
- `Inferred`:
  shared contracts are the main antidote to branch drift between `origin/dev` and Brain branch work.

## Major Drift Still Present

- plan taxonomy is still inconsistent across backend and frontend
- some contract richness exists in `origin/dev` more clearly than in current local checked portal/api code

## See Also

- [[Lexery - API and Control Plane]]
- [[Lexery - Business Model]]
- [[Lexery - Branch Divergence]]
