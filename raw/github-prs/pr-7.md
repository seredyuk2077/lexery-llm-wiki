# PR #7: [Frontend] feat: auth pages

- **Author:** alexbach093
- **Branch:** {Frontend}-chore/auth → dev
- **Created:** 2026-04-04
- **State:** MERGED

## Description

(none)

## Files (71)

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
- `apps/portal/auth/components/auth/screens/AuthChoiceScreen.tsx` (+83 -0)
- `apps/portal/auth/components/auth/screens/EmailCodeScreen.tsx` (+119 -0)
- `apps/portal/auth/components/auth/screens/PhoneCodeScreen.tsx` (+126 -0)
- `apps/portal/auth/components/auth/screens/PhoneNumberScreen.tsx` (+64 -0)
- `apps/portal/auth/components/icons/google-icon.tsx` (+16 -0)
- `apps/portal/auth/components/icons/microsoft-icon.tsx` (+42 -0)
- `apps/portal/auth/docs/CODEX_LEXERY_GUARDRAIL_PROMPT.md` (+40 -0)
- `apps/portal/auth/docs/FIGMA_SOURCE.md` (+22 -0)
- `apps/portal/auth/docs/REVIEW_WORKFLOW.md` (+17 -0)
- `apps/portal/auth/docs/ROUTE_MAP.md` (+14 -0)

## Commits (6)

- `666219a` chore(auth): build auth design flow scaffold
- `aa4d39b` Merge branch '{Frontend}-chore/auth' of https://github.com/lexeryAI/L…
- `f79645e` Add seamless display-name onboarding transition
- `1e88f0b` Refine auth onboarding and system instructions flow
- `6d2c1f1` Merge origin/dev into {Frontend}-chore/auth
- `7da2611` refactor(portal): move auth into portal module
