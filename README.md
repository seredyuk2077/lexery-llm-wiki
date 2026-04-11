# Lexery LLM Wiki (Obsidian vault)

Повний **Lexery Second Brain** для Obsidian: нотатки `Lexery - *.md`, `raw/`, automation у `_system/`.

## Безпека та доступ

- Репозиторій має бути **приватним**; колаборатор з правами **read** отримує лише markdown і скрипти — **без** твоїх API-ключів і локальних шляхів (див. [SECURITY.md](./SECURITY.md)).
- Ключі OpenRouter / Linear тощо — тільки в **`~/.lexery-wiki-env`** на твоєму Mac (не в git).
- Після старого витоку **обов’язково ротуй `OPENROUTER` key** у кабінеті OpenRouter.

## Доступ (клон для Obsidian)

Потрібен доступ до GitHub (invite). Далі:

```bash
git clone https://github.com/seredyuk2077/lexery-llm-wiki.git
cd lexery-llm-wiki
```

У Obsidian: **Open folder as vault** → папка `lexery-llm-wiki`.

### Локальна автоматизація (опційно)

1. Скопіюй `_system/state/repos.json.example` → `_system/state/repos.json` і пропиши **`path`** до свого клону monorepo `Lexery` (або задай `LEXERY_MONOREPO_ROOT`). Перший запуск `sync-git.mjs` сам створить `repos.json` з example, якщо файлу ще немає.
2. macOS LaunchAgent: `_system/scripts/install-schedule.sh` згенерує plist з `*.plist.example`.
3. LLM-резюме дельт (`generate-delta.mjs`) працює лише якщо задано `OPENROUTER_API_KEY` у `~/.lexery-wiki-env`.

## Швидке відкриття нотатки (після додавання vault)

Якщо папка vault у Obsidian називається так само, як репозиторій (`lexery-llm-wiki`), можна відкрити Index одним кліком (macOS / Windows з зареєстрованим `obsidian://`):

[Відкрити Index в Obsidian](obsidian://open?vault=lexery-llm-wiki&file=Lexery%20-%20Index.md)

[Neural Link Hub](obsidian://open?vault=lexery-llm-wiki&file=Lexery%20-%20Neural%20Link%20Hub.md)

Якщо vault названо інакше — заміни `vault=` на свою назву з бокової панелі Obsidian (URL-encoded).

## Локальні скрипти

Повний цикл оновлення: `node _system/scripts/run-maintenance.mjs` (потрібен Node; деталі в `Lexery - Maintenance Runbook`).
