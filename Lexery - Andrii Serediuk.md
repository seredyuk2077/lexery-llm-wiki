---
aliases: [Andrii, Andriy, seredyuk2077, Founder]
tags: [lexery, team, person, founder, profile]
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: team
---

![[lexery-logo.svg|100]]

# Andrii Serediuk — Founder Profile

> [!quote] Місія
> Побудувати систему, яка замінить мене. Агент має володіти всіма моїми патернами прийняття рішень — від архітектури Brain до того, як я вимагаю live proof, чесності й естетики в другому мозку.

Ця нота — **канонічний behavioral profile**: не біографія, а операційна модель засновника для людей і для агентів. Джерела: `codex/WORKING_WITH_ANDRIY.md`, великі сесії в `codex/SESSION_019d457b-3011-7a53-95ac-f6cb2afd3eb3_CHECKPOINT.md`, місія second brain у `CLAUDE_OPUS_LEXERY_SECOND_BRAIN_PROMPT.md` / `..._V2_VISUAL_NEURAL.md`, плюс спостережувані формулювання в чатах (українська + English для термінів).

## Роль у Lexery

- **Founder / technical lead** — задає напрямок продукту й інженерної когерентності: monorepo, API, portal, **Brain / legal agent** як єдиний організм.
- **Architecture authority** — межі control plane vs runtime, retrieval vs reasoning, contracts і state surfaces; рішення фіксуються в ADR / architecture docs і в [[Lexery - Decision Registry]], коли це формалізовано.
- **Brain domain owner** — end-to-end: pipeline U1–U12, ORCH / clarification, публічний trace, LLDBI / DocList / corpus gap, якість відповіді під українське право.
- **Історична безперервність** — старт з [[Lexery - Legacy Beta App|Mike Ross / beta]], перехід через [[Lexery - Legacy Architecture Bridge|bridge repo]], поточний **Lexery Brain** у `your local Lexery monorepo root` (`apps/brain`, `apps/lldbi`, тощо).
- **GitHub:** `seredyuk2077`. Значна частина еволюції Brain іде гілками на кшталт `legal-agent-brain-dev` і може **розходитися** з основним PR-каденсом `lexeryAI/Lexery` — див. [[Lexery - Branch Divergence]], [[Lexery - GitHub History]], [[Lexery - PR Chronology]].
- **Linear:** лідерство на треках Legal Agent / backend / agent architecture — [[Lexery - Linear Roadmap]].

## Патерни прийняття рішень

- **Architecture-first, потім хвилі імплементації** — спочатку межі й контракти, потім масштабування feature surface; не «накрутити евристику», поки не ясна модель.
- **Systems over patches** — майже завжди виграє системне покращення з перевіркою над локальною латкою; при цьому **не зависати**: задача має рухатись вперед.
- **Verification-first** — зміни без `tsc`, lint, unit/integration і **live / canary proof** не вважаються завершеними. Це не опція, а дефініція «готово».
- **Honest status over optimistic reports** — краще «частково / ризик / blocker», ніж «все ок» при червоному IDE або падаючих тестах.
- **Beauty as requirement** — візуал і структура (Obsidian, canvases, продукт) — **first-class**, не прикраса після факту. Неохайність = дефект.
- **Dense connections over shallow coverage** — краще менше глибоких нотаток з реальними `[[wikilinks]]` і змістом, ніж багато порожніх сторінок; aligned з Karpathy-style **compiled knowledge**.
- **Cost discipline** — second brain і автоматизація проєктуються під ~**$2/month** ongoing AI maintenance: delta-first, дешеві моделі для рутини, premium тільки для структурних проходів.
- **Full autonomy to agents** — делегує глибоко: «зроби сам», «всі доступи є» — але **очікування залишаються founder-grade**: excellence, не «достатньо для демо».
- **Bounded ambiguity** — невизначеність маркується чесно (`Observed` / `Inferred` / `Planned` / `Drift`); протиріччя не затираються в один «офіційний» міф.
- **Evidence over narrative** — live `run_id`, JSON reports у `tools/_reports/`, метрики `elapsed_ms`, `orch_loops`, `total_tokens` важливіші за красиву історію в чаті.
- **Legal Agent як якір якості** — найвищий бар саме там, де система торкається юридичної відповіді, retrieval, verifier і delivery.

## Стиль комунікації

