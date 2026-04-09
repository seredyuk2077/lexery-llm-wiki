---
aliases: [Who Built What, Contributions]
tags: [lexery, team, synthesis]
status: active
layer: team
created: 2026-04-09
updated: 2026-04-09
sources: 3
---

> [!info] Compiled from
> - `raw/github-prs/all-prs.json`
> - `raw/github-commits/commits-recent.txt`
> - [[Lexery - Team and Operating Model]]

# Lexery - Who Built What

Повна карта контрибуцій у Lexery. Три контрибутори з різними зонами — Brain (Андрій), Backend/Infra (Єгор), Frontend (Саша). Жодного перетину зон немає — чіткий ownership.

## Contribution Map

### Андрій Середюк (@lexeryAI / solo on `legal-agent-brain-dev`)

| Domain | What | Scale | Config/Evidence |
|--------|------|-------|-----------------|
| Brain Pipeline | U1-U12 повний runtime, від Gateway до Deliver | 67 commits (30d) | `apps/brain/` — sole author |
| Retrieval (U4) | Qdrant, multi-goal fusion, query rewrite, RRF, act planner, routing hints | Core subsystem | 28 test files у `tools/u4/` |
| ORCH | Bounded orchestrator, clarification resume, recovery reruns | April focus | `apps/brain/orchestrator/` |
| Memory Manager | MM outbox, extraction, semantic search, summaries | Full ownership | `mm_memory_items` (3,565 items live) |
| MM Docs | Document chunking, vision/OCR, ingest pipeline, scope isolation | Full ownership | `mm_doc_records` (679 docs) |
| LLDBI | Brain-admin, import proposals, legislation management | Full ownership | 374 acts indexed |
| Architecture | 100+ architecture docs, decision logs, mega diagrams | Sole author | `apps/brain/docs/architecture/` |
| Quality | 94 test files — units, verify, stress, smoke | Continuous | `apps/brain/tools/` |
| Config | 635-line config.ts — every stage tunable via env | Active tuning | `apps/brain/lib/config.ts` |

> [!note] Андрій — єдиний контрибутор на `legal-agent-brain-dev` branch. Всі 67 commits за останні 30 днів — його. Brain pipeline, retrieval, memory, LLDBI, ORCH — 100% ownership.

### Єгор Пухач (@puhachyeser)

| PR | What | Date | LEX | Impact |
|----|------|------|-----|--------|
| #1 | Monorepo migration — frontend config for monorepo infra | Mar 29 | — | Foundation: unified build system |
| #2 | Storage controller/service with presigned URLs | Mar 30 | LEX-201 | Enabled file uploads for MM Docs |
| #3 | User schema + auth service for new auth data | Apr 2 | — | Auth foundation |
| #5 | **Shared contracts** — Zod schemas + types | Apr 3 | LEX-198 | Key convergence: typed brain↔backend boundary |
| #6 | Fix doclist script names to prevent `pnpm dev` errors | Apr 4 | — | DX fix |
| #8 | Auth refactor | Apr 6 | — | Clean auth layer |
| #9 | Auth infrastructure for email/sms/oauth (OPEN) | Apr 7 | — | Multi-method registration |

**Патерн:** foundational-first — монорепо → storage → auth → shared контракти. Найвищий PR volume (7 з 10). Єгор будує infrastructure layer на який потім накладаються Brain і Frontend.

### Олександр (@alexbach093)

| PR | What | Date | Impact |
|----|------|------|--------|
| #4 | System prompt editor redesign | Apr 2 | UX: custom system prompts per project |
| #7 | Auth pages (frontend) | Apr 4 | Complete auth UI flow |
| #10 | **Subscription plans** (frontend) | Apr 8 | Business: plan selection UI |

**Патерн:** frontend-focused — UI компоненти, auth flow, subscription plans. Кожен PR = видимий user-facing feature.

## Ownership Distribution

```
Brain Pipeline  ████████████████████  100% Андрій
Retrieval/LLDBI ████████████████████  100% Андрій
Memory Manager  ████████████████████  100% Андрій
ORCH/Recovery   ████████████████████  100% Андрій
Backend API     ██████████████░░░░░░   70% Єгор / 30% setup by Андрій
Shared Contracts████████████████████  100% Єгор
Frontend UI     ████████████░░░░░░░░   60% Саша / 40% Єгор
Auth Layer      ██████████████░░░░░░   70% Єгор / 30% Саша
Infrastructure  ████████████████░░░░   80% Андрій / 20% Єгор
Architecture    ████████████████████  100% Андрій (all 100+ docs)
Tests           ████████████████████  100% Андрій (94 test files)
```

## PR Timeline (all 10 PRs to date)

```
Mar 29 ── Єгор: monorepo migration (#1) ⟵ FOUNDATION
Mar 30 ── Єгор: storage/presigned URLs (#2, LEX-201)
Apr  2 ── Єгор: auth service (#3) | Саша: prompt editor (#4)
Apr  3 ── Єгор: shared contracts (#5, LEX-198) ⟵ KEY CONTRACT
Apr  4 ── Єгор: doclist fix (#6) | Саша: auth pages (#7)
Apr  5 ── Merged: auth pages
Apr  6 ── Єгор: auth refactor (#8)
Apr  7 ── Єгор: auth infra (#9, OPEN)
Apr  8 ── Саша: subscription plans (#10, MERGED)
Apr  9 ── Андрій: bounded recovery, corpus-gap, verification
```

## Commit Velocity (30 days)

| Contributor | Commits | Focus |
|-------------|---------|-------|
| Андрій | 67 | Brain pipeline, retrieval, ORCH, MM, tests |
| Єгор | ~15 (via PRs) | Backend infra, auth, contracts |
| Саша | ~8 (via PRs) | Frontend UI, auth pages, plans |

Андрій commits напряму на `legal-agent-brain-dev`; Єгор і Саша працюють через PR flow на `dev`.

## Cross-Team Dependencies

```
Єгор (contracts, auth) ──→ Андрій (Brain consumes contracts)
Єгор (storage URLs)    ──→ Андрій (MM Docs uses presigned URLs)
Андрій (Brain API)     ──→ Саша (Portal calls Brain endpoints)
Андрій (run schema)    ──→ Єгор (Backend persists runs)
```

## See Also

- [[Lexery - Team and Operating Model]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]
- [[Lexery - PR Chronology]]
- [[Lexery - GitHub History]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - Pipeline Health Dashboard]]
- [[Lexery - Linear Roadmap]]
