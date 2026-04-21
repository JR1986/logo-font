---
description: Project context and instructions for the Logo Font Matcher app
---

# Logo Font Matcher - Project Context

## Overview

This is a **Nuxt 4** application that helps users find the perfect font pairing for their logo. Users can:

- Upload a logo image
- Browse and select from 100 Fontshare fonts (organized by category)
- Preview their logo alongside text in different fonts
- Adjust font size and weight with sliders
- Press **spacebar** to randomly cycle through fonts

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3 with Composition API)
- **Styling**: Tailwind CSS via `@nuxtjs/tailwindcss`
- **Fonts**: Fontshare API (dynamically loaded from api.fontshare.com)
- **Language**: TypeScript

## Project Structure

- `app/app.vue` - Main application component containing all UI and logic
- `public/logofont.svg` - App logo
- `nuxt.config.ts` - Nuxt configuration with Tailwind module

## Key Features

### Font Categories

Fonts are organized into 5 categories (fetched from Fontshare API):

- **Popular** (curated selection of top Fontshare fonts)
- **Sans** (sans-serif fonts)
- **Serif** (serif fonts)
- **Display** (display/decorative fonts)
- **Handwritten** (handwriting fonts)

### State Variables

- `previewText` - Text shown in the preview
- `selectedFont` - Currently selected font
- `uploadedLogo` - Base64 data URL of uploaded logo
- `fontSize` - Font size in pixels (16-120)
- `fontWeight` - Font weight (100-900)

### Key Functions

- `loadFont()` - Dynamically loads Fontshare font via CSS API stylesheet
- `fetchFonts()` - Fetches font catalog from Fontshare API
- `selectRandomFont()` - Randomly selects a different font (triggered by spacebar)
- `processFile()` - Handles logo upload via FileReader

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Coding Guidelines

1. Use Vue 3 Composition API with `<script setup lang="ts">`
2. Use Tailwind CSS for styling
3. Follow clean code principles e.g. split up files in to multiple components, composables, utils etc.
4. Load Fontshare fonts dynamically via `api.fontshare.com/v2/css` endpoint
5. Maintain the categorized font structure when adding new fonts

### Unit tests

1. Write unit test with vitest and Vue Test Utils.
2. For components, start unit tests always with beforeEach with inside a mount or shallowMount to give the test initial settings. Update after is per test case the settings. Try to mount once in the beforeEach. If not possible then do it twice or more if it makes the test better to work with.
3. if Pinia is used, set initial state inside the beforeEach via the createTestingPina plugin.
4. Follow unit test best practices
5. Place unit test files in the same file as the source code.
