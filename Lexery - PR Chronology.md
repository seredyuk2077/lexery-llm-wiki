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
updated: 2026-04-09
status: observed
layer: team
---

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

**Каденція:** близько одного PR на день, усі в `dev`. **Префікси:** Frontend / Backend / Agent. **Виняток:** Brain часто в `legal-agent-brain-dev` без PR у цьому репо — див. [[Lexery - GitHub History|історію GitHub]].
