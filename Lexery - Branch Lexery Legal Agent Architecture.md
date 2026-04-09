---
aliases:
  - Branch Lexery Legal Agent Architecture
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: history
---

# Lexery - Branch Lexery Legal Agent Architecture

## Branch Identity

- Repo:
  `seredyuk2077/Ukrainan-Lawyer-LLM-BETA`
- Branch:
  `feature/lexery-legal-agent-architecture`

## Why This Branch Is Critical

This is the clearest pre-monorepo home of the Lexery Brain idea.

## Main Phases

### Phase 1 — inherited corpus foundation

- legislation completion and infra packaging work already present underneath

### Phase 2 — architecture crystallization

- full architecture docs
- `MEGA_DIAGRAM_FULL`
- `LEXERY_LEGAL_AI_AGENT_ARCHITECTURE`
- plan/answer/gap documents

### Phase 3 — staged implementation

- [[Lexery - U1 Gateway|U1 Gateway]]
- U2 classify
- U3 plan
- U4 retrieval
- U5 gate

### Phase 4 — runtime and tooling cleanup

- tools/datasets/reports structure cleanup
- U4 documentation normalization
- memory retrieval
- runtime stabilization

## Interpretation

- `Observed`:
  this branch is the strongest direct ancestor of current `apps/brain`.
- `Inferred`:
  if one wanted to reconstruct the pre-monorepo Brain worldview, this branch is the single most important branch to read.

## Коли з’явилась гілка і що вона запровадила

Гілка `feature/lexery-legal-agent-architecture` з’являється в історії `seredyuk2077/Ukrainan-Lawyer-LLM-BETA` як **explicit crystallization point**: момент, коли проект перестає бути «RAG навколо кількох документів» і отримує **іменовану архітектуру** з діаграмами, планами відповіді та документованими стадіями.

**Observed** сигнали в коміт-графі включають повне оновлення **legal agent architecture**, появу великих оглядових документів (**MEGA_DIAGRAM_FULL**, **LEXERY_LEGAL_AI_AGENT_ARCHITECTURE**) і структурування **plan / answer / gap** артефактів. Це означає зсув від ad-hoc скриптів до **contract-driven** мислення: кожна стадія має вхід, вихід і місце в загальному **runtime**.

## Від простого RAG до 12-стадійного pipeline

До цієї фази типовий шлях виглядав як **simple RAG**: запит → пошук у векторному сховищі → **prompt** з контекстом → відповідь моделі. Гілка **Lexery Legal Agent Architecture** фіксує перехід до **multi-stage pipeline**, де retrieval — лише один шар серед багатьох, а якість визначається послідовністю **classify → plan → retrieve → gate → …** з можливістю зупинити або переформулювати відповідь до того, як користувач побачить текст.

Такий зсув виправданий **corpus pain**: коли джерел багато, вони суперечать одне одному, а запити бувають неоднозначними, «один embedding search» створює ілюзію повноти. Pipeline додає **explicit policy** і точки аудиту — тема, яка пізніше перекликається з [[Lexery - Branch codex legal-rag-foundation|codex legal-rag-foundation]] (honesty, audit packs).

## Перша імплементація стадій U1–U12

У межах цієї гілки **Observed** формалізуються ранні стадії, зокрема:

- **U1 Gateway** — вхідний контур запиту, базова маршрутизація та захист інваріантів на кшталт scope.
- **U2 classify**, **U3 plan**, **U4 retrieval**, **U5 gate** — скелет «розуміємо запит → плануємо → тягнемо докази → фільтруємо/вирізаємо зайве».

Подальші стадії (**U6**–**U12**: збір доказів, reasoning, збірка відповіді, верифікація, **memory**, тощо) еволюціонують уже в монорепо; проте **семантичні імена** та поділ відповідальності беруть початок саме тут. Детальніше про сучасний **runtime** див. [[Lexery - U1-U12 Runtime]].

## Як це перейшло в `legal-agent-brain-dev`

Коли репозиторій виріс у **Lexery monorepo**, логіка консолідувалась у `apps/brain`, а активна розробка pipeline закріпилась за гілкою **`legal-agent-brain-dev`**. Можна читати це як **direct lineage**:

- `feature/lexery-legal-agent-architecture` — документована **birth** ідеї Brain і перші стадії.
- `legal-agent-brain-dev` — **operational home**: **consumers**, **orchestrator**, **outbox**, інтеграційні тести, політики **verify**.

Тому історикам архітектури корисно тримати обидві назви в голові: перша пояснює *навіщо* стільки стадій, друга — *як* воно зараз збирається в прод-подібному коді.

## Місце гілки в родині legacy branches

Поруч із [[Lexery - Legacy Architecture Bridge]] ця гілка відповідає на питання «де вперше з’явився сучасний сенс Lexery Brain». Вона також пояснює, чому [[Lexery - Corpus Evolution]] не виглядає надбудовою: pipeline задумувався під реальні вимоги до покриття й чесності щодо джерел, а не під демо-чат.

## See Also

- [[Lexery - Legacy Architecture Bridge]]
- [[Lexery - Brain Architecture]]
- [[Lexery - Branch codex legal-rag-foundation]]
