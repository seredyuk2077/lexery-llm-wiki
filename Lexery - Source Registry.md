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

**Sibling**: [[Lexery - Source Map]] (hierarchy + trust). **Chronology**: [[Lexery - Log]]. **Topology**: [[Lexery - Repo Constellation]].

## Registry table

| Source | Type | Path / URL | Last Ingested | Status |
|--------|------|------------|---------------|--------|
| Lexery monorepo | Git repo | `__PATH_LEXERY_MONOREPO__` | 2026-04-09 | Active |
| Public beta repo | Git repo | `__PATH_UA_LLM_BETA__` | 2026-04-09 | Historical |
| Bridge repo | Git repo | `__PATH_UA_LLM_BETA_BRIDGE__` | 2026-04-09 | Historical |
| GitHub `lexeryAI/Lexery` | Remote | `https://github.com/lexeryAI/Lexery` | 2026-04-09 | Active |
| GitHub `seredyuk2077/Ukrainan-Lawyer-LLM-BETA` | Remote | `https://github.com/seredyuk2077/Ukrainan-Lawyer-LLM-BETA` | 2026-04-09 | Historical |
| GitHub `seredyuk2077/Ukrainan-Lawyer-LLM` | Remote | `https://github.com/seredyuk2077/Ukrainan-Lawyer-LLM` | 2026-04-09 | Dormant |
| Linear workspace | API | Linear MCP | 2026-04-09 | Active |
| Codex session checkpoint | Local file | `codex/SESSION_*_CHECKPOINT.md` (monorepo) | 2026-04-09 | Session-scoped |
| Brain docs (~257 files) | Repo docs | `apps/brain/docs/**` | 2026-04-09 | Active |
| Root docs | Repo docs | `docs/**` | 2026-04-09 | Active |

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

## Cross-links for common questions

- **Where did Brain architecture come from?** → Bridge repo + `apps/brain/docs/architecture` (see [[Lexery - Legacy Architecture Bridge]], [[Lexery - Brain Architecture]]).
- **What is public vs private?** → [[Lexery - Repo Constellation]], [[Lexery - GitHub History]].
- **What is planned vs shipped?** → [[Lexery - Linear Roadmap]] + code grep, not wiki alone.

## Maintenance hooks

- **Daily**: note new commits per repo in [[Lexery - Log]] (see [[Lexery - Maintenance Runbook]]).
- **Monthly**: drop stale "Last Ingested" rows into a **refresh queue** or bump the date after deliberate re-read.

## Ingest pipeline (conceptual)

```text
Primary repos (git) ──► diff / path filter ──► human or model summary ──► wiki page patch
        │                                              │
        └──────────────────────────────────────────────┴──► [[Lexery - Log]] (timestamped)
```

1. **Select scope**: never ingest entire `node_modules` or build artifacts — mirror `.gitignore` and repo conventions.
2. **Prefer paths**: `apps/brain/docs/architecture/app/`, `codex/*.md`, `docs/`, `.github/workflows/` for operational truth.
3. **De-dupe**: if the same fact appears in Linear and an ADR, **link both** but **state one canonical sentence** on the architecture page.
4. **Personal vs org**: local paths in this registry are **Andriy's machine**; teammates should clone and update paths or use remote URLs only in shared copies.

## Conflict resolution

| Situation | Rule |
|-----------|------|
| Wiki vs `main` code | **Code wins**; wiki follows in the same maintenance cycle |
| Wiki vs old Linear comment | **Recent code + doc** beats stale ticket text |
| Two wiki pages disagree | Merge into one **canonical** page; leave the other as a short pointer |

## Links

- [[Lexery - Source Map]]
- [[Lexery - Index]]
- [[Lexery - Log]]
- [[Lexery - Repo Constellation]]
- [[Lexery - Unknowns Queue]] — turns missing sources into answerable work.
