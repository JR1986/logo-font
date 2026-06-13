# logofont.

Find the font that fits your logo mark.

Drop in your logo, type your brand name, and shuffle through the [Fontshare](https://www.fontshare.com) catalog until the wordmark clicks. Built with Nuxt 4, Vue 3 and Tailwind CSS.

## How it works

- **Type on the canvas** — the wordmark is edited inline, right where you see it.
- **`space`** shuffles to a random font, **`←` / `→`** walk back and forth through everything you tried.
- **Browse fonts** from the dock — every font renders *your* brand name as a live specimen (lazy-loaded as you scroll).
- **`S`** (or the heart) saves a match. Saved matches persist in `localStorage` and live in the side drawer — click one to load it back into the editor.
- **Tune** size, weight, letter spacing, wordmark color, canvas (light/dark) and layout (logo beside or above the text).
- **Export** from the header: copy SVG (`C`), download SVG / PNG, or generate a `DESIGN.md` brand sheet with the full type spec, colors, CSS snippet and Fontshare embed link.
- **My fonts** — load locally installed fonts via the Local Font Access API (Chromium browsers).

## Setup

```bash
npm install
```

## Development

```bash
npm run dev      # start dev server on http://localhost:3000
npm test         # run the vitest suite
```

## Production

```bash
npm run build    # build for production
npm run preview  # preview the production build
```
