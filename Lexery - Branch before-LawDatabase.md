---
aliases:
  - Branch before-LawDatabase
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: history
---

# Lexery - Branch before-LawDatabase

## Branch Identity

- Repo:
  `seredyuk2077/Ukrainan-Lawyer-LLM-BETA`
- Branch:
  `before-LawDatabase`
- Tip commit:
  `Documentation Update + Tests Consolidation`

## Commit Era Reading

This branch sits right after:

- design v3 UI improvements
- Rada API + DB update
- legal database management implementation
- legal agent architecture refresh

## Why It Matters

- `Observed`:
  it looks like a consolidation checkpoint before deeper data/corpus evolution accelerated.
- `Inferred`:
  it captures the project at the boundary where “legal app with improving data” is about to become “legal data system”.

## Як виглядав код на цій позначці

На рівні продукту це все ще ранній **beta**: відносно простий **frontend**, фокус на зборі й показі правових даних, без повноцінного **Legal Agent** у сенсі сучасного **Brain pipeline** ([[Lexery - U1-U12 Runtime]] ще не існував як оперована модель). Репозиторій `seredyuk2077/Ukrainan-Lawyer-LLM-BETA` відображав ідею «юридичний застосунок + джерела», а не ще «агент з верифікацією, **orchestrator** і **memory outbox**».

## Навіщо гілка як історичний маркер

Ім’я `before-LawDatabase` навмисно фіксує **checkpoint** одразу перед фазою, де масштаб роботи змістився на важкий **law database** / **corpus** (індексація, узгодження джерел, довгі міграції даних). Це не «красивий тег», а зручна точка відкату та порівняння дифів, коли потрібно зрозуміти, *що саме* зламало шлях даних або UX після агресивної еволюції корпусу.

## До і після LawDatabase (ключові відмінності)

**До** інтенсивної фази **LawDatabase** домінували локальні покращення: **UI**, підключення **Rada API**, оновлення **DB** під поточні екрани. Після — проект набуває рис **data system**: багатошаровий **retrieval**, узгодження ідентифікаторів актів, вимоги до покриття та чесності щодо **coverage gap**, інструменти перевірки якості корпусу. У [[Lexery - Corpus Evolution]] саме цей перелом часто описується як перехід від «є база» до «база — операційний актив зі SLA на правду».

## Зв’язок з еволюцією ідеї та корпусу

- [[Lexery - Idea Evolution]] — *навіщо* продукт і який user promise; гілка показує момент, коли обіцянка ще була ближчою до «зручний доступ до норм», ніж до «агент з **[[Lexery - U11 Verify|U11 Verify]]** і **post-draft policy**».
- [[Lexery - Corpus Evolution]] — *з чого* складається довіра відповіді; після LawDatabase змінюються не лише таблиці, а й припущення всього downstream (**RAG**, **DocList**, **gate**).

## Хронологія (контекст)

Точну календарну дату краєвого коміту варто зчитувати з `git log` на гілці; для нотатки важливіше **порядок еволюції**: спочатку формується продуктовий каркас і джерела, потім — глибока робота з корпусом і правовим графом, далі — агентний **runtime** у монорепо **Lexery**. `before-LawDatabase` стоїть між «прикладний застосунок» і «інфраструктура права як платформа».

## See Also

- [[Lexery - Legacy Branch Families]]
- [[Lexery - Branch new-design-v3-final]]
- [[Lexery - Corpus Evolution]]
- [[Lexery - Idea Evolution]]
- [[Lexery - U1-U12 Runtime]]
