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

# Lexery - Portal Surface Map

## What This Page Is

A more concrete inventory of the current `apps/portal` surface.

## Top-Level Product Areas

- workspace layout
- chat
- attachments
- sidebar/history
- settings
- search overlay
- boot/loading/error states
- server-side chat routes

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

## Product Reading

- `Observed`:
  portal is already a rich workspace shell, not a landing page or placeholder.
- `Observed`:
  it combines local product state, UI composition, and server-side AI route logic.
- `Inferred`:
  this portal is the current user-visible half of the product that must eventually converge with Brain runtime more tightly.

## See Also

- [[Lexery - Product Surface]]
- [[Lexery - Frontend and Brand Evolution]]
- [[Lexery - API and Control Plane]]
