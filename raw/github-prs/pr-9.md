# PR #9: [Frontend] feat: add infra for email/sms/oauth registration

- **Author:** puhachyeser
- **Branch:** feat/auth-infrastructure → dev
- **Created:** 2026-04-07
- **State:** OPEN

## Description

(none)

## Files (15)

- `apps/portal/app/auth/callback/route.ts` (+41 -0)
- `apps/portal/package.json` (+3 -1)
- `apps/portal/src/components/auth/AuthOtpRow.tsx` (+1 -1)
- `apps/portal/src/components/auth/AuthPhoneInput.tsx` (+18 -16)
- `apps/portal/src/components/auth/AuthResendRow.tsx` (+1 -1)
- `apps/portal/src/components/auth/AuthSecondaryButton.tsx` (+14 -5)
- `apps/portal/src/components/auth/screens/AuthChoiceScreen.tsx` (+62 -10)
- `apps/portal/src/components/auth/screens/EmailCodeScreen.tsx` (+30 -17)
- `apps/portal/src/components/auth/screens/PhoneCodeScreen.tsx` (+25 -9)
- `apps/portal/src/components/auth/screens/PhoneNumberScreen.tsx` (+41 -11)
- `apps/portal/src/components/ui/WorkspaceSidebar.tsx` (+56 -14)
- `apps/portal/src/components/workspace/WorkspaceScreen.tsx` (+44 -8)
- `apps/portal/src/lib/display-name.ts` (+14 -0)
- `apps/portal/src/lib/supabase/client.ts` (+14 -0)
- `pnpm-lock.yaml` (+78 -0)

## Commits (2)

- `ba97669` feat: add infra for email/sms/oauth registration
- `4a65ec7` feat: add real name/avatar data requests from supabase instead of mocks
