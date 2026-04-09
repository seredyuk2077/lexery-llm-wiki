# PR #7: [Frontend] feat: auth pages

- **Author:** alexbach093
- **Branch:** {Frontend}-chore/auth → dev
- **Created:** 2026-04-04
- **Closed:** 2026-04-05
- **State:** MERGED

## Description

(no description)

## Files Changed (71)

- `apps/portal/app/(dev)/boot-error/page.tsx` (+0 -0)
- `apps/portal/app/(workspace)/layout.tsx` (+25 -20)
- `apps/portal/app/(workspace)/settings/[section]/page.tsx` (+0 -0)
- `apps/portal/app/(workspace)/settings/page.tsx` (+0 -0)
- `apps/portal/app/(workspace)/workspace/chats/[chatId]/page.tsx` (+0 -0)
- `apps/portal/app/(workspace)/workspace/page.tsx` (+22 -0)
- `apps/portal/app/api/chat/route.ts` (+0 -0)
- `apps/portal/app/api/chat/stream/route.ts` (+0 -0)
- `apps/portal/app/auth/email-code/error/page.tsx` (+1 -0)
- `apps/portal/app/auth/email-code/page.tsx` (+1 -0)
- `apps/portal/app/auth/layout.tsx` (+7 -0)
- `apps/portal/app/auth/page.tsx` (+1 -0)
- `apps/portal/app/auth/phone-code/error/page.tsx` (+1 -0)
- `apps/portal/app/auth/phone-code/page.tsx` (+1 -0)
- `apps/portal/app/auth/phone-number/page.tsx` (+1 -0)
- `apps/portal/app/favicon.ico` (+0 -0)
- `apps/portal/app/globals.css` (+0 -28)
- `apps/portal/app/layout.tsx` (+0 -0)
- `apps/portal/app/page.tsx` (+1 -2)
- `apps/portal/auth/README.md` (+40 -0)
- `apps/portal/auth/components/auth/AuthBackground.tsx` (+18 -0)
- `apps/portal/auth/components/auth/AuthCard.tsx` (+14 -0)
- `apps/portal/auth/components/auth/AuthEmailInput.tsx` (+30 -0)
- `apps/portal/auth/components/auth/AuthOtpRow.tsx` (+186 -0)
- `apps/portal/auth/components/auth/AuthPhoneInput.tsx` (+82 -0)
- `apps/portal/auth/components/auth/AuthPrimaryButton.tsx` (+20 -0)
- `apps/portal/auth/components/auth/AuthResendRow.tsx` (+80 -0)
- `apps/portal/auth/components/auth/AuthScaffold.tsx` (+15 -0)
- `apps/portal/auth/components/auth/AuthScrollLock.tsx` (+73 -0)
- `apps/portal/auth/components/auth/AuthSecondaryButton.tsx` (+16 -0)

## Commits (6)

- `666219a` chore(auth): build auth design flow scaffold
- `aa4d39b` Merge branch '{Frontend}-chore/auth' of https://github.com/lexeryAI/L…
- `f79645e` Add seamless display-name onboarding transition
- `1e88f0b` Refine auth onboarding and system instructions flow
- `6d2c1f1` Merge origin/dev into {Frontend}-chore/auth
- `7da2611` refactor(portal): move auth into portal module