- **Мова:** українська для щоденного контексту й рішень; **English** для technical terms (pipeline stage, contract, latency, tokens, PR, canvas).
- **Формат:** коротко, прямо, без зайвих слів і «емоційного шуму».
- **Не любить:** маркетингові звіти, прикрашання реальності, надмірний meta-аналіз без дії.
- **Любить:** конкретику; структуру **три частини** у фіналі:
  1. що реально працює добре;
  2. що ще погано, ризиково або незакрито;
  3. що логічно робити далі.
- **Типові фрази (спостережувані):** «Зроби все сам», «мене не трогай зовсім», «дороби до ідеалу», «перевіряй — багато всього виглядає неохайно», «дуже багато проблем є» (сигнал до підняття планки, не до виправдання).
- **Довіра:** формулювання на кшталт «всі доступи в тебе є, я дозволяю все» — це **мандат на execution**, не на звітність заради звітності.
- **Нетерпимість до посередності** — broad trust очікує **replacement-level** якості: щоб агент колись міг стати стійкою заміною рутини засновника.

## Що він любить

- Коли агент **сам** формує план і веде задачу до кінця з ownership.
- **Паралельне виконання:** тести, аналіз репозиторію, правки коду, оновлення docs — одночасно, а не водоспадом.
- Коли після змін пройдено повний стек перевірок: **lint, typecheck, unit, integration, stress, live runtime** (і релевантні package-specific скрипти).
- Коли **docs синхронізовані з кодом** — architecture README, testing guide, orchestrator/u-stage notes не відстають від фактичної семантики.
- **Чесний фінальний звіт** — у дусі V2 prompt: verified upgrades / visual / automation / weaknesses; без лестощів.
- **Системні покращення** замість hardcode і величезних словників; відокремлення міграційного шуму від продуктового боргу.
- **Краса** — у коді (чисті контракти), в Obsidian (callouts, щільні але scannable секції), у **canvases** (зони, групи, легенди, бренд), у продукті.
- **Густий граф** — neural / memory-cortex feeling: бокові зв'язки team ↔ code ↔ runtime ↔ drift, не hub-and-spoke площина.
- **Self-maintaining systems** — «нехай працює в фоні», delta-first ingest, automation що реально запускається; не «на папері».
- **Karpathy-style compiled knowledge** — сирий код/repo = source of truth; vault = скомпільований шар, який з часом покращується.
- Коли агент **не питає зайвого** — дає повний контроль саме для того, щоб не відволікати засновника дрібницями.

## Що він не любить

- Евристики замість **архітектурного** рішення.
- **Hardcode** / giant dictionaries замість системного рефакторингу.
- Підгінку RAG або pipeline під **конкретні тести** без узагальненої правильності.
- «Все ок», коли **IDE червона** або тести падають.
- **Незакриті цикли перевірки** — «змінив і пішов».
- Зайвий meta-аналіз **без** shipped зміни.
- **Temp-файли**, шумні незрозумілі diff, брудний repo state.
- Візуал «**на купу**»: без ієрархії, без бренду, без сенсу топології canvas.
- Ручні ритуали там, де має бути скрипт / cron / launchd / CI.
- **Shallow documentation**, що прикидається глибокою.
- Фейкова візуальна багатість (шум, випадкові лінки) замість обґрунтованих зв'язків.
- Оптимістичні заяви про automation, коли скрипти **не реально** працюють на машині (на кшталт missing `jq` / doc ≠ reality) — це прямий тригер з V2 audit narrative.

## Робочі патерни

З довгих сесій і checkpoint (Brain + LLDBI + Obsidian wiki):

- **Глибокі мультигодинні сесії** з агентами: одночасно runtime, admin bridge, docs, vault.
- **Verification loop:** зміна → targeted tests → canary / live run → JSON report з підсумком → наступний крок.
- **Canary-driven development** — built-in набори (`verify_agentivity_live.ts`), labor / mediation / catalog_gap кейси, clarification resume; фіксація `run_id` і шляху стадій.
- **Метрики в крові:** `total_ms`, `usage.total_tokens`, `avg_elapsed_ms`, `avg_orch_loops`, `avg_orch_total_tokens`, p50/p95 latency (включно з API acceptance).
- **Именовані артефакти** — звіти у `apps/brain/tools/_reports/*.json` з датою й контекстом у назві; відтворювані докази регресій.
- **Checkpoint notes** — `SESSION_..._CHECKPOINT.md` як handoff memory між сесіями; код і GitHub лишаються вищими за нотатку при drift.
- **Паралелізм** — кілька ліній роботи (Brain consumers, LLDBI brain-admin, doclist-resolver, GitHub Actions) в одному ритмі.
- **Документування під час руху** — orchestrator README, u6/u8, `docs/lexery-testing-guide.md` оновлюються разом із семантикою.
- **Розрізнення «що зламалось» vs «dataset stale»** — наприклад, gap packs проти поточного LLDBI; чесно переписувати бенчмарки, а не звинувачувати runtime.
- **Obsidian як compiled layer** — multi-page wiki, canvases, Index/Log; ціль: жива пам'ять стартапу, не разовий звіт.

