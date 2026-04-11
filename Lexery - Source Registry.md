---
aliases:
  - Source Registry
  - Sources
  - Ingested Sources
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: meta
---

# Lexery - Source Registry

Machine- and human-readable **inventory of everything that has fed this wiki**. If a claim cannot point here (or to a child note), treat it as **opinion** until ingested.

This page is the **authoritative list of upstreams**: Git remotes, local clones, documentation trees, automation outputs under `raw/`, and **MCP-attached** systems (Supabase SQL, R2 object stores, CI workflows). When you add a new ingest path or connector, update the registry table first, then mirror artifacts into `LLM Wiki/raw/` or cite the MCP tool name so future sessions can reproduce the query.

**Sibling**: [[Lexery - Source Map]] (hierarchy + trust). **Chronology**: [[Lexery - Log]]. **Topology**: [[Lexery - Repo Constellation]].

## Registry table

| Source                                         | Type           | Path / URL                                                                          | Last Ingested | Status         |
| ---------------------------------------------- | -------------- | ----------------------------------------------------------------------------------- | ------------- | -------------- |
| Lexery monorepo                                | Git repo       | `__PATH_LEXERY_MONOREPO__`                                            | 2026-04-09    | Active         |
| Public beta repo                               | Git repo       | `__PATH_UA_LLM_BETA__`                          | 2026-04-09    | Historical     |
| Bridge repo                                    | Git repo       | `__PATH_UA_LLM_BETA_BRIDGE__`              | 2026-04-09    | Historical     |
| GitHub `lexeryAI/Lexery`                       | Remote         | `https://github.com/lexeryAI/Lexery`                                                | 2026-04-09    | Active         |
| GitHub `seredyuk2077/Ukrainan-Lawyer-LLM-BETA` | Remote         | `https://github.com/seredyuk2077/Ukrainan-Lawyer-LLM-BETA`                          | 2026-04-09    | Historical     |
| GitHub `seredyuk2077/Ukrainan-Lawyer-LLM`      | Remote         | `https://github.com/seredyuk2077/Ukrainan-Lawyer-LLM`                               | 2026-04-09    | Dormant        |
| Linear workspace                               | API            | Linear MCP                                                                          | 2026-04-09    | Active         |
| Codex session checkpoint                       | Local file     | `codex/SESSION_*_CHECKPOINT.md` (monorepo)                                          | 2026-04-09    | Session-scoped |
| Brain docs (~257 files)                        | Repo docs      | `apps/brain/docs/**`                                                                | 2026-04-09    | Active         |
| Root docs                                      | Repo docs      | `docs/**`                                                                           | 2026-04-09    | Active         |
| Supabase Legal Agent DB                        | MCP            | Cursor MCP `user-supabase-lexery-legal-agent-db`; `execute_sql` queries             | 2026-04-09    | Active         |
| Supabase Legislation RAG DB                    | MCP            | Cursor MCP `user-supabase-legislation RAG`; `execute_sql` queries                   | 2026-04-09    | Active         |
| Cloudflare R2 legislation bucket               | MCP            | Cursor MCP `user-cloudflare-r2-legislation`; **374 acts** as canonical JSON objects | 2026-04-09    | Active         |
| Cloudflare R2 lexery-legal-agent bucket        | MCP            | Cursor MCP `user-cloudflare-r2`; retrieval traces, MM docs                          | 2026-04-09    | Active         |
| GitHub Actions CI/CD                           | Workflow files | `.github/workflows/`; e.g. `lldbi-brain-admin.yml` (brain-admin automation)         | 2026-04-09    | Active         |

**MCP usage note**: Before calling any MCP tool, read the tool descriptor JSON under the Cursor `mcps/` folder for that server. SQL and object-store tools are **live**; treat query results as point-in-time unless also captured under `raw/codebase-snapshots/` or `raw/architecture-docs/`.

## Raw Sources Inventory

