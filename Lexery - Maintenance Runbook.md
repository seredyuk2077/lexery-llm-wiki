---
aliases:
  - Maintenance Runbook
  - Runbook
  - Wiki Maintenance
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: planned
layer: meta
---

# Lexery - Maintenance Runbook

Operational guide for keeping the **Lexery second brain** aligned with repos, Linear, and production reality — without boiling the ocean every week.

**Cost guardrails**: [[Lexery - Cost Ledger]]. **What we ingest**: [[Lexery - Source Registry]]. **Automation design** (target state): [[Lexery - Automation Architecture]].

## Principles

1. **Delta-first**: summarize what *changed*, not the entire monorepo, unless a monthly audit demands it.
2. **Human gate for P0**: production, security, and customer-facing claims need eyes — Tier 2 models propose, humans confirm.
3. **Single chronology**: every automated pass leaves a trace in [[Lexery - Log]].

---

## Tier 1 — Daily (automated, no model)

**Goal**: catch motion early; **cost ~$0**.

### Steps

1. **Per tracked repo** (see [[Lexery - Source Registry]]), run:
   - `git fetch --all --prune` (if network allowed)
   - `git log --oneline --since="1 day ago"`
2. If new commits exist:
   - Append a **one-line digest** per repo to [[Lexery - Log]] (date, branch, hash prefix, author if useful).
3. **Branch inventory**:
   - `git branch -a` (or scripted equivalent) — flag **new remote branches** for human review in [[Lexery - Drift Radar]] or [[Lexery - GitHub History]].

### Outputs

- Updated [[Lexery - Log]].
- Optional: JSON/CSV drop under `_system/state/` with last-seen `HEAD` per repo (implementation detail).

### Failure modes

- **Fetch blocked**: log "offline pass" and use local-only `git log`.
- **Dirty worktree**: note in Log — may explain skew in [[Lexery - Branch Divergence]].

---

## Tier 2 — Weekly (automated, cheap model via OpenRouter)

**Goal**: structured delta for maintainers; **target cost** pennies per run (see [[Lexery - Cost Ledger]]).

### Steps

1. **Monorepo stat delta**:
   - `git diff HEAD~20..HEAD --stat` (adjust window by velocity).
2. **GitHub PRs** (if `gh` authenticated):
   - `gh pr list --state all --limit 10`
3. **Linear** (via MCP or export):
   - New/changed issues touching **Brain**, **Portal**, **LLDBI**.
4. **Model pass** (cheap model):
   - Input: the above artifacts + previous week's [[Lexery - Log]] tail.
   - Output: **bullet summary**: themes, risks, suggested wiki page updates (file names only).
5. **Human or scripted patch**:
   - Apply edits to **canon pages**: [[Lexery - Current State]], [[Lexery - Linear Roadmap]], stage notes if behavior changed.
6. **Drift**:
   - Append any **new contradictions** to [[Lexery - Drift Radar]]; do not duplicate resolved items.

### Outputs

- Short "week in Lexery" block in [[Lexery - Log]].
- Targeted wiki patches + unresolved link list (if any).

---

## Tier 3 — Monthly (manual or premium model)

**Goal**: consistency and architecture refresh; **budget** in [[Lexery - Cost Ledger]].

### Steps

1. **Full consistency audit**:
   - Orphan wikilinks, pages with `status: inferred` that should graduate to `observed`, duplicated narratives between [[Lexery - Open Questions and Drift]] and [[Lexery - Drift Radar]].
2. **[[Lexery - Current State]]** rewrite pass — one screen executive truth.
3. **Canvases** ([[Lexery - Master Map.canvas]], [[Lexery - Runtime Graph.canvas]], etc.) if repo topology or pipeline edges changed.
4. **[[Lexery - Cost Ledger]]** — reconcile estimated vs actual spend if bills available.
5. **Drift retirement**:
   - Move fixed items out of [[Lexery - Drift Radar]] into [[Lexery - Log]] or archive section.

### Outputs

- Updated `updated:` frontmatter on touched pages.
- Explicit list of **new unknowns** for [[Lexery - Unknowns Queue]].

---

## File system conventions (planned)

| Path | Purpose |
|------|---------|
| `_system/scripts/` | Cron-friendly shell/TS for Tier 1–2 |
| `_system/state/` | Last-processed SHAs, hashes, dedupe keys |
| `_system/exports/` | Optional Linear/JSON snapshots |

If these folders do not exist yet, create them when first script lands — document the addition in [[Lexery - Log]].

## Escalation

- **Security or credential exposure** in logs → stop automation, rotate secrets, fix redaction before next Tier 2 run.
- **Contradiction between prod behavior and docs** → P0 row in [[Lexery - Drift Radar]] + owner in [[Lexery - Team and Operating Model]].

## Links

- [[Lexery - Automation Architecture]]
- [[Lexery - Cost Ledger]]
- [[Lexery - Log]]
- [[Lexery - Index]]
- [[Lexery - Source Registry]]
