---
aliases:
  - Yehor
  - Yehor Puhach
  - puhachyeser
tags:
  - lexery
  - team
  - person
  - backend
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: team
---

> [!info] Compiled from
> - `raw/github-prs/pr-1.md`
> - `raw/github-prs/pr-2.md`
> - `raw/github-prs/pr-3.md`
> - `raw/github-prs/pr-5.md`
> - `raw/github-prs/pr-6.md`
> - `raw/github-prs/pr-8.md`
> - `raw/github-prs/pr-9.md`

# Yehor Puhach

Профіль учасника команди Lexery: бекенд-інженер і спеціаліст з інфраструктури, який системно будує основу API, auth і storage, на яку спираються портал і agent pipeline. Матеріал зібраний з публічних PR на `lexeryAI/Lexery`, згадок у Telegram та контексту роботи в Linear — без психологічних ярликів, придатний для показу самому Єгору.

## Роль

- **Функція:** backend engineer, infrastructure specialist — межі сервісів, HTTP surface (API & Control Plane), Prisma, інтеграції сховища, auth stack, спільні контракти з agent.
- **GitHub:** [puhachyeser](https://github.com/puhachyeser).
- **Telegram:** @puhachyeser (згадується Андрієм у групі Lexery.ai General); учасник групи Lexery.ai.
- **Linear:** admin access; завдання переважно на backend-треку.

## Стиль комунікації та документування роботи

- **Структуровані PR title:** префікси на кшталт `[Backend]`, `[Frontend]`, `[Backend / Agent]` — одразу видно шар і тип зміни.
- **Пояснює «навіщо», не лише «що»:** наприклад, у PR про doclist скрипти — раціонал: перейменувати з `dev`, щоб не ловити помилки при `pnpm dev` з кореня monorepo.
- **Трасованість до Linear:** у body PR лінкуються issues (наприклад, shared contracts → LEX-198; storage / presigned URLs → LEX-201).
- **Каденція:** дуже висока — на спостережуваному відрізку найбільший обсяг PR у команді; інколи кілька PR за один день.

## Технічний домен (що саме будує)

| Область | Що це дає продукту |
| --- | --- |
| **NestJS** | Модулі, service boundaries, HTTP API для порталу та control plane. |
| **Prisma** | Схема даних і доступ до БД узгоджено з run/workspace state. |
| **Authentication** | Цикл змін: user schema + auth service (#3), refactor auth (#8), ongoing registration infra (#9). |
| **Monorepo** | Міграція frontend у Turborepo workspace + конфіг під monorepo infra (#1). |
| **Shared contracts** | Zod / типи між backend і agent (#5) — єдина «мова» payload’ів. |
| **File upload / storage** | Controller/service, presigned URLs, інтеграція з R2 (або еквівалент) — LEX-201. |
| **DocList / tooling** | Перейменування script names, щоб не конфліктувати з root `pnpm dev` (#6). |

Детальніше про архітектуру: [[Lexery - API and Control Plane]], [[Lexery - Contracts and Run Schema]], [[Lexery - Deployment and Infra]], [[Lexery - Retrieval, LLDBI, DocList]].

## Робочі патерни (виведені з GitHub)

- **Foundational-first:** спочатку monorepo (#1), потім storage (#2) і auth foundation (#3), далі shared contracts (#5) і дрібні infra chores (#6, #8).
- **Self-merge, без formal PR reviews** на спостережуваних PR — висока довіра й швидкий merge; для агента це означає: контекст краще читати з diff і Linear, ніж очікувати discussion thread у GitHub.
- **Малі, часті PR** у гілку `dev` — зручно трекати через [[Lexery - PR Chronology]] та [[Lexery - GitHub History]].

## Історія PR (puhachyeser, `lexeryAI/Lexery`)

Заголовки та дати — як у GitHub на момент оновлення нотатки.

| # | Title | Дата (merge або стан) | Статус |
| --- | --- | --- | --- |
| 1 | chore: migrate frontend and configurate it to use monorepo infra | 2026-03-29 | merged |
| 2 | [Backend] feat: add storage controller/service with uploading functionality | 2026-03-31 | merged |
| 3 | [Backend] feat: tweak user schema and auth service to match new auth data | 2026-04-02 | merged |
| 5 | [Backend / Agent] feat: add shared contracts(zod/types) for backend and agent | 2026-04-04 | merged |
| 6 | [Agent] chore: change doclist script names to prevent errors | 2026-04-04 | merged |
| 8 | [Frontend] chore: refactor auth | 2026-04-06 | merged |
| 9 | [Frontend] feat: add infra for email/sms/oauth registration | — (відкрито з 2026-04-07) | **open** |

Посилання на Linear з body PR (для трасування):

- [#5 — shared contracts](https://linear.app/lexery/issue/LEX-198/shared-contracts-unifikaciya-zod-shem-ta-tipiv)
- [#2 — storage / presigned URLs](https://linear.app/lexery/issue/LEX-201/storage-generaciya-agent-compatible-presigned-urls-u-nestjs)

## Взаємодія з Андрієм (Andriy)

- **Розподіл фокусу:** Andriy — Brain / agent architecture та pipeline; Yehor — backend і infra, з якими agent і портал з’єднуються по мережі та контрактам.
- **Формальних cross-reviews немає** — домени комплементарні: «нудна», але критична інфраструктура (auth, storage, contracts) з боку Yehor дозволяє Andriy зосередитись на orchestration і retrieval.
- **Практичний наслідок для змін у `apps/brain`:** узгоджувати breaking changes у shared Zod/types з тим, що вже змерджено в backend; див. #5 і [[Lexery - Contracts and Run Schema]].

## Взаємодія з Сашею (Sasha)

- **Спільний auth:** Yehor — backend auth і refactor (#3, #8, ongoing #9); [[Lexery - Olexandr|Саша]] (frontend) — auth pages (наприклад, PR #7 у репо — автор `alexbach093`).
- **Shared contracts (#5)** задають API surface, який споживає frontend — робота узгоджена через типи та issues, а не через довгі review threads у GitHub.
- **Незалежні PR** з координацією по сенсу задачі (auth flow, registration) — типова модель для цієї пари.

## Що варто знати агенту, який з ним «працює» через репозиторій

1. **Джерело правди:** merged PR + Linear issue, не коментарі в PR (їх може не бути).
2. **Префікси в title** швидко підкажуть, чи чіпати backend, frontend чи agent tooling.
3. **Інфраструктурні зміни** (auth, upload, env, contracts) майже завжди проходять через його шар — перед великими рефакторами варто перевірити відкриті PR (наразі #9).
4. **Термінологія в GitHub:** деякі PR марковані `[Frontend]`, але стосуються auth/registration **infra** — читати опис і diff, не лише префікс.

## Як це видно в продукті

- **Runs / workspaces:** API та persistence, які портал показує як UX — [[Lexery - Portal Surface Map]], [[Lexery - Product Surface]].
- **Agent:** doclist script naming та подібні chores підтримують developer ergonomics для [[Lexery - Retrieval, LLDBI, DocList]].
- **Команда й процес:** [[Lexery - Team and Operating Model]], [[Lexery - Current State]].

## See also

- [[Lexery - Team and Operating Model]]
- [[Lexery - API and Control Plane]]
- [[Lexery - GitHub History]]
- [[Lexery - Contracts and Run Schema]]
- [[Lexery - PR Chronology]]
- [[Lexery - Current State]]
- [[Lexery - Retrieval, LLDBI, DocList]]
- [[Lexery - Deployment and Infra]]
- [[Lexery - Andrii Serediuk]]
- [[Lexery - Olexandr]]
- [[Lexery - Portal Surface Map]]

## See Also

- [[Lexery - Who Built What]]
- [[Lexery - Drift Radar]]
- [[Lexery - Decision Registry]]
