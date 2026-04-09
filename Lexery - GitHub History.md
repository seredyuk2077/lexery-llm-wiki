---
aliases:
  - GitHub History
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: history
---

# Lexery - GitHub History

## Current Main Monorepo Repo

### Repository metadata

- Repo:
  `lexeryAI/Lexery`
- Visibility:
  private
- Created:
  `2026-03-13T19:08:54Z`
- Default branch:
  `dev`
- Updated:
  `2026-04-08T18:02:56Z`

## Current PR Ledger

- PR #1:
  `chore: migrate frontend and configurate it to use monorepo infra`
- PR #2:
  `[Backend] feat: add storage controller/service with uploading functionality`
- PR #3:
  `[Backend] feat: tweak user schema and auth service to match new auth data`
- PR #4:
  `Redesign system prompt editor`
- PR #5:
  `[Backend / Agent] feat: add shared contracts(zod/types) for backend and agent`
- PR #6:
  `[Agent] chore: change doclist script names to prevent errors`
- PR #7:
  `[Frontend] feat: auth pages`
- PR #8:
  `[Frontend] chore: refactor auth`
- PR #9:
  open, `[Frontend] feat: add infra for email/sms/oauth registration`
- PR #10:
  `[Frontend] feat: subscription plans`

## Current Branch Family In Remote Repo

- `dev`
- `legal-agent-brain-dev`
- `architecture/backend-foundation`
- `chore/migrate-frontend`
- `chore/migrate-legalAgent`
- `feat/shared-contracts`
- `feat/file-upload-presigned-urls`
- `feat/adapt-new-auth-methods`
- `feat/auth-infrastructure`
- `chore/refactor-auth`
- `{Frontend}-chore/auth`

## What The Branch Names Reveal

- `Observed`:
  main repo history itself records monorepo assembly as separate waves:
  frontend migration, legal-agent migration, backend foundation, shared contracts, auth, plans.
- `Observed`:
  `legal-agent-brain-dev` remains a named long-lived branch in remote, not only local.
- `Inferred`:
  the monorepo was assembled by pulling together previously separate technical lines.

## Contributors

### Current monorepo

- `puhachyeser`
- `seredyuk2077`
- `alexbach093`

### Legacy public beta repo

- `seredyuk2077`

## Legacy Public Repo Metadata

- Repo:
  `seredyuk2077/Ukrainan-Lawyer-LLM-BETA`
- Visibility:
  public
- Created:
  `2025-09-26T19:36:46Z`
- Default branch:
  `main`
- Updated:
  `2026-01-20T13:19:18Z`

## Important GitHub Insight

The GitHub record shows Lexery’s evolution in two steps:

- public/open experimentation and architecture growth in `Ukrainan-Lawyer-LLM-BETA`
- private monorepo productization in `lexeryAI/Lexery`

## Recent Development Velocity

Snapshot for the **last 30 commits** (all from **Andriy** on branch `legal-agent-brain-dev`, **2026-03-31** → **2026-04-09**):

- **Focus:** hardening retrieval, recovery reruns, ORCH cost, clarification resume, corpus-gap completion
- **Velocity:** ~3–4 commits/day
- **Themes by date:**
  - **Apr 2:** multi-goal act recovery, compact bundle policy, act-scope honesty
  - **Apr 3:** weak-evidence semantics, missing-act honesty, goal-category envelope
  - **Apr 4:** singular legal-basis locators, natural procedure bundles
  - **Apr 7:** fix 353 TypeScript errors, archive audit datasets, harden U2/U4
  - **Apr 8:** bounded legal orchestrator, DocList recovery, brain-admin proposals
  - **Apr 9:** bounded recovery reruns, clarification resume, ORCH telemetry, corpus-gap completion

**Branch drift (local snapshot, verify with `git status` / `git fetch`):**

- `legal-agent-brain-dev` may be **~13 commits ahead** of its remote tracking branch
- `dev` may be **~21 commits behind** `origin/dev`

## See Also

- [[Lexery - Legacy Branch Families]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Repo Constellation]]
