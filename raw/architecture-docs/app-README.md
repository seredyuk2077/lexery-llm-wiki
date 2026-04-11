# Lexery Legal Agent — Implementation Architecture

Опис реалізації архітектури Agent Brain по етапах.

## Етапи

| Етап                  | Папка                            | Ключові документи                                                                                                                                                                         | Статус                                                               |
| --------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| U1 Gateway/Intake     | [u1/](./u1/)                     | [README](./u1/README.md), [gateway.md](./u1/gateway.md), [test-results](./u1/test-results.md), [decisions/](./u1/decisions/)                                                              | ✅ Реалізовано                                                        |
| U2 Query Profiling    | [u2/](./u2/)                     | [README](./u2/README.md), [pipeline.md](./u2/pipeline.md), [test-results](./u2/test-results.md), [checklist](./u2/ARCHITECTURE_COMPLIANCE_CHECKLIST_V3.md), [decisions/](./u2/decisions/) | ✅ Реалізовано                                                        |
| U3 Plan + U3a Builder | [u3/](./u3/)                     | [README](./u3/README.md), [decisions/schema-search-plan](./u3/decisions/schema-search-plan.md)                                                                                            | ✅ Live consumer + active plan-shape hardening                        |
| U4 CacheRAG           | [u4/](./u4/)                     | [README](./u4/README.md), [pipeline.md](./u4/pipeline.md), [test-results](./u4/test-results.md), [decisions/](./u4/decisions/)                                                            | ✅ Реалізовано, active retrieval hardening + optional semantic memory |
| U5 Gate               | [u5/](./u5/)                     | [README](./u5/README.md), [pipeline.md](./u5/pipeline.md), [decisions/](./u5/decisions/)                                                                                                  | ✅ Реалізовано                                                        |
| ORCH                  | [orchestrator/](./orchestrator/) | [README](./orchestrator/README.md)                                                                                                                                                        | ✅ Bounded top-level orchestration live                               |
| U6 Expand / Recovery  | [u6/](./u6/)                     | [README](./u6/README.md)                                                                                                                                                                  | ✅ Реальний recovery stage live                                       |
| U7 Evidence Assembly  | [u7/](./u7/)                     | [README](./u7/README.md)                                                                                                                                                                  | ✅ Explicit evidence assembly live                                    |
| U8 Legal Reasoning    | [u8/](./u8/)                     | [README](./u8/README.md)                                                                                                                                                                  | ✅ Explicit legal reasoning live                                      |
| U9 Assemble           | [u9/](./u9/)                     | [README](./u9/README.md), [pipeline.md](./u9/pipeline.md), [verification.md](./u9/verification.md), [decisions/](./u9/decisions/)                                                         | ✅ Реалізовано, триває стабілізація                                   |
| U10 Legal Agent       | [u10/](./u10/)                   | [README](./u10/README.md), [pipeline.md](./u10/pipeline.md), [verification.md](./u10/verification.md), [reports/](./u10/reports/README.md), [decisions/](./u10/decisions/)                | ✅ Реалізовано, якість відповіді ще полірується                       |
| U11 Verify            | [u11/](./u11/)                   | [README](./u11/README.md), [pipeline.md](./u11/pipeline.md), [decisions/](./u11/decisions/)                                                                                               | ✅ Durable scaffold live                                              |
| U12 Deliver           | [u12/](./u12/)                   | [README](./u12/README.md), [pipeline.md](./u12/pipeline.md), [decisions/](./u12/decisions/)                                                                                               | ✅ Durable deliver path live                                          |
| MM Memory / MM Docs   | [mm/](./mm/)                     | [README](./mm/README.md), [memory-pipeline](./mm/memory-pipeline.md), [verification](./mm/verification.md), [reports/](./mm/reports/README.md)                                            | ✅ Live, active hardening                                             |
| Context / recovery    | [context/](./context/)           | [README](./context/README.md), [CURRENT_PIPELINE_STATE](./context/CURRENT_PIPELINE_STATE.md), recovery docs, [reports/](./context/reports/README.md)                                      | 🔶 Support / recovery notes                                          |

## Загальний pipeline U1→U12 + MM

Єдине джерело правди щодо кроків і збереження даних: [PIPELINE_U1_U2.md](./PIPELINE_U1_U2.md).

Evidence Search (U3–U9): контракти та U2→U3 enqueue — Wave 1 (LEX-104…110). Деталі: [EVIDENCE_SEARCH_WHATS_REAL.md](./EVIDENCE_SEARCH_WHATS_REAL.md).

Починаючи з bounded agentivity upgrade, `ORCH`, `U6`, `U7`, `U8` мають окремі canonical folders у `docs/architecture/app/`. Це прибирає старий documentation gap між live runtime і app-architecture tree.

Станом на 9 квітня 2026 live runtime також має справжній bounded recovery rerun contract:
- `U6` пише `retrieval_retry_request.pending=true`
- executive state маскує stale `U7/U8/U9/U10/U11` artifacts, поки retry pending
- `ORCH` зобов'язаний повернутись у `RUN_U4` перед повторним evidence/reasoning cycle
- це закриває стару помилку, де recovery виглядав agentic, але фактично міг міркувати по старому retrieval state

Станом на вечір 9 квітня 2026 live runtime також має дешевший deterministic control loop:
- built-in bounded canary більше не платить `gpt-5.2` за очевидні branch points типу `RUN_U12` або `RUN_U6 vs RUN_U7`
- `U11 -> U12` тепер іде напряму для `verify_result.verdict=complete`, без зайвого ORCH round-trip
- clarification-resume для сильного `AMBIGUOUS_ACT_MATCH` тепер може відновлюватись із `U7`, а не завжди через повторний `U4/U5`
- law-only `U9` turns без doc cues більше не роблять зайвий MM Docs availability probe

Поточний live dispatch у runtime:
- ORCH -> `orchestrator/consumer.ts`
- U6 -> `expand/consumer.ts`
- U7 -> `evidence/consumer.ts`
- U8 -> `reasoning/consumer.ts`
- U9 -> `assemble/consumer.ts`
- U10 -> `write/consumer.ts`
- U11 -> `write/verifyConsumer.ts`
- U12 -> `write/deliverConsumer.ts`
- root `verify/` і `deliver/` папки поки лишаються placeholder-структурою для майбутнього split
