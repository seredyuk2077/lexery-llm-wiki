---
aliases: [Automation, Self-Maintenance]
tags: [lexery, meta, automation]
created: 2026-04-09
updated: 2026-04-09
status: implemented
layer: meta
---

# Lexery - Automation Architecture

Повністю автономна система підтримки wiki. Працює у фоні через `launchd`, сканує репозиторій, GitHub, Supabase, і автоматично оновлює raw sources та wiki pages без людського втручання.

## Design Principles

- **Delta-first:** сканує тільки нові зміни, ніколи не перечитує все.
- **Tiered AI:** логіка → cheap model (`gpt-4o-mini`) → premium model (`gpt-5.2`).
- **State-tracked:** кожен оброблений коміт, PR, issue має hash або cursor у state store.
- **Conservative:** ніколи не видаляє вручну створений контент; тільки додає або оновлює.
- **Pure Node.js:** автоматизація на JavaScript (`.mjs`), без `jq`, без Python, без зовнішніх залежностей.
- **Graceful degradation:** відсутній API key → skip step, не hard fail всього циклу.

## Complete Pipeline (11 steps)

```
scan-codebase.mjs   ─── Repo scan: commits, branches, PRs, config, tests, workflows
     ↓
sync-git.mjs        ─── Track commit SHAs across repos
     ↓
sync-github.mjs     ─── Pull PRs via `gh` CLI
     ↓
sync-linear.mjs     ─── Pull Linear issues (if LINEAR_API_KEY set)
     ↓
scan-supabase.mjs   ─── Write Supabase refresh request for interactive sessions
     ↓
generate-delta.mjs  ─── Bundle daily changes, optional LLM summary
     ↓
update-log.mjs      ─── Prepend delta into Lexery - Log.md
     ↓
ingest.mjs          ─── Process new raw/ files, update ingested.json state
     ↓
auto-fill.mjs       ─── Update wiki pages from raw data (PRs, commits, Linear refs)
     ↓
suggest-links.mjs   ─── Heuristic link suggestions (tags, layers, title mentions)
     ↓
lint.mjs            ─── Health check: broken links, orphans, thin pages, stale data
```

Orchestrated by `run-maintenance.mjs` — runs all steps in order, writes maintenance log.

## Scripts (`_system/scripts/`)

| # | Script | Role | Input | Output | Status |
|---|--------|------|-------|--------|--------|
| 1 | `scan-codebase.mjs` | Scan Lexery monorepo: 67 commits (30d), 10 PRs, 94 test files, config, workflows, arch docs | Git repo + `gh` CLI | `raw/github-prs/`, `raw/github-commits/`, `raw/codebase-snapshots/`, `raw/architecture-docs/` | **implemented** |
| 2 | `sync-git.mjs` | Track repos, write git digest, update SHAs | `state/repos.json` | `logs/git-digest-*.md` | **implemented** |
| 3 | `sync-github.mjs` | List PRs via `gh`, write github digest | `state/prs.json` | `logs/github-digest-*.md` | **implemented** |
| 4 | `sync-linear.mjs` | Pull issues via Linear GraphQL | `LINEAR_API_KEY` | `logs/linear-digest-*.md` | **implemented** (optional) |
| 5 | `scan-supabase.mjs` | Write refresh request for MCP-based queries | — | `raw/codebase-snapshots/supabase-refresh-request-*.md` | **implemented** |
| 6 | `generate-delta.mjs` | Bundle digests, optional LLM summary, append `cost.json` | `OPENROUTER_API_KEY` | `logs/delta-summary-*.md` | **implemented** |
| 7 | `update-log.mjs` | Prepend latest delta into main Log | `logs/delta-summary-*.md` | `Lexery - Log.md` | **implemented** |
| 8 | `ingest.mjs` | Process new raw/ files, track in ingested.json | `raw/**/*` | `state/ingested.json` | **implemented** |
| 9 | `auto-fill.mjs` | Update wiki pages from raw data: PR table, commit velocity, Linear refs | `raw/github-prs/`, `raw/github-commits/` | Wiki pages | **implemented** |
| 10 | `suggest-links.mjs` | Heuristic cross-link suggestions | All wiki pages | `logs/link-suggestions-*.md` | **implemented** |
| 11 | `lint.mjs` | Health check: orphans, broken links, thin, stale, missing frontmatter | All wiki pages | `logs/lint-report-*.md` | **implemented** |
| — | `run-maintenance.mjs` | Orchestrator: runs all 11 steps in order | — | `logs/maintenance-*.md` | **implemented** |

## State Store (`_system/state/`)

