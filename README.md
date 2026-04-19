# Lexery LLM Wiki (Obsidian vault)

Повний **Lexery Second Brain** для Obsidian: нотатки `Lexery - *.md`, `raw/`, automation у `_system/`.

## Прямий лінк (працює в браузері без логіну)

**Канонічний репозиторій вікі (перегляд + клон):** [github.com/seredyuk2077/lexery-llm-wiki](https://github.com/seredyuk2077/lexery-llm-wiki)

Якщо вікі лежить **всередині** monorepo Lexery як `Lexery/LLM Wiki/`, це нормально: корінь репо `lexeryAI/Lexery` ігнорує цю папку в git, а **джерело правди для вікі** — окремий репо `seredyuk2077/lexery-llm-wiki` (пуш/пул саме звідти).

## Безпека

- У git **немає** API-ключів; LLM-виклики (OpenRouter) — лише локально через `OPENROUTER_API_KEY` у **`~/.lexery-wiki-env`** (див. [SECURITY.md](./SECURITY.md)).
- Публічний репо = **read-only копія знань**; продакшн БД / Supabase сюди не підключені.

## Доступ (клон для Obsidian)

Будь-хто може клонувати (public repo):

```bash
git clone https://github.com/seredyuk2077/lexery-llm-wiki.git
cd lexery-llm-wiki
```

У Obsidian: **Open folder as vault** → папка `lexery-llm-wiki`.

### Локальна автоматизація (опційно)

1. Скопіюй `_system/state/repos.json.example` → `_system/state/repos.json` і пропиши **`path`** до свого клону monorepo `Lexery` (або задай `LEXERY_MONOREPO_ROOT`). Перший запуск `sync-git.mjs` сам створить `repos.json` з example, якщо файлу ще немає.
2. **macOS (щодня, Mac увімкнений):** `bash _system/scripts/install-schedule.sh` — LaunchAgent: логін + **~09:10** щодня (`StartCalendarInterval`), див. [[Lexery - Maintenance Runbook]].
3. LLM-резюме дельт (`generate-delta.mjs`) працює лише якщо задано `OPENROUTER_API_KEY` у `~/.lexery-wiki-env`.
4. **Graph Obsidian:** увімкни snippet **lexery-wiki** і переглянь [[Lexery - Graph Hygiene]] — у репо вже лежить підкручений `.obsidian/graph.json` (кольори за шаром, стрілки, orphans off).

## Швидке відкриття нотатки (після додавання vault)

Якщо папка vault у Obsidian називається так само, як репозиторій (`lexery-llm-wiki`), можна відкрити Index одним кліком (macOS / Windows з зареєстрованим `obsidian://`):

[Відкрити Index в Obsidian](obsidian://open?vault=lexery-llm-wiki&file=Lexery%20-%20Index.md)

[Neural Link Hub](obsidian://open?vault=lexery-llm-wiki&file=Lexery%20-%20Neural%20Link%20Hub.md)

Якщо vault названо інакше — заміни `vault=` на свою назву з бокової панелі Obsidian (URL-encoded).

## Локальні скрипти

Повний цикл оновлення: `node _system/scripts/run-maintenance.mjs` (потрібен Node; деталі в `Lexery - Maintenance Runbook`).