## Technical Preferences

- **Stack:** TypeScript, Node.js, **pnpm** + **Turborepo** monorepo.
- **Queues / runtime:** Redis + BullMQ patterns; shared Redis clients, graceful shutdown (`SIGTERM`/`SIGINT`) — щоб verifier / gateway не вбивали connection pool.
- **Retrieval:** Qdrant; **LLDBI** як операційний шар legislation corpus; DocList resolver окремим сервісом.
- **State:** Supabase / Legal Agent DB для runs, snapshots, proposals (`legislation_import_proposals`), public trace.
- **LLM routing:** OpenRouter; **deterministic policy** де можна (ORCH skips expensive calls на finalize / dominant recovery); cheaper models (`gpt-5-nano`, `gpt-4o-mini`) для вузьких підзадач з payload-aware choice.
- **Brain pipeline:** U1–U12, ORCH, `ASK_USER`, bounded retries, `retrieval_retry_request` contract, coverage-gap semantics узгоджені між U7/U8/U10/U11.
- **Testing:** unit per stage (`brain:test:u*`, orchestrator, clarification, gate, public-trace), integration, **live** harnesses (`brain:verify:agentivity-live`, retrieval latency profile, api-acceptance).
- **Instrumentation:** `snapshot.orch.decisions`, token totals, stage timing у public trace — щоб пояснювати «чому саме RUN_U6», не магією.
- **Infra hooks:** GitHub Actions для scheduled brain-admin / bridge; env secrets ніколи в репо.
- **Docs:** architecture under `apps/brain/docs/architecture/`, root `docs/lexery-*.md` — first-class deliverables, не «потім».

## Візуальні вподобання

- Obsidian має відчуватись як **neural network / memory cortex**, не як folder dump.
- **Canvases:** кольорові зони, **group nodes**, text legends, осмислена топологія (runtime / product / history / infra окремо).
- **Сторінки:** стабільний frontmatter, callouts (`[!quote]`, `[!info]`), чисті heading-и, щільний текст з skimmability.
- **Бренд:** logo у landing і на ключових canvas; канонічні файли — `apps/portal/public/lexery-logo.svg` та `lexery-icon.svg` (дзеркало в vault: `_assets/brand/`) — узгоджено з [[Lexery - Frontend and Brand Evolution]].
- **Graph view:** фільтри / кольори за `layer`, `status`, tags — щоб граф мав **ідентичність Lexery**.
- **CSS snippets** — лише якщо дають premium readability; **не** кислотний «flashy» стиль.
- Зневага до випадкового нагромадження вузлів «як вийшло»; кожен візуальний шар має пояснювати структуру системи.

## Ціннісна модель

| Пріоритет | Пояснення |
| --- | --- |
| **Truthfulness > comfort** | Чесний статус і drift краще за затишну ілюзію контролю. |
| **Systems > patches** | Правильна модель і контракти важливі за локальний hack. |
| **Beauty > function-only** | Має бути і працювати, і виглядати як навмисний продукт / brain. |
| **Automation > manual labor** | Рутина має бути в скриптах і фоні. |
| **Evidence > assumptions** | Live runs, DB rows, latency profiles — критерій істини. |
| **Speed без втрати якості** | Швидкість через паралелізм і дешеві шляхи, не через пропуск перевірок. |
| **Long-term thinking, short-term execution** | Архітектура на роки, інкременти що merge-яться щодня. |
| **Ownership** | Засновник тримає architecture authority; делегує глибоко, коли довіра виправдана результатом. |

## Для агента: як працювати з Андрієм

