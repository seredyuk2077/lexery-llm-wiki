# Lexery Monorepo Package Snapshot — 2026-04-09

## Workspace
- Manager: pnpm (workspace: apps/*, packages/*)
- Root: `lexery-monorepo`
- Build: Turbo

## Packages

| Package | Path | Type | Description |
|---------|------|------|-------------|
| @lexery/brain | apps/brain | App | Legal Agent Brain: HTTP server, U1-U12 pipeline, retrieval, MM/MM Docs, ORCH |
| @lexery/lldbi | apps/lldbi | App | LLDBI admin CLI: Qdrant/R2/Supabase legislation operations; brain-admin batch |
| @lexery/api | apps/api | App | NestJS backend (Prisma, Supabase auth, S3 storage) |
| @lexery/portal | apps/portal | App | Next.js frontend (React 19, shadcn-ui) |
| @lexery/doclist-updater-db | apps/doclist-updater-db | App | Daily DocListDB incremental updater (Rada → embeddings → Qdrant; R2 state) |
| @lexery/doclist-full-import | apps/doclist-full-import | App | Full DocList catalog importer into Qdrant |
| @lexery/doclist-resolver-api | apps/doclist-resolver-api | App | Cloudflare Worker: act resolution via Qdrant on catalog |
| @lexery/typescript-config | packages/config/typescript | Config | Shared TypeScript config |

## CI/CD
- Single workflow: `.github/workflows/lldbi-brain-admin.yml`
- Weekly cron (Monday 04:15 UTC) + manual dispatch
- Steps: brain-admin → process-approved-proposals → upload artifacts

## Testing
- 61 test files under `apps/brain/tools/`
- Naming: `test_*_units.ts` (unit), `stress_test_*.ts` (load), `verify_*.ts` (live check)
- Scripts: `pnpm brain:test:*` / `pnpm brain:verify:*`
