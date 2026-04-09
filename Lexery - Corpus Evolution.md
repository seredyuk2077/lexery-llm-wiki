---
aliases:
  - Corpus Evolution
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: inferred
layer: history
---

# Lexery - Corpus Evolution

## Why This Page Exists

Corpus evolution is one of the deepest invisible stories in Lexery. Without it, the Brain can look overdesigned. With it, Brain architecture reads as a response to real retrieval pain.

## Phase 1 — simple legal knowledge base

- Early beta app referenced a legal knowledge base and law lists.
- At this stage, legal grounding was still relatively app-level.

## Phase 2 — law database seriousness

### Signals

- `rada gov UA API + data base upd`
- `Implement comprehensive legal database management system`

### Meaning

- `Observed`:
  project moved from “assistant with legal knowledge” to “system with legal data pipeline”.

## Phase 3 — Supreme Court and legislation broadening

### Signals

- Supreme Court RAG branch
- `docs/supreme_court_rag.md`
- `docs/supreme_court_benchmark.md`

### Meaning

- legislation remained central
- case law became an explored expansion path

## Phase 4 — DocListDB and validation waves

### Strongly observed in Jan 2026 history

- daily updater
- Qdrant sync
- document type validation
- importer phases
- soak/batch control loops
- gate audits
- health reduction to zero criticals

### Meaning

- `Observed`:
  this is where corpus work became production discipline.

## Phase 5 — standalone legislation infra packaging

### Observed

- `Lexery Legislation DB Infra` packaged as standalone prod microservice
- portable runs in R2
- cleanup, completion docs

### Meaning

- corpus stack became something close to a product subsystem of its own

## Phase 6 — Brain-admin loop

### Observed in current monorepo

- `apps/lldbi/brain-admin`
- corpus-gap recovery docs
- import proposals / conservative worker policy

### Meaning

- the corpus is no longer just background data.
- the Brain is starting to talk back to corpus/admin processes.

## Best Synthesis

Lexery’s corpus story evolved through:

- knowledge base
- law database
- retrieval infra
- validation discipline
- standalone legislation subsystem
- Brain-admin feedback loop

This is one of the clearest signs that the project is trying to build defensible legal infrastructure, not only a nicer UI around an LLM.

## Повна хронологія корпусу (енциклопедичний огляд)

Нижче — стисла **timeline** від «немає корпусу» до сучасного legislation-стеку; технічні терміни лишаються англійською, як у коді та інфрі.

1. **No corpus (early beta)** — застосунок показує правові списки й знання, але без виробничого **pipeline** даних; **grounding** часто **app-local**.
2. **Basic Ukrainian laws** — перші зібрані набори норм як **knowledge base**; ручні або напівавтоматичні оновлення.
3. **Supreme Court exploration** — гілка [[Lexery - Branch Supreme Court Case Law RAG|Supreme Court Case Law RAG]] і документація **benchmark**; перевірка гіпотези, що **RAG** має тягнути не лише статті кодексів.
4. **rada.gov.ua integration** — коміти на кшталт `rada gov UA API + data base upd`; перехід до канонічного джерела оновлень і **catalog**-дисципліни.
5. **Law database management** — екрани й процеси «керувати актами»; корпус стає **operational asset**.
6. **DocList / validation waves (січень 2026)** — **daily updater**, **Qdrant sync**, **type** / **applicability** валідації, **soak** та **batch** імпорти, **health** до нуля критичних.
7. **Standalone LLDBI** — пакування **Lexery Legislation DB Infra** як підсистеми з **R2** та переносимими прогонами.
8. **Monorepo Brain + brain-admin** — корпус у **feedback loop** з агентом: [[Lexery - Branch Lexery Legal Agent Architecture|architecture]] задає **runtime**, **brain-admin** — контур імпорту та пропозицій.

## Поточний стан: `legislation_documents` і Qdrant

У **Supabase** канонічні метадані актів зосереджені навколо таблиці **`legislation_documents`** (і пов’язаних записів): юридичні ідентифікатори, стан публікації, зв’язки з **DocList**, прапорці оновлення. Тексти проходять **chunking**, потім індексуються в **Qdrant** для **semantic retrieval** у стадіях на кшталт [[Lexery - U4 Retrieval|U4]].

Це розділення ролей типове для зрілих **RAG** систем: **Postgres** як **source of truth**, **vector DB** як прискорювач пошуку зі зворотним зв’язком через **sync** jobs.

## Імпортний pipeline: brain-admin → proposals → process approved

Сучасний імпорт у монорепо описується ланцюгом **`apps/lldbi/brain-admin`**:

- **Batch**-операції збирають зміни або прогалини корпусу; формуються **import proposals** (що саме додати/оновити).
- Операторський контур **review** відсікає ризиковані зміни; **conservative worker policy** зменшує шанс «тихо зламати» канон.
- Після затвердження спрацьовує **process approved**: застосування змін до **DB**, підготовка до **re-chunk** / **re-index** у **Qdrant** залежно від політики деплою.

Такий **human-in-the-loop** імпорт узгоджується з вимогою юридичної інфри: помилка в тексті акту дорожча за затримку релізу.

## DocList: щоденний інкрементальний оновлювач з Ради

**DocList** — окремий контур узгодження каталогу з **rada.gov.ua**: **daily incremental updater** підтягує зміни, щоб корпус не «старів мовчки». На хвилях валідації це поєднувалось з **root-fix** кампаніями для типів документів і **applicability**, щоб метадані не роз’їжджались між джерелом і **DB**.

Для Brain це критично: **retrieval honesty** залежить від того, чи існує документ у каталозі й чи правильно він класифікований.

## Майбутнє: прапорець `auto_update`

У схемі даних існує **`auto_update`** (або еквівалентний прапорець на рівні документа/запису каталогу) як **hook** для повністю автоматичного оновлення тексту акту з офіційного джерела. **Observed** у поточному стані: значення **false для всіх документів** — тобто автоматичні «нічні» оновлення вмісту ще не увімкнені як дефолт; оновлення проходять через керовані процеси (**brain-admin**, ручні затвердження, обмежені батчі).

Це раціональний компроміс: спочатку стабілізувати **truth** каталогу й **index**, потім поступово розширювати автоматизацію з **audit**-гейтами.

## See Also

- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Legacy Branch Families]]
- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Deployment and Infra]]
