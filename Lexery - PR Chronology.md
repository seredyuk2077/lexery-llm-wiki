---
aliases:
  - PR Chronology
  - PR History
  - Pull Requests
tags:
  - lexery
  - team
  - operations
created: 2026-04-09
updated: 2026-04-10
status: observed
layer: team
---

> [!info] Compiled from
> - `raw/github-prs/pr-1.md`
> - `raw/github-prs/pr-2.md`
> - `raw/github-prs/pr-3.md`
> - `raw/github-prs/pr-4.md`
> - `raw/github-prs/pr-5.md`
> - `raw/github-prs/pr-6.md`
> - `raw/github-prs/pr-7.md`
> - `raw/github-prs/pr-8.md`
> - `raw/github-prs/pr-9.md`
> - `raw/github-prs/pr-10.md`

# PR chronology (`lexeryAI/Lexery`)

Ledger of **pull requests** on the main Lexery application monorepo as of the observed snapshot. For repo topology and older history, see [[Lexery - GitHub History]]. For *who* does what, see [[Lexery - Team and Operating Model]], [[Lexery - Andrii Serediuk]], [[Lexery - Yehor Puhach]], and [[Lexery - Olexandr]].

## Full PR table

| # | Title | State | Author | Branch → base | Created | Merged |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | [Frontend] feat: subscription plans | Merged | alexbach093 | `Frontend-feat-plans` → `dev` | Apr 8 | Apr 8 |
| 9 | [Frontend] feat: auth infra | Open | puhachyeser | `feat/auth-infrastructure` → `dev` | Apr 7 | — |
| 8 | [Frontend] chore: refactor auth | Merged | puhachyeser | `chore/refactor-auth` → `dev` | Apr 6 | Apr 6 |
| 7 | [Frontend] feat: auth pages | Merged | alexbach093 | `Frontend-chore-auth` → `dev` | Apr 4 | Apr 5 |
| 6 | [Agent] chore: doclist script names | Merged | puhachyeser | `chore/change-doclist-script-names` → `dev` | Apr 4 | Apr 4 |
| 5 | [Backend] feat: shared contracts | Merged | puhachyeser | `feat/shared-contracts` → `dev` | Apr 3 | Apr 4 |
| 4 | Redesign system prompt editor | Merged | alexbach093 | `Frontend-system-prompt-redesign` → `dev` | Apr 2 | Apr 3 |
| 3 | [Backend] feat: auth tweaks | Merged | puhachyeser | `feat/adapt-new-auth-methods` → `dev` | Apr 2 | Apr 2 |
| 2 | [Backend] feat: storage/upload | Merged | puhachyeser | `feat/file-upload-presigned-urls` → `dev` | Mar 30 | Mar 31 |
| 1 | chore: migrate frontend | Merged | puhachyeser | `chore/migrate-frontend` → `dev` | Mar 29 | Mar 29 |

> Branch names marked `Frontend-*` are normalized from frontend-prefixed topic branches; verify on GitHub if exact spelling matters for automation.

## Deep dive (selected PRs)

File counts, line totals, and commit counts below are taken from the snapshot exports (`raw/github-prs/pr-*.md` / matching JSON). **Key files** are the five judged most significant for architecture or product surface (not strictly the largest diffs).

### PR #1 — chore: migrate frontend

