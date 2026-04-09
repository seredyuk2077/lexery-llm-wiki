---
aliases:
  - Product Surface
tags:
  - lexery
  - product
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: product
---

# Lexery - Product Surface

## What “Product Surface” Means Here

This page is about the user-facing and control-plane layer around the Brain:

- `apps/portal`
- `apps/api`
- auth, workspaces, uploads, chat shell, settings, plans

## apps/portal

### Observed

- Real Next.js frontend.
- `apps/portal/README.md` explicitly states:
  Next.js 16, React 19, TypeScript.
- Source tree includes:
  workspace layout, chat UI, attachments, sidebar, settings, search overlay, boot screens, workspace chat hooks, server OpenRouter routes.

### Important meaning

- `Observed`:
  portal is not speculative.
- `Drift`:
  root README still calls it a future placeholder.

## Chat Layer

### Observed

- `apps/portal/src/chat-api/route.ts`
- `apps/portal/src/chat-api/stream/route.ts`
- `apps/portal/src/lib/server/openrouter.ts`

### Meaning

- The frontend already owns a working AI chat path through Next.js server routes and OpenRouter.
- This is a significant product fact because it means current portal experience is not purely mocked.

## Workspaces

### Observed

- `apps/api/src/workspaces/workspaces.controller.ts`
- `AuthUser` includes `workspaceId`.
- Portal has `(workspace)` layout and `WorkspaceScreen`.

### Inferred

- Workspace is one of the product’s core identity objects, not a cosmetic shell.

## Auth

### Observed

- `apps/api` has `SupabaseAuthGuard`.
- `AuthService` provisions tenant + workspace + subscription.
- `origin/dev` contains auth screen work and open registration infra PR.

### Meaning

- Auth is already being shaped as a real production boundary.
- Product shell is moving toward richer identity methods and profile sync.

## Uploads / Attachments

### Observed

- `apps/api/src/storage/*` implements presigned upload support.
- Shared contracts on `origin/dev` include attachments with either `contentBase64` or `presignedUrl`.
- Portal has attachment panels and chat attachment hooks.

### Meaning

- Documents are not an afterthought.
- There is a visible path from portal attachments to run contracts and, eventually, Brain/MM docs.

## Plans / Profile / UI State

### Observed

- `origin/dev` has `beta-plan.ts`.
- Plan visuals are already embedded into sidebar/profile flows.
- Portal has local app preferences and workspace shell refinements.

## apps/api

### Observed

- NestJS app with auth, prisma, storage, workspace controllers.
- Prisma schema models:
  `User`, `Tenant`, `TenantUser`, `Subscription`, `Workspace`

### Meaning

- `apps/api` is the control-plane nucleus.
- It is closer to an account/workspace/governance layer than a full business backend at this stage.

## Biggest Product Reality

- `Observed`:
  the current product shell is already more advanced than the root repo docs admit.
- `Observed`:
  the brain branch is more advanced than the current product shell is integrated with.
- `Inferred`:
  Lexery’s true product surface is currently split between live portal routes and future Brain integration contracts.

## See Also

- [[Lexery - Technology Stack]]
- [[Lexery - Business Model]]
- [[Lexery - Current State]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Brain Architecture]]