| File | Purpose | Updated By |
|------|---------|------------|
| `repos.json` | Tracked repos with last-processed commit SHA | `sync-git.mjs` |
| `prs.json` | Per-remote `last_processed_pr` cursor | `sync-github.mjs` |
| `issues.json` | Linear cursor + recent snapshot | `sync-linear.mjs` |
| `ingested.json` | All ingested raw source files with timestamps | `ingest.mjs` |
| `cost.json` | Running AI cost totals | `generate-delta.mjs` |

## Raw Sources Layer (`raw/`)

Karpathy Layer 1 — immutable source documents:

| Directory | Contents | Count |
|-----------|----------|-------|
| `raw/github-prs/` | PR JSON + markdown for each PR | 21 files (10 PRs × 2 + all-prs.json) |
| `raw/github-commits/` | Recent commits, branches, uncommitted diff | 5 files |
| `raw/architecture-docs/` | LEXERY_LEGAL_AI_AGENT_ARCHITECTURE.md, MEGA_DIAGRAM_FULL.md, README.md, CURRENT_PIPELINE_STATE.md | 5 files |
| `raw/codebase-snapshots/` | brain-config.ts, test-inventory.txt, supabase stats, monorepo packages, workflow files | 8+ files |
| `raw/linear/` | Linear references extracted from PRs | 1 file |

## Scheduling (launchd)

**Plist:** `_system/com.lexery.wiki-maintenance.plist`

```
Schedule:    Daily at 08:00
Node:        /usr/local/bin/node (v22.20.0)
Script:      _system/scripts/run-maintenance.mjs
Stdout:      _system/logs/launchd-stdout.log
Stderr:      _system/logs/launchd-stderr.log
Env:         PATH, OPENROUTER_API_KEY
```

**Install:** `bash _system/scripts/install-schedule.sh`
**Uninstall:** `bash _system/scripts/uninstall-schedule.sh`
**Verify:** `launchctl list | grep lexery` → should show `com.lexery.wiki-maintenance`

Resource usage: <1 minute execution, <50 MB RAM, runs once daily. Практично непомітне навантаження.

## Latest Run Results (2026-04-09)

| Step | Result |
|------|--------|
| scan-codebase | 67 commits, 10 PRs, 94 tests, 4 arch docs |
| sync-git | Digest written |
| sync-github | Digest written |
| sync-linear | Skipped (no key) |
| scan-supabase | Refresh request written |
| generate-delta | Delta written (no LLM — key not in env) |
| update-log | Log updated |
| ingest | 33 raw sources ingested |
| auto-fill | PRs updated, 67 commits processed, Linear refs: LEX-201, LEX-198 |
| suggest-links | Suggestions written |
| lint | **0 errors, 0 warnings, 0 info** |

## Karpathy Alignment

Ця система реалізує три операції з [Karpathy LLM Wiki architecture](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f):

| Operation | Implementation |
|-----------|---------------|
| **Ingest** | `scan-codebase.mjs` + `ingest.mjs` — pull from sources, store in `raw/`, track state |
| **Query** | Wiki pages compile and synthesize raw sources; agents read wiki for answers |
| **Lint** | `lint.mjs` — health check with orphan detection, broken links, thin pages, stale data |

Три шари:
1. **Raw sources** (`raw/`) — immutable source documents
2. **Wiki** (Lexery - *.md) — compiled, synthesized, interlinked pages
3. **Schema** (`AGENTS.md`) — conventions, structure, operations manual for agents

## Interactive Session Augmentation

Автономна система збирає "cold" дані (git, GitHub, raw files). Для "hot" даних (Supabase live stats, legislation schema) використовуються MCP tools під час інтерактивних сесій:

| MCP Server | Data | Usage |
|------------|------|-------|
| `user-supabase-lexery-legal-agent-db` | `execute_sql` — runs, sessions, memory, outbox | Live stats for Dashboard, Current State |
| `user-supabase-legislation RAG` | `execute_sql` — legislation docs, qdrant status | Live stats for Corpus Evolution |
| `user-cloudflare-r2` | R2 file listing | Supreme Court case law inventory |
| `user-cloudflare-r2-legislation` | R2 file listing | Legislation canonical JSON inventory |

## See Also

- [[Lexery - Maintenance Runbook]]
- [[Lexery - Cost Ledger]]
- [[Lexery - Source Registry]]
- [[Lexery - Drift Radar]]
- [[Lexery - Log]]
- [[Lexery - Index]]
- [[Lexery - Provider Topology]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Contributing]]
- [[Lexery - Unknowns Queue]]
- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - Technology Stack]]
