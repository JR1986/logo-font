---
description: Project context and instructions for the logofont app
---

# logofont — Project Context

## Overview

This is a **Nuxt 4** application that helps users find the perfect font for their logo mark. The UX is modeled on coolors.co: one immersive canvas, a floating dock of controls, and fast keyboard-driven iteration.

Users can:

- Upload a logo (click the tile or drop a file anywhere on the canvas)
- Type the brand name directly on the canvas (inline `contenteditable` wordmark)
- Press **spacebar** to shuffle fonts, **← / →** to travel through font history
- Browse ~100 Fontshare fonts with live specimens (lazy-loaded per row via IntersectionObserver)
- Save matches (**S** or the heart) — persisted to `localStorage`, listed in a side drawer, click to re-load
- Tune size / weight / letter spacing / wordmark color / canvas (light/dark) / layout direction
- Export: copy SVG (**C**), download SVG, download PNG (canvas raster), download a `DESIGN.md` brand sheet
- Load locally installed fonts (Local Font Access API)

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3 Composition API, TypeScript)
- **Styling**: Tailwind CSS via `@nuxtjs/tailwindcss` + `@nuxtjs/color-mode` (class-based dark mode)
- **Fonts**: Fontshare API (`api.fontshare.com/v2/fonts` catalog, `/v2/css` for stylesheets)
- **Tests**: Vitest + Vue Test Utils (runs in both happy-dom and nuxt environments)

## Design language

Editorial "fontpair" aesthetic, defined in `tailwind.config.ts`:

- Colors: `paper` (#F4F2EC) / `cream` surfaces, `ink` (#141413) text, `sun` (#FFC700) primary accent, `coral` (#FF5436) for save/destructive accents
- UI fonts: **Satoshi** (sans) + **Sentient** (serif italic accents), loaded from Fontshare in `nuxt.config.ts`
- Dot-grid canvas, rounded-2xl surfaces, `shadow-dock`/`shadow-card`/`shadow-pop` elevations
- Dark mode mirrors the palette on `stone-950`

## Project Structure

- `app/app.vue` — orchestrator: state, font history (←/→), keyboard shortcuts, toasts, export handling, first-visit hint
- `app/components/AppHeader.vue` — slim header: logo, theme toggle, saved-drawer button, ExportMenu
- `app/components/ExportMenu.vue` — export popover (copy SVG / SVG / PNG / DESIGN.md), emits `select`
- `app/components/PreviewArea.vue` — canvas content: logo tile (upload/replace/remove), inline-editable wordmark, font chip with Fontshare link
- `app/components/BottomDock.vue` — floating dock: font button, tune/color popovers, canvas + direction toggles, history, shuffle, save
- `app/components/FontPanel.vue` — font browser: search, category pills, live specimens (lazy font loading), local-fonts button
- `app/components/SavedDrawer.vue` — right drawer over the app; apply/copy/delete saved matches
- `app/composables/useGoogleFonts.ts` — Fontshare catalog state (name kept for backwards compatibility)
- `app/composables/useMatches.ts` — saved matches with explicit `localStorage` persistence (`logofont:matches`)
- `app/composables/useKeyboardShortcuts.ts` — global shortcuts; skips inputs and `contenteditable`
- `app/composables/useLogoUpload.ts` — logo file handling (used by app.vue for full-canvas drop)
- `app/utils/fonts.ts` — Fontshare API fetch + category/slug map builders
- `app/utils/svg.ts` — SVG wordmark generation (horizontal + vertical layouts)
- `app/utils/exporters.ts` — DESIGN.md brand sheet, PNG rasterisation, file downloads

## Keyboard shortcuts

`space` shuffle · `←`/`→` history · `S` save/unsave · `C` copy SVG · `Esc` close drawer

## Gotchas

- `useMatches` persistence is **explicit** (`persist()` inside `saveMatch`/`removeMatch`). Do not convert it to a `watch` registered during component setup — the watcher dies with the registering component's effect scope.
- `FontPanel` creates its IntersectionObserver lazily in the row `:ref` callback because `:ref` callbacks fire **before** `onMounted`.
- The contenteditable wordmark in `PreviewArea` is intentionally not bound to `{{ text }}` — re-rendering on each keystroke would reset the caret. It syncs via `watch` only when the prop diverges from the DOM.
- `selectRandomFont` dedupes the flattened category list ("Popular" duplicates fonts from their primary category) so shuffle always lands on a different font.
- Saved-match logos are data URLs; on `localStorage` quota errors persistence retries with logos stripped.

## Development Commands

```bash
npm run dev      # start dev server
npm test         # vitest
npm run build    # production build
npm run preview  # preview production build
```

## Coding Guidelines

1. Use Vue 3 Composition API with `<script setup lang="ts">`
2. Use Tailwind CSS for styling; use the design tokens above (paper/ink/sun/coral), not raw zinc/indigo
3. Follow clean code principles — split into components, composables, utils
4. Load Fontshare fonts dynamically via the `api.fontshare.com/v2/css` endpoint
5. Maintain the categorized font structure (Popular / Sans / Serif / Display / Handwritten / Mono / Installed)

### Unit tests

1. Write unit tests with Vitest and Vue Test Utils, in `tests/` mirroring the source layout
2. For components, mount once in a `beforeEach` with default props; override per test case when needed
3. Components under test should not rely on Nuxt auto-imports (import children explicitly, mock `~/composables/*` where needed)
4. Tests run in both `happy-dom` and `nuxt` environments — keep them environment-agnostic (guard browser-only APIs)