- **Key files changed:** `apps/portal/package.json` (portal wired into the monorepo), `apps/api/src/main.ts` (API surface adjusted for cohabitation), `apps/portal/.github/workflows/ci.yml` (CI for the new app), `apps/portal/Dockerfile` (deployable artifact), `apps/portal/src/app/(workspace)/layout.tsx` (workspace shell; large greenfield layout).
- **Commit count:** 1.
- **Lines:** +11,295 / −1 across **100** files (bulk is docs, scripts, assets, and portal scaffolding).
- **Why it matters for the wiki:** Establishes [[Lexery - Portal Surface Map|portal]] as a first-class `apps/portal` citizen and anchors [[Lexery - Technology Stack|tooling]] (Next, lint, Docker, workflows) documented in-repo. Without this PR, later frontend PRs (#7, #10) have no shared baseline in the ledger.

### PR #2 — [Backend] feat: storage/upload

- **Key files changed:** `apps/api/src/storage/storage.service.ts`, `apps/api/src/storage/storage.controller.ts`, `apps/api/src/storage/dto/create-presigned-url.dto.ts`, `apps/api/src/app.module.ts`, `apps/api/.env.example`.
- **Commit count:** 1.
- **Lines:** +337 / −23 across **10** files (`pnpm-lock.yaml` carries dependency drift).
- **Why it matters for the wiki:** Implements **presigned URL** flows tied to [[Lexery - Storage Topology|object storage]] and agent-compatible uploads; connects [[Lexery - API and Control Plane|API]] behavior to file-handling expectations in the product narrative.

### PR #5 — [Backend] feat: shared contracts

- **Key files changed:** `packages/contracts/src/index.ts` (new shared Zod/types package), `apps/brain/gateway/types.ts` (large deletion as types move out), `packages/contracts/package.json`, `apps/brain/eslint.config.js`, root `package.json` / `turbo.json` (workspace wiring).
- **Commit count:** 1.
- **Lines:** +199 / −136 across **10** files (net consolidation).
- **Why it matters for the wiki:** Documents the **contracts layer** between [[Lexery - Brain Architecture|brain]] and API—central for [[Lexery - Contracts and Run Schema|run schema]] honesty and for keeping docs aligned with a single source of types.

### PR #7 — [Frontend] feat: auth pages

- **Key files changed:** `apps/portal/auth/lib/auth-flow.ts` (flow orchestration), `apps/portal/src/components/workspace/DisplayNameOnboardingOverlay.tsx`, `apps/portal/src/components/workspace/WorkspaceScreen.tsx`, `apps/portal/auth/components/auth/AuthOtpRow.tsx`, `apps/portal/auth/components/auth/screens/EmailCodeScreen.tsx` (representative of the multi-screen auth UI set).
- **Commit count:** 6 (includes merge commits and a `refactor(portal): move auth into portal module` finish).
- **Lines:** +2,417 / −119 across **71** files.
- **Why it matters for the wiki:** Primary evidence for **end-user auth UX** and onboarding in [[Lexery - Portal Surface Map]]; the commit story (scaffold → merge from dev → polish) mirrors how parallel frontend work integrates into `dev`.

### PR #10 — [Frontend] feat: subscription plans

- **Key files changed:** `apps/portal/src/components/ui/WorkspaceSidebar.tsx`, `apps/portal/src/lib/beta-plan.ts` (new plan/beta semantics), `apps/portal/src/lib/app-preferences.ts`, `apps/portal/src/components/workspace/DisplayNameOnboardingOverlay.tsx` (small touch).
- **Commit count:** 2 (`feat: add frontend plan badges`, `feat: refine sidebar plan profile interactions`).
- **Lines:** +264 / −56 across **4** files.
- **Why it matters for the wiki:** Shows **commercial surface** evolution (plans, temporary issuance per author note) and tight coupling between sidebar chrome and preferences—useful when narrating product tiers next to [[Lexery - Cost Ledger|cost]] and access control.

## PR Velocity

Merged PRs grouped by **calendar week (Monday–Sunday)** using each PR’s **merge date** from the table above. Open PRs are excluded.

| Week (Mon start) | Merged PRs | PR numbers |
| --- | ---: | --- |
| Mar 23–29, 2026 | 1 | #1 |
| Mar 30 – Apr 5, 2026 | 6 | #2, #3, #4, #5, #6, #7 |
| Apr 6–12, 2026 | 2 | #8, #10 |

Bar chart (each full block ≈ one merged PR; scale capped at the busiest week):

```text
Mar 23–29      █  (1)
Mar 30–Apr 5   ██████  (6)
Apr 6–12       ██  (2)
```

**Read:** Velocity **spikes** the week of Mar 30–Apr 5 (backend auth tweak, shared contracts, doclist rename, auth pages landing, plus prompt editor redesign merge)—then **eases** as larger open work (#9 auth infra) sits beside incremental sidebar/plan polish (#8, #10).

## Linear Integration

Some PRs carry **Linear issue URLs** in the description body of the GitHub export:

| PR | Linear issue (from description) |
| --- | --- |
| **#2** | [LEX-201](https://linear.app/lexery/issue/LEX-201/storage-generaciya-agent-compatible-presigned-urls-u-nestjs) — storage / presigned URLs in NestJS |
| **#5** | [LEX-198](https://linear.app/lexery/issue/LEX-198/shared-contracts-unifikaciya-zod-shem-ta-tipiv) — shared contracts (Zod / types unification) |

No other PRs in the **#1 / #7 / #10** detail exports used for this note carried Linear links in the snapshot. For broader planning context, see [[Lexery - Linear Roadmap]].

## Observations

### Cadence and process

- Roughly **one PR per day** across the window — high throughput, small batches.
- **All PRs target `dev`** — no merges recorded to `main` / `master` in this ledger; release strategy may be tag-based or a separate promotion step not shown here.
- **Prefixes:** `[Frontend]`, `[Backend]`, `[Agent]` — easy filtering in GitHub and aligns with [[Lexery - Team and Operating Model|team lanes]].

### Merge latency

- **Same-day or next-day merge** is typical once review passes.
- PR **#9** (*auth infra*) remained **Open** at snapshot time — track resolution and whether it supersedes #8.

### Hygiene

- **~6 stale branches** from merged PRs are candidates for deletion to reduce noise vs [[Lexery - Branch Divergence]].
- **Brain-heavy work** on `legal-agent-brain-dev` often **does not appear** as Lexery PRs — significant runtime changes are **local / alternate remote**; see [[Lexery - GitHub History]] and [[Lexery - Current State]].

### Shape of change (selected PRs)

- **Monolith vs surgical PRs:** #1 is a **single commit** moving an entire app tree (+11k lines), while #10 is **two commits** touching four files—showing both **bootstrap** and **incremental product** modes in the same fortnight.
- **Backend PRs #2 and #5** are each **one commit** with narrow file lists—good for bisect and review, and #5’s negative line count in `gateway/types.ts` signals **deduplication** not feature bloat.
- **Frontend auth (#7)** is the **richest narrative** in git history here: six commits including merges and a final **module move** into `apps/portal`, matching a real integration story rather than a squash-only workflow.
- **Traceability gap:** Only **two** PRs in the sample explicitly link **Linear**; the wiki should not assume every merged PR has ticket metadata unless the export is enriched.

### Risk and documentation signals

- Large **asset and doc** additions in #1 mean the **runtime-critical** line count is smaller than raw `+11k` suggests; when explaining repo size to newcomers, separate **product code** from **design extraction artifacts**.
- **Open #9** alongside merged **#7/#8** creates a **planning fork** narrative: confirm whether infra work replaces refactors or stacks on them before updating [[Lexery - Portal Surface Map]].

## Author map (this ledger)

| GitHub user | Likely person (see team notes) |
| --- | --- |
| `puhachyeser` | [[Lexery - Yehor Puhach]] |
| `alexbach093` | [[Lexery - Olexandr]] |
| (no PRs in table) | [[Lexery - Andrii Serediuk]] — Brain work elsewhere |

## Related notes

- [[Lexery - GitHub History]]
- [[Lexery - Team and Operating Model]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]
- [[Lexery - Branch Divergence]]
- [[Lexery - Current State]]
- [[Lexery - API and Control Plane]] — backend PR themes
- [[Lexery - Portal Surface Map]] — frontend PR themes

## Українською (коротко)

**Каденція:** близько одного PR на день, усі в `dev`. **Префікси:** Frontend / Backend / Agent. **Виняток:** Brain часто в `legal-agent-brain-dev` без PR у цьому репо — див. [[Lexery - GitHub History|історію GitHub]]. **Швидкість:** найбільше мерджів за тиждень — 30 бер–5 квіт (шість PR). **Linear:** PR #2 (LEX-201) та #5 (LEX-198) мають посилання на задачі.

## See Also

- [[Lexery - Who Built What]]
- [[Lexery - Linear Roadmap]]
