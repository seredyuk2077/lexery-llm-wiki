---
aliases:
  - Cost Ledger
  - Cost
  - AI Budget
tags:
  - lexery
  - meta
created: 2026-04-09
updated: 2026-04-09
status: planned
layer: meta
---

# Lexery - Cost Ledger

Tracks **estimated and actual** spend for **wiki maintenance and automation** — separate from product Brain inference costs (Portal user traffic, batch jobs, etc.). Pair with [[Lexery - Maintenance Runbook]] for when each tier runs.

**Provider context**: [[Lexery - Provider Topology]]. **Design for automation**: [[Lexery - Automation Architecture]].

## Budget envelope

- **Target**: ~**$2/month** ongoing for *second-brain* maintenance (Tier 1–2 dominant, Tier 3 occasional).
- **Spike allowance**: one-time **build** or **large restructure** months may exceed the envelope; mark rows clearly as **non-recurring**.

> **Note**: Early "initial wiki" rows below may exceed the monthly target by design. Normalize future months toward the envelope via delta-first Tier 2.

---

## Cost model (maintenance only)

| Tier | Use case | Typical tooling | Est. cost / run |
|------|----------|-----------------|-----------------|
| **Tier 1** | Git diff, file hashing, metadata, branch lists | None (local CLI) | **$0** |
| **Tier 2** | Commit digests, PR/issue rollups, short delta summaries | Cheap model via OpenRouter | **~$0.001–0.01** |
| **Tier 3** | Wiki restructuring, merging contradictory pages, net-new canonical docs | Claude Opus-class or equivalent | **~$0.10–0.50** / substantial session |

**Token discipline**

- Pass **diffs and summaries**, not whole repos, into Tier 2–3.
- Cache **file hashes** in `_system/state/` to skip unchanged large files (see [[Lexery - Maintenance Runbook]]).

---

## OpenRouter Model Costs (Product Pipeline)

Хоча ця сторінка фокусується на wiki maintenance, розуміння product pipeline costs важливе для загальної cost awareness. Всі model calls проходять через [[Lexery - Provider Topology|OpenRouter]]:

### Per-Model Cost Profile

| Model | Pipeline Role | Relative Cost | Типовий Use Case |
|-------|--------------|---------------|------------------|
| **`gpt-5.2`** | Premium / legal reasoning | $$$ | [[Lexery - ORCH and Clarification|ORCH]] decisions, [[Lexery - U8 Legal Reasoning|U8]], [[Lexery - U10 Writer|U10]] — кожен run з повним reasoning cycle коштує найбільше |
| **`gpt-4o-mini`** | Classification | $ | [[Lexery - U2 Query Profiling|U2 classification]], intent detection, metadata extraction — швидкі cheap calls |
| **`gpt-5-nano`** | Routine | ¢ | Delta summaries, [[Lexery - Memory and Documents|memory]] operations, formatting — мінімальна вартість per call |

### Daily Cost Drivers

Основні джерела витрат у product pipeline (від найбільших до найменших):

1. **[[Lexery - U10 Writer|U10 Write]]** ($$$) — найдорожчий stage: довгий structured output з legal reasoning, citations, formatting. Кожен write call використовує `gpt-5.2` з extended context window
2. **[[Lexery - U8 Legal Reasoning|U8 Legal Reasoning]]** ($$) — analysis pass перед writing, також на premium model
3. **[[Lexery - ORCH and Clarification|ORCH]] decisions** ($$) — mid-run orchestration calls; зменшені через [[Lexery - Retry and Recovery|deterministic canary]]
4. **[[Lexery - U2 Query Profiling|U2 Classification]]** ($) — cheap model, але виконується на кожному запиті
5. **Delta summaries** (¢) — memory і context updates на `gpt-5-nano`, мінімальна вартість

### ORCH Cost Cutting: Deterministic Canary

[[Lexery - Retry and Recovery|Deterministic canary]] — ключовий механізм зменшення витрат. Для straightforward cases (single act, clear article reference) ORCH приймає рішення без дорогого `gpt-5.2` call. Ефект: ~50% зменшення mid-run ORCH costs для типових запитів. Детальніше: [[Lexery - Retry and Recovery]].

---

## Brain Maintenance Target

Для wiki і brain-admin automation:

- **Target**: ~**$2/month** через OpenRouter
- Включає: scheduled brain-admin scans (`.github/workflows/lldbi-brain-admin.yml`), import proposal generation, catalog health checks
- Використовує переважно cheap models (`gpt-4o-mini`, `gpt-5-nano`) для routine tasks
- Expensive model calls тільки для substantive wiki restructuring sessions

---

## Running total

| Date | Operation | Tier | Tokens (est.) | Est. cost (USD) | Notes |
|------|-----------|------|---------------|-----------------|-------|
| 2026-04-09 | Initial wiki build | 3 | ~200k | ~2.00 | One-time scaffold |
| 2026-04-09 | Second brain expansion | 3 | ~300k | ~3.00 | Large page batch |

**Reconciliation**: When invoice data exists (OpenRouter, Anthropic, Cursor), add a **"verified"** row or footnote — until then, treat numbers as **order-of-magnitude estimates**.

---

## Monthly projection

With **delta-first** processing (weekly Tier 2 + one monthly Tier 3 audit):

- **Expected steady state**: **~$0.50–1.50/month** if Tier 2 stays short and Tier 3 is bounded.
- **Risk drivers**: full-repo re-ingest, attaching large PDFs to prompts, repeated multi-hour Opus sessions without checkpointing.

**Mitigations**

- Enforce **[[Lexery - Maintenance Runbook]]** tier boundaries.
- Log every paid pass in this table for retroactive budgeting.

---

## Related product costs (out of scope here)

Brain runtime spend (U2/U8/U10/ORCH, embeddings, rerankers) belongs in **infra / finance** dashboards — link from [[Lexery - Deployment and Infra]] when documented. This ledger is **wiki ops** only.

## Governance

- **Who can add rows?** Anyone maintaining the vault; sign with initials in **Notes** if multi-user later.
- **Rounding**: estimates may be rounded to **nearest $0.05** for readability; keep raw notes in monthly [[Lexery - Log]] if precision matters.
- **Cap enforcement**: if two consecutive weeks exceed target, switch to **Tier 1 only** until the next planned Tier 3.

## Open questions (cost side)

See [[Lexery - Unknowns Queue]] item **monthly AI spend (aggregate)** — until that is answered, this ledger cannot be reconciled against **company-wide** burn; it only tracks **documented wiki maintenance** sessions.

## Links

- [[Lexery - Maintenance Runbook]]
- [[Lexery - Automation Architecture]]
- [[Lexery - Provider Topology]]
- [[Lexery - Log]] — append spend notes alongside maintenance entries.
- [[Lexery - Unknowns Queue]] — item on aggregate AI spend for the *product*.
- [[Lexery - Retry and Recovery]] — deterministic canary cost optimization.
