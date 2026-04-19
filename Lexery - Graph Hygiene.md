---
aliases:
  - Graph Hygiene
tags:
  - lexery
  - meta
  - obsidian
created: 2026-04-19
updated: 2026-04-19
status: observed
layer: meta
---

# Lexery - Graph Hygiene

Obsidian **Graph view** малює всі wikilink-зв’язки одразу — без фільтрів він виглядає як «куля з вузлів». Нижче — практичні кроки, щоб граф був **читабельним** і корисним для навігації.

## 1. Почни з вузла, а не з усього vault

- Відкрий **Local graph** з контекстного меню нотатки (наприклад [[Lexery - Project Brain]] або [[Lexery - U1-U12 Runtime]]).
- Увімкни **Depth 1–2**, не глобальну глибину 4+.

## 2. Приховай шум у налаштуваннях графа

У панелі Graph (шестерня):

- **Hide attachments** — так зникають дрібні технічні файли, якщо вони колись з’являться в корені.
- **Orphans** — вимкни, якщо хочеш бачити лише зв’язний острів навколо поточної нотатки.
- **Unresolved** — можна сховати, якщо граф засмічений майбутніми посиланнями.

## 3. Кольори за шаром (уже в `.obsidian/graph.json`)

У репо задані **color groups**: pipeline (`Lexery - U*`), history/branches, meta, product/data. Після pull відкрий Graph — групи підсвічують кластери замість однакових точок.

## 4. Не перетворюй Neural Hub на «зірку» посилань

Сторінка [[Lexery - Neural Link Hub]] навмисно містить **мало wikilinkів** у тілі — ідеї зв’язків лежать у `_system/logs/link-suggestions-*.md`. Так граф лишається охайнішим.

## 5. Сила зв’язку

- Пріоритетно лінкуй **вгору** до hub-ів: [[Lexery - Index]], [[Lexery - Project Brain]], відповідний U-stage або product surface.
- Уникай взаємних «павутин» між десятками сторінок одного рівня без ієрархії — для цього є Canvas-и (`Lexery - Master Map.canvas`, [[Lexery - Runtime Graph.canvas|Runtime Graph]]).

## 6. Фізика графа

У `graph.json` підкручені **repel / link distance / center** — якщо вузли все ще купуються, тимчасово зменш **scale** повзунком або збільш **repel strength** у UI (потім можна зберегти у файл).

## Див. також

- [[Lexery - Neural Link Hub]]
- [[Lexery - Master Map.canvas]]
- [[Lexery - Maintenance Runbook]]
