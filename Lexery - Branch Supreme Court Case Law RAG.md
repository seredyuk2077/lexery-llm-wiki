---
aliases:
  - Branch Supreme Court Case Law RAG
tags:
  - lexery
  - history
created: 2026-04-09
updated: 2026-04-09
status: observed
layer: history
---

# Lexery - Branch Supreme Court Case Law RAG

## Branch Identity

- Repo:
  `seredyuk2077/Ukrainan-Lawyer-LLM-BETA`
- Branch:
  `feature/supreme-court-case-law-rag`

## What Actually Happens On This Branch

Despite the name, this branch becomes much larger than only Supreme Court retrieval.

## Main Eras Visible In Commit History

### Era 1 — inherited UI/database baseline

- design v3
- chat/UI improvements
- Rada API and DB updates
- legal database management

### Era 2 — architecture awakening

- `refresh legal agent architecture`
- documentation consolidation

### Era 3 — Supreme Court + legislation expansion

- `Supreme Court RAG integration`
- repository cleanup
- open data portal index

### Era 4 — DocList / legislation validation wave

- daily updater
- catalog cleanup
- validation phases
- root-fix campaigns for document types and applicability
- hard soak / batch import loops
- health and audit gates

### Era 5 — packaging as production infra

- final restructure
- standalone `Lexery Legislation DB Infra`
- completion summary

## Interpretation

- `Observed`:
  this branch is effectively a corpus-engineering mega-branch.
- `Inferred`:
  case-law exploration became part of a much broader legal data platform effort.

## Why It Matters To Current Lexery

The current LLDBI / DocList / retrieval worldview makes more sense once this branch is seen as one of its main ancestors.

## Що означає «Supreme Court Case Law» у цьому контексті

**Supreme Court Case Law** тут — не абстрактний «case law у світі», а конкретний задум зібрати та зробити пошуково-придатним корпус **постанов Верховного Суду України** (узагальнені практики, касаційні рішення, структуровані та неструктуровані джерела, залежно від етапу імпорту). Для продукту це **second corpus axis** поруч із **legislation**: норми задають рамку, судова практика — інтерпретаційний шар.

**Observed** у назві гілки `feature/supreme-court-case-law-rag` — намір будувати **RAG**, який вміє відповідати з опорою на судові позиції, а не лише на тексти актів. Це піднімає планку до **hybrid retrieval** (закон + практика), **metadata** для юрисдикції/категорії справи, і до дисципліни «не підміняти норму рішенням без явного маркування».

## Як це вплинуло на архітектуру retrieval

Експеримент з **case law** примусив раніше задуматись про:

- **chunking policy**, сумісну з довгими мотивувальними частинами;
- **source attribution** на рівні не лише «акт», а «рішення / постанова / номер справи»;
- **index hygiene**: дублікати, переклади, цитати в тексті;
- **evaluation**: бенчмарки на кшталт `docs/supreme_court_benchmark.md` як орієнтир якості.

Навіть коли основний прод-фокус змістився на **legislation** як на більш керований корпус, ці інженерні питання лишились у спадок: сучасний **Brain** і **LLDBI** мислять категоріями покриття, **gap**-ів і **health**-гейтів — логіка, яка вперше гостро проявилась на великих неоднорідних джерелах.

## Qdrant і сучасний legislation corpus (374 акти)

Паралельно з розширенням джерел зміцніла звичка тримати **vector index** окремо від **OLTP** бази: **Qdrant** як шар швидкого **similarity search** над **chunks**, тоді як **Supabase** зберігає канонічні записи документів і метадані імпорту.

У поточному стані Lexery **legislation corpus** часто описується орієнтиром **374 acts** (кількість може змінюватися з імпортами; важливий сам принцип **versioned catalog**). Зв’язок із гілкою **Supreme Court Case Law RAG** — історичний: саме епоха «багато типів джерел» підготувала інфраструктуру, яка потім обслуговує стабільніший **legislation**-фокус.

Детальніше про еволюцію даних див. [[Lexery - Corpus Evolution]] та [[Lexery - Retrieval, LLDBI, DocList]].

## Чому гілка ширша за свою назву

Назва вужча, ніж фактичний вміст комітів: поруч ідуть **UI baseline**, **architecture refresh**, **DocList** / **daily updater**, **validation** хвилі та пакування **Lexery Legislation DB Infra**. Тому **case law** тут читати як **spark**, а не як єдиний кінцевий продукт: вона запустила платформенне мислення про корпус, яке пережило зміну акцентів.

## See Also

- [[Lexery - Legacy Branch Families]]
- [[Lexery - Corpus Evolution]]
- [[Lexery - Retrieval, LLDBI, DocList]]
