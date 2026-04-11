# Security — Lexery LLM Wiki

## Що ніколи не має бути в цьому репозиторії

- API-ключі (OpenRouter, OpenAI, Linear, Supabase **service role**, GitHub PAT тощо).
- Паролі, JWT, session tokens, вміст `.env`.
- Персональні абсолютні шляхи до домашньої директорії в **закомічених** plist (локально генеруй з `*.plist.example`).

## Локальні секрети (тільки на твоєму Mac)

- Файл **`~/.lexery-wiki-env`** (не в git):  
  `export OPENROUTER_API_KEY=...`  
  `export LINEAR_API_KEY=...`  
  Підхоплюється `run-maintenance-launchd.sh`.
- Виклики LLM (OpenRouter) у `generate-delta.mjs` — **лише** якщо змінна середовища задана; інакше крок тихо пропускається.

## LaunchAgent (macOS)

- Запускай **`_system/scripts/install-schedule.sh`** — він збирає `com.lexery.wiki-maintenance.plist` з **`com.lexery.wiki-maintenance.plist.example`** і підставляє шлях до vault.
- Готовий `com.lexery.wiki-maintenance.plist` **не комітиться** (див. `.gitignore`).

## Інцидент (ротація ключа)

У ранній історії git у шаблоні plist опинився реальний `OPENROUTER_API_KEY`. Історія переписана; рядок замінено на placeholder.  
**Обов’язково відкликай старий ключ у OpenRouter** і створи новий — лише в `~/.lexery-wiki-env`.

## Доступ Саші / агентів

- Репозиторій варто тримати **приватним**; колаборатор з правами **read** = лише клон і читання markdown (це не прямий доступ до прод-БД).
- Доступ до **Supabase / Redis / Qdrant** — окремі read-only ролі та ключі поза цим vault; у нотатках лише **опис**, без секретів.