Frozen or semi-frozen **artifacts** live under `LLM Wiki/raw/`. They are not a substitute for Git `main`, but they make diffs, PR context, and dashboard stats **grepable inside the vault**.

### `raw/github-prs/`

- **10 PRs** exported as paired **JSON + Markdown** per PR (`pr-1` … `pr-10`), plus aggregate `all-prs.json`.
- Use for: review narrative, titles, bodies, and metadata without opening GitHub in-browser.

### `raw/github-commits/`

- **67 commits (30d window)** captured in recent-commit listings; companion files include **branch list** and **uncommitted diff** snapshot for the Lexery workspace.
- Use for: velocity, branch topology, and “what changed locally before commit” forensics.

### `raw/architecture-docs/`

- **4 primary docs**: `LEXERY_LEGAL_AI_AGENT_ARCHITECTURE.md`, `MEGA_DIAGRAM_FULL.md`, `README.md`, `CURRENT_PIPELINE_STATE.md`.
- Use for: long-form architecture and pipeline state when the wiki page should cite a **verbatim** upstream export.

### `raw/codebase-snapshots/`

- `brain-config.ts` — **634 lines** (vault snapshot); brain configuration surface for agents and flags.
- `test-inventory.txt` — **93 test paths** (one path per line) enumerated for brain/tools coverage mapping.
- **Supabase live stats** — dated markdown snapshot (e.g. `supabase-live-stats-2026-04-09.md`) plus optional schema dumps when generated.
- **Monorepo packages** — package/workspace listing export (e.g. `monorepo-packages-2026-04-09.md`, `root-package.json`).
- **Workflow files** — copy of selected GitHub Actions YAML (e.g. `workflow-lldbi-brain-admin.yml`) for offline diff against `.github/workflows/`.

