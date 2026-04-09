---
aliases:
  - U2 Query Profiling
tags:
  - lexery
  - brain
  - runtime
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: brain
---

> [!info] Compiled from
> - `raw/architecture-docs/app-README.md`

# Lexery - U2 Query Profiling

## Роль у Pipeline

U2 — перша глибока «розуміюча» стадія після шлюзу: вона перетворює сирий текст запиту на структурований `query_profile`, який далі жорстко прив’язує retrieval і політику чесності. Без коректного профілю наступні стадії не знають, чи це вузьке цитування норми, чи широке дослідження, чи змішаний контекст пам’яті. Профіль зберігається в `RunRecord.query_profile` і в **RunContext** (`inmemory` / `redis`), тож аудит і повторні кроки бачать ту саму правду. Результат напряму живить **U3 Planning** (`routing_flags`, `entities`, `domainHint`, LLDBI hints). Шлях у production — **LLM-first** (OpenRouter) з rule-based fallback, smart gating і опційним AI-domain / routing repair.

## Code Surfaces

- `apps/brain/classify/consumer.ts` — main stage consumer (черга `U2`, злиття ambiguity, персистенція)
- `apps/brain/classify/llm-classifier.ts` — OpenRouter classify, JSON + zod, retry
- `apps/brain/classify/schema.ts` — Zod для LLM output (`intent`, `domain`, `entities`, `ambiguity`, `routing_flags`)
- `apps/brain/classify/types.ts` — `QueryProfile`, `RoutingFlags`, `QueryProfileMeta`
- `apps/brain/classify/intent-classifier.ts`, `legal-domain-tagger.ts`, `entity-extractor.ts`, `ambiguity-detector.ts` — rule-based шари
- `apps/brain/classify/input-normalizer.ts` — preprocessor (effective query, routing overrides)
- `apps/brain/classify/ai-domain-classifier.ts`, `lldbi-hints-from-vocabulary.ts`, `entity-alignment.ts`, `entity-semantics.ts`
- `apps/brain/classify/prompts/u2_classify_v1.ts` — prompt v1
- `apps/brain/classify/circuit-breaker.ts` — обмеження при LLM failures
- `apps/brain/lib/run-context.ts`, `run-context-store.ts`, `run-context-redis.ts` — контекст рану
- `apps/brain/lib/openrouter.ts` — виклик моделі з timeout/retry

Архітектурний індекс: `apps/brain/docs/architecture/app/u2/README.md` (+ `pipeline.md`, `test-results.md`, `decisions/`).

## Runtime Behavior

**Input:** подія черги `U2` + завантажений run (query, snapshot тощо). Consumer будує `QueryProfile` з полями, зокрема:

- Правова «вісь»: `domain` (`LegalDomain`), опційно `domainHint`, `domain_confidence`, кандидати топ-2, блок `lldbi` (categories / document_types / `routing_confidence` / `routing_source`).
- Тип запиту: `intent` — `question` | `drafting` | `procedure` | `research` | `other` (у промпті/схемі LLM це канонічний «query type»).
- Специфічність і «вага» запиту: `entities` (`act_abbrev`, `law_title`, `article_ref`, …), `computed_flags.has_direct_citation`, `ambiguity` (reason codes, strength hard/soft).
- Складність / розширення: `routing_flags` (`need_deep_retrieval`, `need_web`, `context_mode`, прапорці великого входу, вкладень тощо).

Основний flow: **normalize input** → pre-extract (rules) → за наявності ключа і конфігу — **LLM classify** (або skip через gating при високій rules confidence) → опційно **AI domain** / routing hints → merge ambiguity з rules → запис у RunContext + `RunRepository` для `query_profile`. Якщо LLM недоступний або `USE_RULE_BASED_CLASSIFIER=true`, лишається rules / **degraded** профіль (`profile_generation: "degraded"` у meta/computed).

**Output contract:** `QueryProfile` версіонований (`query_profile_version`, `pipeline_step`, `updated_at`); `meta.classifier_mode`: `llm` | `rules` | `degraded`.

## Failure Modes

- **Timeout / OpenRouter errors:** retry на транзієнтні мережеві помилки; circuit breaker може відрізати LLM; fallback на degraded/rules.
- **Invalid LLM JSON / schema drift:** parse failures → degraded або rules path з warnings у `meta.warnings`.
- **Відсутність API key:** rules-only або degraded домен/intent.
- **Довгий / шумний ввід:** truncation / R2 overflow сигналізуються в meta (`input_source`, `input_truncated`).
- **Ambiguity merge:** hard rules можуть перевизначити LLM; помилкове злиття дає або зайвий DocList downstream, або недостатню обережність — тому важливі audit поля `ambiguity_source`, `gating_decision`.

## Взаємодія з іншими стадіями

**Від U1:** отримує вже прийнятий запит (текст, tenant/user, snapshot hints). **До U3:** `query_profile` + `routing_flags` — вхід для `buildSearchPlanFromProfile` у `plan/rules.ts`; LLDBI hints з U2 зменшують «сліпий» retrieval у U4. **З U4/U5:** непрямо — через збережений профіль (direct citation, ambiguity) для gate signals. **ORCH:** `maybeRunInlineDeterministicOrchestrator` може виконатись після U2 у consumer-ланцюгу, якщо гілка тривіальна.

## Історична еволюція

Ранні версії ближчі до простого «intent + domain»; поточний U2 — багатовимірний профіль: окремі rule extractors, LLM JSON schema, smart gating (не викликати дорогий LLM на простих high-confidence hits), AI-domain repair для слабких general-запитів, багатий audit у `query_profile.meta` (u2_domain, u2_ai_domain, u2_ai_routing, lldbi vocabulary). Це зменшило випадковість U4 і спростило формальні контракти LEX-87/94.

## Known Drift

- У розмовній документації інколи кажуть «law_domain / query_type» — у коді канонічні імена полів: **`domain`** (і `domainHint`) та **`intent`**; «specificity / complexity» не окремі поля, а похідні від `entities`, `ambiguity`, `routing_flags` і meta.
- Дуже широкі legal queries раніше могли помилково потрапляти під DocList probe; правила U3 (`explicit_act_title_probe`) звузили це — але U2 все одно має давати стабільні `entities` / intent.

## See Also

- [[Lexery - U1 Gateway]]
- [[Lexery - U3 Planning]]
- [[Lexery - U4 Retrieval]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Run Lifecycle]]
- [[Lexery - Provider Topology]]
- [[Lexery - Glossary]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - LLDBI Surface]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - U5 Gate]]
- [[Lexery - U8 Legal Reasoning]]
- [[Lexery - U7 Evidence Assembly]]
- [[Lexery - Public Trace]]
