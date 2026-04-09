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
> - `raw/github-commits/commits-2026.txt`
> - [[Lexery - Team and Operating Model]]

# Lexery - Who Built What

## Contribution Map

### Андрій Середюк (@lexeryAI / solo committer on `legal-agent-brain-dev`)

| Domain | What | Scale |
|--------|------|-------|
| Brain Pipeline | U1-U12 повний runtime, від Gateway до Deliver | ~50+ commits |
| Retrieval (U4) | Qdrant integration, multi-goal fusion, query rewrite, RRF | Core system |
| ORCH | Bounded orchestrator, clarification resume, recovery reruns | Recent focus |
| Memory Manager | MM outbox, memory extraction, semantic search | Full ownership |
| MM Docs | Document chunking, vision/OCR, ingest pipeline | Full ownership |
| LLDBI | Brain-admin, import proposals, legislation management | Full ownership |
| Architecture | 100+ architecture docs, decision logs, mega diagrams | Sole author |
| Quality | 61 test files, stress tests, verification harnesses | Continuous |

> [!note] Андрій — єдиний контрибутор на `legal-agent-brain-dev` branch. Всі 66 commits у 2026 — його.

### Єгор Пухач (@puhachyeser)

| PR | What | Date |
|----|------|------|
| #1 | Monorepo migration — frontend config for monorepo infra | Mar 29 |
| #2 | Storage controller/service with presigned URLs (LEX-201) | Mar 30 |
| #3 | User schema + auth service for new auth data | Apr 2 |
| #5 | Shared contracts — Zod schemas + types (LEX-198) | Apr 3 |
| #6 | Fix doclist script names to prevent `pnpm dev` errors | Apr 4 |
| #8 | Auth refactor | Apr 6 |
| #9 | Auth infrastructure for email/sms/oauth (OPEN) | Apr 7 |

**Патерн:** foundational-first — монорепо → storage → auth → shared контракти. Найвищий PR volume (7 з 10).

### Олександр (@alexbach093)

| PR | What | Date |
|----|------|------|
| #4 | System prompt editor redesign | Apr 2 |
| #7 | Auth pages (frontend) | Apr 4 |
| #10 | Subscription plans (frontend) | Apr 8 |

**Патерн:** frontend-focused — UI компоненти, auth flow, subscription plans.

## Ownership Distribution

```
Brain Pipeline  ████████████████████  100% Андрій
Backend API     ██████████████░░░░░░   70% Єгор / 30% Андрій  
Frontend        ████████████░░░░░░░░   60% Саша / 40% Єгор
LLDBI/DocList   ████████████████████  100% Андрій
Infrastructure  ████████████████░░░░   80% Андрій / 20% Єгор
```

## Timeline

```
Mar 29 ── Єгор: monorepo migration (#1)
Mar 30 ── Єгор: storage/presigned URLs (#2)
Mar 31 ── Андрій: 3+ commits (brain hardening)
Apr  2 ── Єгор: auth service (#3) | Саша: prompt editor (#4) | Андрій: 3+ commits
Apr  3 ── Єгор: shared contracts (#5) | Андрій: multi-goal retrieval
Apr  4 ── Єгор: doclist fix (#6) | Саша: auth pages (#7) | Андрій: bundle policies
Apr  5 ── Саша: auth pages merged
Apr  6 ── Єгор: auth refactor (#8)
Apr  7 ── Єгор: auth infra (#9) | Андрій: 353 TS errors fix
Apr  8 ── Саша: subscription plans (#10) | Андрій: ORCH + DocList recovery
Apr  9 ── Андрій: bounded recovery, corpus-gap, verification
```

## See Also

- [[Lexery - Team and Operating Model]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]
- [[Lexery - PR Chronology]]
- [[Lexery - GitHub History]]