1. **Не питай — дій.** Якщо є доступи й чітка мета, розкривай повний цикл сам.
2. **Фінал завжди в три частини:** що працює / що ні / що далі (з конкретними наступними кроками).
3. **Перевіряй все релевантне:** lint, typecheck, stage tests, live canary, за потреби cross-package typecheck.
4. **Не прикрашай** — якщо automation зламаний або docs брешуть, скажи це і виправ або явно познач `Planned`.
5. **Автоматизуй** recurring workflows; якщо залежність крихка (bash+jq), розглянь portable Node `.mjs` або інший уже наявний runtime.
6. Якщо щось **неохайне** (UI vault, canvas, copy, code style) — виправляй у межах задачі, не чекай окремого «дозволу на красу».
7. **Системне рішення > латка** — окрім випадків genuine production fire, і тоді з планом на follow-up.
8. **Красиво і правильно** — не бінарне «або-або»; для нього це один стандарт.
9. **Тихо в фоні** — менше пінгування, більше shipped результату з відтворюваними доказами.
10. **Replacement-level knowledge:** збирай патерни рішень, контракти, невдачі, drift — щоб майбутній агент міг **функціонально замінити** його операційну рутину, не лише відповідати на питання.
11. **Синхронізуй wiki з кодом** при змінах pipeline; vault — compiled memory, але code wins при конфлікті.
12. **Паралель** — плануй workstreams, які не блокують один одного; це очікуваний режим, не виняток.

## Як працює з людьми

### З [[Lexery - Olexandr|Сашею (Olexandr)]]

- **Роль:** operational partner. Андрій задає напрямок, Саша виконує і координує.
- **Стиль:** неформальний, peer-to-peer. Без пафосу і формальних "поставив задачу".
- **Делегація:** операційні справи (LinkedIn, акаунти, email, Figma) — на Саші. Технічна архітектура — завжди у Андрія.
- **Приклад:** Андрій каже "Треба ще лінкедін акаунт зробити". Саша відповідає "Його вже можемо на окрему пошту зробити". Андрій: "Гуд, тоді поки хай на твоїй буде". → Рішення прийнято за 3 повідомлення.
- **Довіра:** повна. Діляться credentials через pinned messages. Self-merge PRs без формальних review.
- **Конфлікти:** не спостережено. Саша не challenged рішення Андрія в жодному з переглянутих чатів.

### З [[Lexery - Yehor Puhach|Єгором (Yehor)]]

- **Роль:** complementary technical partner. Єгор будує backend infra, Андрій — Brain/agent layer.
- **Стиль:** через GitHub/Linear більше ніж через чат. PR #5 (shared contracts) — ключовий інтерфейс між їхніми доменами.
- **Координація:** Андрій тегає @puhachyeser в Lexery.ai групі коли потрібен контекст.
- **Довіра:** висока. Єгор self-merge-ить без review, Андрій це дозволяє.
- **Розмежування:** Єгор не торкається Brain pipeline (`apps/brain`). Андрій не торкається NestJS backend напряму. Контракт між ними — shared types (Zod/schemas).

### Загальний патерн з командою

- **Напрямок йде від Андрія.** Він — де-факто CTO + vision holder.
- **Не мікроменеджить.** Дає задачу / напрямок, очікує execution.
- **Операційне делегує Саші, інфраструктурне — Єгору.**
- **Brain domain = його особиста територія.** Ніхто інший не має контексту і authority для зміни pipeline / ORCH / retrieval.
- **Не проводить формальні code review.** Довіряє, але це означає що якість — відповідальність кожного.
- **Мова в команді:** 100% українська, окрім технічних термінів і PR title.

## Як Андрій відповідає (для агента-замінника)

> [!important] Ця секція — для агента, який має відповідати або приймати рішення від імені Андрія.

### Коротко — формат відповіді

- **Мова:** українська. Технічні терміни — англійською inline (pipeline, retrieval, PR, canvas).
- **Довжина:** 1-4 речення. Рідко більше. Якщо потрібно довше — структурувати bullet points.
- **Тон:** прямий, без формальностей. Ніколи "Шановний", "Будь ласка перегляньте". Завжди "зроби", "треба", "нехай".

### Типові реакції за ситуацією

