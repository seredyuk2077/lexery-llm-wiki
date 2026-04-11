# Lexery Second Brain — Wiki Schema

> This file tells any LLM agent how to maintain and extend this knowledge base.
> Based on the LLM Wiki pattern (Karpathy, April 2026).

## Architecture

Three layers:

1. **Raw sources** (`raw/`) — Immutable source documents. Articles, PRs, commits, architecture docs, DB snapshots, Telegram excerpts. The agent reads from these but NEVER modifies them.
2. **The wiki** (root `Lexery - *.md` files) — Agent-maintained, interlinked markdown pages. Summaries, entity pages, concept pages, comparisons. The agent owns this layer.
3. **This schema** (`AGENTS.md`) — Conventions, workflows, and structure. Co-evolved by human and agent.

## Directory Structure

```
Lexery/
├── AGENTS.md              ← this file (schema)
├── Lexery - Index.md      ← content catalog (every page listed)
├── Lexery - Log.md        ← chronological append-only log
├── Lexery - Project Brain.md  ← landing page / hub
├── Lexery - *.md          ← wiki pages (69+)
├── Lexery - *.canvas      ← visual maps (7)
├── raw/                   ← immutable raw sources
│   ├── github-prs/        ← PR data (JSON + markdown)
│   ├── github-commits/    ← commit history exports
│   ├── architecture-docs/ ← snapshots from apps/brain/docs/
│   ├── codebase-snapshots/← config, package.json, etc.
│   ├── linear/            ← Linear tickets (when available)
│   ├── telegram/          ← conversation excerpts
│   └── misc/              ← other sources
├── _assets/brand/         ← logo files
├── _system/
│   ├── scripts/           ← automation (.mjs files)
│   ├── state/             ← sync state (repos.json, prs.json, etc.)
│   └── logs/              ← generated reports
└── _templates/            ← page templates
```

## Page Conventions

### Frontmatter (required on every page)

```yaml
---
aliases: [Short Name, Alternate Name]
tags: [lexery, <category>]
status: observed | active | archived | speculative
layer: product | brain | data | history | team | meta | governance
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: <number of raw sources this page draws from>
---
```

### Naming
- All wiki pages: `Lexery - <Title>.md`
- Canvas files: `Lexery - <Title>.canvas`
- Use Title Case for page names

### Content Structure
- Ukrainian for non-technical descriptive text
- English for technical terms, code references, variable names
- Wikilinks `[[Lexery - Page Name]]` for all internal references
- `## See Also` section at bottom of every page

### Quality Bar
- Every page must have 20+ lines of substantive content (excluding frontmatter, headings, See Also)
- No orphan pages (every page must be linked from at least one other page)
- No broken wikilinks

## Operations

### Ingest
When adding a new raw source:
1. Drop the file into `raw/<category>/`
2. Read the source fully
3. Identify which existing wiki pages it affects
4. Update those pages with new information, citing the source
5. Create new pages if the source introduces entities/concepts not yet covered
6. Update `Lexery - Index.md` with any new pages
7. Append entry to `Lexery - Log.md`: `## [YYYY-MM-DD] ingest | <source description>`
8. Run `suggest-links.mjs` to find new cross-references

### Query
When answering questions:
1. Read `Lexery - Index.md` to find relevant pages
2. Read those pages
3. Synthesize answer with `[[wikilinks]]` citations
4. If the answer is substantial, file it as a new wiki page

### Lint
Periodic health check (run via `lint.mjs` or manually):
- Orphan pages (no inbound links)
- Broken wikilinks (target page doesn't exist)
- Thin pages (< 20 content lines)
- Stale data (page `updated` date > 30 days old)
- Missing frontmatter fields
- Contradictions between pages

## Automation

Scripts in `_system/scripts/` (Node.js, run via `node <script>.mjs`):
- `run-maintenance.mjs` — orchestrator: runs all scripts in sequence
- `sync-git.mjs` — pull latest commits from tracked repos
- `sync-github.mjs` — pull PRs and issues
- `generate-delta.mjs` — AI-generated summary of changes
- `update-log.mjs` — append changes to Log
- `suggest-links.mjs` — heuristic link suggestions
- `sync-linear.mjs` — pull Linear data (when API available)
- `lint.mjs` — wiki health check (see Lint operation)
- `ingest.mjs` — process new raw sources into wiki

Scheduling: `launchd` runs `run-maintenance.mjs` daily at 08:00 via `com.lexery.wiki-maintenance`.

## Key Pages

| Page | Role |
|------|------|
| Project Brain | Landing hub, branded navigation |
| Index | Content catalog with summaries |
| Log | Chronological event record |
| Brain Architecture | Technical architecture of the pipeline |
| U1-U12 Runtime | Full pipeline stage reference |
| Andrii Serediuk | Founder profile + agent operating manual |
| Team and Operating Model | Team structure and dynamics |
| Glossary | Term definitions |

## Source Repositories

| Repo | Path | What |
|------|------|------|
| Lexery monorepo | your local clone path (never commit) | Main codebase |

## Databases

| Name | Type | Key Tables |
|------|------|------------|
| Lexery Legal Agent DB | Supabase | tenants (242), chat_sessions (928), runs (26,661), messages (7,224), mm_memory_items (3,553), mm_outbox (3,564), mm_doc_records (679) |
| Legislation RAG | Supabase | legislation_documents (374), legislation_import_jobs (966) |

## Notes for Agents

- The wiki is the "compiled" layer. Raw sources are the ground truth.
- Prefer updating existing pages over creating new ones.
- When in doubt, add a wikilink — denser graphs are better.
- Ukrainian for human-readable prose, English for technical terms.
- The founder (Andrii) wants this wiki to eventually enable an agent to respond and make decisions on his behalf. Behavioral profiling is critical.
