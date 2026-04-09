---
aliases:
  - API and Control Plane
tags:
  - lexery
  - product
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: product
---

> [!info] Compiled from
> - `raw/architecture-docs/app-README.md`
> - `raw/codebase-snapshots/supabase-schema-2026-04-09.md`
> - Direct codebase analysis: `apps/api/`

# Lexery - API and Control Plane

## What This Layer Is

`apps/api` is the current control-plane nucleus of Lexery. It does not yet look like the full “business backend”, but it already defines the core account/workspace/governance model around the Brain.

## Main Surfaces

- `auth/`
- `prisma/`
- `storage/`
- `workspaces/`

## Data Model

### Observed Prisma entities

- `User`
- `Tenant`
- `TenantUser`
- `Subscription`
- `Workspace`

### Meaning

- `User`:
  identity object
- `Tenant`:
  account / ownership boundary
- `Workspace`:
  operational surface for work
- `Subscription`:
  feature/plan state carrier

## Auth Flow

### Observed in `AuthService`

- `resolveAndSyncUser(...)` looks up user by Supabase ID
- if absent, it creates:
  user
  tenant named `Personal Space`
  owner relation
  default `free` subscription
  default `General` workspace

### Meaning

- `Observed`:
  onboarding is already designed as tenancy + workspace creation, not only user login.
- `Inferred`:
  Lexery assumes each user enters through a “personal legal workspace” model by default.

## Auth Context Returned Downstream

- `userId`
- `email`
- `role`
- `tenantId`
- `workspaceId`
- `planCode`
- `agentEnabled`
- `docsEnabled`

### Meaning

- This is already close to a product operating context, not only an auth identity.

## Storage Layer

### Observed

- Presigned upload service exists.
- R2 key patterns include:
  `tenant/{tenantId}/mm/docs/user/{userId}/raw/...`
  `tenant/{tenantId}/runs/{runId}/attachments/...`

### Meaning

- Uploads are already partitioned by tenant and role.
- MM Docs and run attachments are both anticipated storage classes.

## Contract Layer

### Observed from `origin/dev`

- `packages/contracts` introduces shared Zod contracts for backend and agent.
- Attachments can be inline base64 or presigned URL.
- CreateRun schema already anticipates:
  query, tenant/user, conversation, locale, attachments, dry-run, debug, idempotency.

### Meaning

- The control plane is trying to become a contract-stable boundary between portal and brain.

## Biggest Reading

- `Observed`:
  apps/api is still relatively small in code size.
- `Observed`:
  but the shapes it defines are strategically central.
- `Inferred`:
  this layer is where Lexery will either successfully integrate product + brain, or accumulate painful divergence.

## See Also

- [[Lexery - Technology Stack]]
- [[Lexery - Product Surface]]
- [[Lexery - Business Model]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Memory and Documents]]
- [[Lexery - Current State]]
