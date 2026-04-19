---
aliases:
  - Timeline
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: history
---

> [!info] Compiled from
> - Automated wiki maintenance + repository sources
> - See [[Lexery - Source Map]] for trust model

# Lexery - Timeline

## High-Level Read

Найточніше читати історію Lexery не як “один продукт”, а як **ланцюг із трьох форм**:

- `Phase 1`:
  consumer-facing Ukrainian legal assistant.
- `Phase 2`:
  legal data / legislation / architecture deepening.
- `Phase 3`:
  monorepo split between product shell and dedicated legal brain.

## Timeline

### 2025-09-26 — earliest repo layer

- Створені ранні репозиторії `Ukrainan-Lawyer-LLM` і `Ukrainan-Lawyer-LLM-BETA`.
- У публічному beta repo з’являється ранній React/Supabase/GPT-4 legal assistant.
- Ранні коміти:
  `Initial commit`, `Ukrainian Lawyer AI Legal Assistant`, `initial push`.

### 2025-09-30 to 2025-10-03 — UX-first beta

- Legacy bridge repo показує ранні UI-centric commits:
  `New Design Version 3`, `Major UI improvements`, `rada gov UA API + data base upd`, `legal database management system`.
- Ідея починає рухатися від просто “чату” до legal-data-backed продукту.

### 2025-11-24 to 2025-12-29 — architecture awakening

- Коміт `feat: refresh legal agent architecture`.
- З’являються Supreme Court RAG і серйозні infra discussions.
- Наприкінці грудня формується більш системний legislation напрям:
  open data portal index, repository cleanup, infra updates.

### 2026-01 — legislation / DocList / corpus hardening

- Сильний сплеск роботи по `scripts/legislation`.
- DocListDB, Qdrant sync, validation phases, collector/import loops, audit gates.
- Багато fix-циклів навколо `document_type`, canonicalization, health-reduction, soak/batch import.
- Це той місяць, коли Lexery перестає бути лише interface+prompt продуктом і стає **corpus engineering project**.

### 2026-02-04 to 2026-02-08 — Brain architecture crystallization

- `2026-02-04`:
  legislation infra packaged as standalone prod microservice.
- `2026-02-06`:
  `feat(architecture): Lexery Legal AI Agent — повна архітектурна документація`
- Далі very fast sequence:
  `[[Lexery - U1 Gateway|U1 Gateway]]`, `U2 classify`, `U3 plan`, `U4 CacheRAG`, `U5 Gate`, architecture docs, verifiers, tools.
- До `2026-02-08` вже видно явну форму `U1 → U12`.

### 2026-02 — Linear formalization

- У Linear створюється проект `Agent Architecture`.
- Закривається епік `LEX-31`.
- Появляються issues на контракти, state machine, EvidencePack, failure modes, memory, billing, Azure.
- Тут ідея переходить із “великих планів” у explicit execution graph.

### 2026-03 — implementation and stabilization wave

- Проект `Lexery Legal Agent Dev` продовжує вже не docs, а реальну імплементацію.
- З’являються `U9/U10`, memory/outbox, stabilization, reliability tracks.
- У Parallel формується monorepo/backend/frontend direction.

### 2026-03-13 — current private monorepo exists on GitHub

- `lexeryAI/Lexery` створено як private repo.

### 2026-03-26 to 2026-03-30 — current monorepo foundation

- Basic application skeleton.
- Backend foundation.
- Migration of legal-agent scripts and docs into `apps/brain`.
- Frontend migration into monorepo.
- Auth and storage groundwork in `apps/api`.

### 2026-04-02 to 2026-04-07 — retrieval hardening sprint

- Brain commits концентруються на multi-goal retrieval, coverage semantics, honesty under cache misses, explicit act recovery.
- Це phase of legal precision tuning.

### 2026-04-08 to 2026-04-09 — bounded agentivity sprint

- `bounded legal orchestrator`
- `DocList recovery`
- `brain-admin proposal queue`
- `ORCH telemetry`
- `clarification resume`
- `deterministic ORCH cost cut`

### 2026-04-09 — current observed snapshot

- Current branch:
  `legal-agent-brain-dev`
- Local worktree:
  dirty, mostly `apps/brain`
- Divergence against `origin/dev`:
  `21` remote-only commits vs `26` local-only commits
- Divergence against `origin/legal-agent-brain-dev`:
  local ahead by `10`

## Interpretation

- `Observed`:
  Lexery did not evolve linearly.
- `Inferred`:
  the product repeatedly re-centered itself around the “real bottleneck” of the moment:
  first UX, then legislation data, then architecture, then bounded runtime, then monorepo/product shell.
- `Inferred`:
  the bridge repo from `New project/Ukrainan-Lawyer-LLM-BETA` is the most important historical missing link, because it holds the transition from product demo to legal systems engineering.

## See Also

- [[Lexery - Idea Evolution]]
- [[Lexery - Legacy Beta App]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Current State]]