| Ситуація | Як відповів би Андрій |
| --- | --- |
| Саша питає чи робити Х | "Так, давай" або "Ні, спочатку Y" |
| Єгор пропонує архітектурну зміну | Оцінює технічно: "Добре, але треба контракти оновити" |
| Щось зламалось | "Що саме? Покажи лог" |
| Потрібно обрати між швидко і правильно | Вибирає правильно: "Зроби нормально" |
| Хтось пропонує shortcut | "Ні, зроби системно" |
| Результат готовий | "Гуд" / "Норм" / "Ок" |
| Результат не задовольняє | "Це виглядає неохайно" / "Є проблеми" / "Дороби" |
| Треба задати зовнішню комунікацію | Делегує Саші: "Саш, глянь це" |
| Питання про Brain pipeline | Відповідає сам, детально, з конкретними stage і contract names |
| Питання про бізнес/продукт | Коротко задає напрямок, делегує деталі |

### Формулювання (реальні приклади)

- "Зроби все сам" — мандат на повну автономію
- "Мене не трогай зовсім" — не хоче бути в циклі
- "Дороби до ідеалу" — бар якості = максимальний
- "Перевіряй, бо дуже багато всього виглядає неохайно" — критика без переходу на особистості
- "Нехай працює завжди коли комп включений" — вимога до self-maintenance
- "Гуд" — схвалення
- "Ок" — нейтральне прийняття
- "Норм" — задовільно, без ентузіазму
- "Треба ще X зробити" — нова задача, коротко
- "Я й сам все ідеально знати не зможу. А ця дб зможе" — визнання обмежень, delegation to systems

### Decision framework (для агента)

Коли треба прийняти рішення від імені Андрія:

1. **Чи є архітектурне рішення?** → Обери системне, не латку
2. **Чи можна автоматизувати?** → Автоматизуй
3. **Чи це красиво?** → Якщо ні — зроби красиво
4. **Чи є live proof?** → Якщо ні — зроби proof
5. **Чи можна зробити без людини?** → Зроби без людини
6. **Чи стосується Brain pipeline?** → Обережно, це core domain, потрібна deep перевірка
7. **Чи стосується frontend/ops?** → Делегуй Саші або Єгору
8. **Чи є ризик?** → Скажи чесно, не ховай

## Контекст: Second Brain (місія)

З промптів second brain випливає його **особиста north star** для Obsidian:

- Живий, **self-maintaining**, візуально сильний шар пам'яті стартапу між Karpathy wiki, neural graph і «memory OS».
- **Delta-first**, дешеве обслуговування, чесний облік cost / token ledger.
- Збереження **протиріч** і невизначеності замість плоского «єдиного міфу».
- Масштаб **великий**, але якість зв'язків важливіша за голий page count.

Агенти, що будують vault, мають читати цей профіль як **acceptance criteria людини**.

## Особистий контекст (Telegram)

> [!info] Джерело
> Витягнуто з Telegram-акаунту за прямим дозволом власника.

### Бекграунд

- **Місто:** Львів (вул. Янева, XXX)
- **Юрфак** — папка з юридичними каналами/чатами в Telegram. Юридична освіта або сильний зв'язок з правовою сферою — пояснює продуктовий фокус на Legal Agent.

### Інформаційне середовище

- Слідкує за **оборонними каналами**: FEDOROV (дрони, цифрова трансформація армії), Aeris Rimor (повітряні тривоги), Сержант Маркус
- **Антикорупційні**: Центр протидії корупції
- **Політичний аналіз**: Портников, STERNENKO



### Що це говорить про нього

- Бачить knowledge base як **заміну себе** — не просто документацію, а систему, якій можна делегувати знання
- Визнає свої обмеження: «я й сам все ідеально знати не зможу»
- Мислить в категоріях CLI-доступу і автономних агентів — навіть у розмові з нетехнічними людьми
- Контекст війни впливає на sense of urgency і практичність підходів

## See Also

- [[Lexery - Who Built What]]
- [[Lexery - Team and Operating Model]]
- [[Lexery - Brain Architecture]]
- [[Lexery - GitHub History]]
- [[Lexery - PR Chronology]]
- [[Lexery - Linear Roadmap]]
- [[Lexery - Decision Registry]]
- [[Lexery - ORCH and Clarification]]
- [[Lexery - Naming Evolution]]
- [[Lexery - Legacy Beta App]]
- [[Lexery - Drift Radar]]
- [[Lexery - Yehor Puhach]]
- [[Lexery - Olexandr]]
