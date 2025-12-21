---
description: Project context and instructions for the Logo Font Matcher app
---

# Logo Font Matcher - Project Context

## Overview

This is a **Nuxt 4** application that helps users find the perfect font pairing for their logo. Users can:

- Upload a logo image
- Browse and select from 56 Google Fonts (organized by category)
- Preview their logo alongside text in different fonts
- Adjust font size and weight with sliders
- Press **spacebar** to randomly cycle through fonts

## Tech Stack

- **Framework**: Nuxt 4 (Vue 3 with Composition API)
- **Styling**: Tailwind CSS via `@nuxtjs/tailwindcss`
- **Fonts**: Google Fonts API (dynamically loaded)
- **Language**: TypeScript

## Project Structure

- `app/app.vue` - Main application component containing all UI and logic
- `public/logofont.svg` - App logo
- `nuxt.config.ts` - Nuxt configuration with Tailwind module

## Key Features

### Font Categories

Fonts are organized into 4 categories:

- **Sans-Serif** (30 fonts)
- **Serif** (12 fonts)
- **Display** (8 fonts)
- **Handwriting** (6 fonts)

### State Variables

- `previewText` - Text shown in the preview
- `selectedFont` - Currently selected font
- `uploadedLogo` - Base64 data URL of uploaded logo
- `fontSize` - Font size in pixels (16-120)
- `fontWeight` - Font weight (100-900)

### Key Functions

- `loadFont()` - Dynamically loads Google Font via stylesheet
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
4. Load Google Fonts dynamically with all weights (100-900)
5. Maintain the categorized font structure when adding new fonts
