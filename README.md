# Lexery LLM Wiki (Obsidian vault)

Повний **Lexery Second Brain** для Obsidian: нотатки `Lexery - *.md`, `raw/`, automation у `_system/`.

## Доступ для Саші (один лінк на код)

**Клонувати vault:**

```bash
git clone https://github.com/seredyuk2077/lexery-llm-wiki.git
cd lexery-llm-wiki
```

Далі в Obsidian: **Open folder as vault** → вибрати цю папку `lexery-llm-wiki`.

## Швидке відкриття нотатки (після додавання vault)

Якщо папка vault у Obsidian називається так само, як репозиторій (`lexery-llm-wiki`), можна відкрити Index одним кліком (macOS / Windows з зареєстрованим `obsidian://`):

[Відкрити Index в Obsidian](obsidian://open?vault=lexery-llm-wiki&file=Lexery%20-%20Index.md)

[Neural Link Hub](obsidian://open?vault=lexery-llm-wiki&file=Lexery%20-%20Neural%20Link%20Hub.md)

Якщо vault названо інакше — заміни `vault=` на свою назву з бокової панелі Obsidian (URL-encoded).

## Локальні скрипти

Повний цикл оновлення: `node _system/scripts/run-maintenance.mjs` (потрібен Node; деталі в `Lexery - Maintenance Runbook`).
