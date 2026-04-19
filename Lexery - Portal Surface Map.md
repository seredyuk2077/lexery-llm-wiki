---
aliases:
  - Portal Surface Map
tags:
  - lexery
  - product
  - frontend
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: product
---

> [!info] Compiled from
> - Automated wiki maintenance + repository sources
> - See [[Lexery - Source Map]] for trust model

# Lexery - Portal Surface Map

## What This Page Is

Детальний інвентар поточної поверхні `apps/portal` — екранів, компонентів і серверних маршрутів, що формують user-facing частину [[Lexery - Product Surface|продукту]].

## Top-Level Product Areas

- workspace layout
- chat
- attachments
- sidebar/history
- settings
- search overlay
- boot/loading/error states
- server-side chat routes

## Screen-by-Screen Inventory

### Workspace Screen

Головний екран після авторизації. Layout визначений у `src/app/(workspace)/layout.tsx` — він об'єднує sidebar, header та основну content area. Workspace screen підтримує multi-workspace switching: кожен workspace зберігає окремий набір чатів, preferences та [[Lexery - Memory and Documents|memory context]].

### Chat Screen

Центральний user flow [[Lexery - Product Surface|Portal]]. Користувач вводить юридичне питання, отримує streamed відповідь від [[Lexery - Brain Architecture|Brain]] pipeline. Компоненти `src/components/chat/*` включають message bubbles, typing indicators, citation cards із посиланнями на нормативні акти. Streaming реалізований через SSE endpoint `src/chat-api/stream/route.ts`.

### Auth Pages

Сторінки login, register, forgot-password — PR #7 від [[Lexery - Olexandr|Sasha]]. Побудовані на shadcn/ui form primitives з server-side validation. Після авторизації redirect flow переводить користувача на workspace screen із збереженим session token.

### Settings

`src/components/settings/*` і `src/components/ui/SettingsScreen.tsx` — user preferences, API key management для [[Lexery - Provider Topology|OpenRouter]], theme switching. Settings зберігаються локально через `src/lib/app-preferences.ts` з sync до Supabase для крос-девайсного доступу.

### System Prompt Editor

PR #4 від [[Lexery - Olexandr|Sasha]] — дозволяє користувачу кастомізувати system prompt для [[Lexery - Brain Architecture|юридичного агента]]. Включає template picker з preset prompts для різних юридичних сценаріїв, markdown preview і validation для максимальної довжини та обов'язкових секцій.

### Subscription Plans

PR #10 від [[Lexery - Olexandr|Sasha]] — pricing table із тарифними планами, feature comparison matrix, billing integration через [[Lexery - API and Control Plane|API]]. UI адаптований під Ukrainian market з відповідними currency і payment method options.

## Concrete Source Tree Signals

### App shell

- `src/app/(workspace)/layout.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`

### Chat system

- `src/components/chat/*`
- `src/workspace-chat/*`
- `src/chat-api/route.ts`
- `src/chat-api/stream/route.ts`

### Attachments

- `src/components/attachments/*`
- `src/components/ui/FilePreview.tsx`

### Sidebar / navigation

- `src/components/sidebar/*`
- `src/components/ui/WorkspaceSidebar.tsx`

### Settings / overlays

- `src/components/settings/*`
- `src/components/ui/SearchOverlay.tsx`
- `src/components/ui/SettingsScreen.tsx`

### Data/helpers

- `src/lib/chat-library.ts`
- `src/lib/chat-repository.ts`
- `src/lib/app-preferences.ts`
- `src/lib/server/openrouter.ts`

## OpenRouter Route

Серверний маршрут `src/lib/server/openrouter.ts` виконує server-side LLM calls через [[Lexery - Provider Topology|OpenRouter]]. Portal ніколи не надсилає API ключі на клієнт — всі model requests проксюються через Next.js API route. Це дозволяє контролювати rate limiting, cost tracking і model selection на backend рівні, не розкриваючи credentials у browser context.

## Repository Layers for Local State

Portal зберігає chat history та workspace metadata через repository pattern:

- **`chat-repository.ts`** — CRUD для chat sessions, зберігає повідомлення та metadata у localStorage з lazy sync до Supabase
- **`chat-library.ts`** — колекція чатів для sidebar display, sorting, search і filtering
- **`app-preferences.ts`** — user preferences (theme, language, default workspace) зі збереженням у localStorage та Supabase backup

Цей шар ізолює UI components від storage details — якщо backend storage змінюється, repository layer абсорбує зміну без переписування компонентів.

## Product Reading

- `Observed`:
  Portal вже є повноцінним workspace shell, а не landing page чи placeholder.
- `Observed`:
  він поєднує local product state, UI composition і server-side AI route logic в єдиній Next.js application.
- `Inferred`:
  цей Portal — user-visible половина продукту, яка має з часом тісніше зінтегруватися з [[Lexery - Brain Architecture|Brain]] runtime.

## See Also

- [[Lexery - Product Surface]]
- [[Lexery - Frontend and Brand Evolution]]
- [[Lexery - API and Control Plane]]
- [[Lexery - Frontend Refactor Context]]
- [[Lexery - Olexandr]]