Regenerate these paths via [[#Automation Scripts]] after meaningful repo or infra changes; log the run in [[Lexery - Log]].

## Automation Scripts

All runnable Node scripts live in `LLM Wiki/_system/scripts/`. Shell helpers `install-schedule.sh` and `uninstall-schedule.sh` exist for scheduling but are **not** counted in the twelve core `.mjs` tools below.

| Script | Role (short) |
|--------|----------------|
| `scan-codebase.mjs` | Walk the monorepo (respecting conventions) and emit snapshot-friendly extracts for the wiki. |
| `scan-supabase.mjs` | Query or document Supabase-facing stats/schema for `raw/codebase-snapshots/`. |
| `auto-fill.mjs` | Template and metadata passes to reduce manual wiki boilerplate. |
| `sync-git.mjs` | Local Git state sync (branches, diffs, commit lists) into `raw/github-commits/`. |
| `sync-github.mjs` | GitHub API or `gh`-backed export of PRs/issues into `raw/github-prs/`. |
| `sync-linear.mjs` | Linear issue/project sync hooks for roadmap notes (pairs with Linear MCP). |
| `generate-delta.mjs` | Compute deltas between wiki pages and fresh raw exports for review. |
| `update-log.mjs` | Append structured entries to [[Lexery - Log]] or log-shaped artifacts. |
| `ingest.mjs` | Orchestrate ingest steps from raw → vault pages (batch or scoped). |
| `suggest-links.mjs` | Propose wikilinks and backlink fixes from scan output. |
| `lint.mjs` | Validate frontmatter, broken links, or script invariants on wiki files. |
| `run-maintenance.mjs` | Single entrypoint to run the common maintenance chain in documented order. |

**Typical order** (adjust per task): `sync-git.mjs` / `sync-github.mjs` → `scan-codebase.mjs` / `scan-supabase.mjs` → `ingest.mjs` or `auto-fill.mjs` → `lint.mjs` → `update-log.mjs`. Use `run-maintenance.mjs` when the runbook matches your environment.

## Not yet ingested

These are **explicit gaps** — absence from the table is not evidence of non-existence.

| Kind | Examples | Why ingest |
|------|-----------|------------|
| Design | Figma, brand decks | UI truth vs shipped Portal |
| Comms | Telegram threads, email decisions | Informal ADRs |
| Qualitative | Customer interviews, support exports | Product–market fit signals |
| Quantitative | Analytics (Plausible, PostHog, etc.) | Traction and funnels |
| Ops | Deploy logs, Azure portal screenshots, Supabase dashboard | [[Lexery - Unknowns Queue]] items 1, 4 |

When any of the above lands in vault or `_system/`, add a row to the main table and note the ingest in [[Lexery - Log]].

## Trust & freshness rules

1. **Git `main` / active dev branch** > stale local-only branches for "what ships."
2. **`apps/brain/docs`** > generic memory for pipeline semantics.
3. **Linear** > wiki for issue state — but **code** wins on behavior (see [[Lexery - Drift Radar]]).
4. **Session checkpoints** are **handoff artifacts**; re-verify before architectural claims.
5. **MCP query results** are as fresh as the last invocation; prefer **re-running** `execute_sql` or R2 reads for production decisions, and **snapshot** outcomes into `raw/` when the wiki needs a durable citation.
6. **`raw/` exports** may lag `main` by one maintenance run — check file dates and [[Lexery - Log]] before treating a snapshot as current.

## Cross-links for common questions

- **Where did Brain architecture come from?** → Bridge repo + `apps/brain/docs/architecture` (see [[Lexery - Legacy Architecture Bridge]], [[Lexery - Brain Architecture]]).
- **What is public vs private?** → [[Lexery - Repo Constellation]], [[Lexery - GitHub History]].
- **What is planned vs shipped?** → [[Lexery - Linear Roadmap]] + code grep, not wiki alone.
- **Where are PR and commit receipts?** → [[#Raw Sources Inventory]] under `raw/github-prs/` and `raw/github-commits/`.

## Maintenance hooks

- **Daily**: note new commits per repo in [[Lexery - Log]] (see [[Lexery - Maintenance Runbook]]).
- **Monthly**: drop stale "Last Ingested" rows into a **refresh queue** or bump the date after deliberate re-read.
- **After MCP-heavy work**: if you relied on Supabase or R2 for a factual claim, consider a one-off `scan-supabase.mjs` or manual copy into `raw/codebase-snapshots/` so the vault stays self-contained.

## Ingest pipeline (conceptual)

```text
Primary repos (git) ──► diff / path filter ──► human or model summary ──► wiki page patch
        │                                              │
        └──────────────────────────────────────────────┴──► [[Lexery - Log]] (timestamped)

MCP (Supabase / R2) ──► execute_sql / object reads ──► optional raw snapshot ──► registry row + wiki cite
```

1. **Select scope**: never ingest entire `node_modules` or build artifacts — mirror `.gitignore` and repo conventions.
2. **Prefer paths**: `apps/brain/docs/architecture/app/`, `codex/*.md`, `docs/`, `.github/workflows/` for operational truth.
3. **De-dupe**: if the same fact appears in Linear and an ADR, **link both** but **state one canonical sentence** on the architecture page.
4. **Personal vs org**: local paths in this registry are **Andriy's machine**; teammates should clone and update paths or use remote URLs only in shared copies.
5. **Raw folder hygiene**: name snapshots with **ISO dates** where multiple revisions are expected (`*-2026-04-09.md`).

## Conflict resolution

| Situation | Rule |
|-----------|------|
| Wiki vs `main` code | **Code wins**; wiki follows in the same maintenance cycle |
| Wiki vs old Linear comment | **Recent code + doc** beats stale ticket text |
| Two wiki pages disagree | Merge into one **canonical** page; leave the other as a short pointer |
| Wiki vs MCP snapshot | **Live MCP or Git** beats an old `raw/` file; refresh the export or bump the date |

## Links

- [[Lexery - Source Map]]
- [[Lexery - Index]]
- [[Lexery - Log]]
- [[Lexery - Repo Constellation]]
- [[Lexery - Unknowns Queue]] — turns missing sources into answerable work.
