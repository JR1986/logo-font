import type { FontCategories, FontCategory, FontshareFont, FontshareApiResponse } from '~/types'

/**
 * Fontshare API endpoint
 */
const FONTSHARE_API_URL = 'https://api.fontshare.com/v2/fonts'

/**
 * Map Fontshare API category strings to our FontCategory type.
 * Some fonts have comma-separated categories (e.g. "Sans, Display") — we take the first.
 */
function mapCategory(apiCategory: string): FontCategory {
  const primary = apiCategory.split(',')[0]!.trim().toLowerCase()
  
  const mapping: Record<string, FontCategory> = {
    'sans': 'Sans',
    'serif': 'Serif',
    'display': 'Display',
    'handwritten': 'Handwritten',
    'mono': 'Mono',
    'blackletter': 'Display',
  }

  return mapping[primary] ?? 'Display'
}

/**
 * Curated list of popular Fontshare fonts (by slug) for the "Popular" category.
 * These are the most-used and highest quality Fontshare fonts.
 */
const POPULAR_SLUGS = new Set([
  'satoshi',
  'general-sans',
  'clash-display',
  'cabinet-grotesk',
  'switzer',
  'clash-grotesk',
  'supreme',
  'zodiak',
  'sentient',
  'panchang',
  'ranade',
  'boska',
  'tanker',
  'gambetta',
  'melodrama',
  'array',
  'chillax',
])

/**
 * Default font settings
 */
export const DEFAULT_FONT = 'Satoshi'
export const DEFAULT_FONT_SIZE = 48
export const DEFAULT_FONT_WEIGHT = 400

/**
 * Fetches the complete Fontshare font catalog from the API.
 */
export async function fetchFontshareFonts(): Promise<FontshareFont[]> {
  const response = await fetch(`${FONTSHARE_API_URL}?limit=100&offset=0`)
  if (!response.ok) {
    throw new Error(`Fontshare API error: ${response.status}`)
  }
  const data: FontshareApiResponse = await response.json()
  return data.fonts
}

/**
 * Builds categorised font lists from raw Fontshare API data.
 */
export function buildFontCategories(fonts: FontshareFont[]): FontCategories {
  const categories: FontCategories = {
    'Popular': [],
    'Sans': [],
    'Serif': [],
    'Display': [],
    'Handwritten': [],
    'Mono': [],
    'Installed': [],
  }

  for (const font of fonts) {
    const category = mapCategory(font.category)
    categories[category].push(font.name)

    if (POPULAR_SLUGS.has(font.slug)) {
      categories['Popular'].push(font.name)
    }
  }

  // Sort each category alphabetically
  for (const key of Object.keys(categories) as FontCategory[]) {
    categories[key].sort()
  }

  return categories
}

/**
 * Builds slug → font name and font name → slug lookup maps.
 */
export function buildFontSlugMap(fonts: FontshareFont[]): {
  nameToSlug: Map<string, string>
  slugToName: Map<string, string>
} {
  const nameToSlug = new Map<string, string>()
  const slugToName = new Map<string, string>()

  for (const font of fonts) {
    nameToSlug.set(font.name, font.slug)
    slugToName.set(font.slug, font.name)
  }

  return { nameToSlug, slugToName }
}

/**
 * Builds a font name → category lookup map.
 */
export function buildFontCategoryMap(fonts: FontshareFont[]): Map<string, FontCategory> {
  const map = new Map<string, FontCategory>()
  for (const font of fonts) {
    map.set(font.name, mapCategory(font.category))
  }
  return map
}

/**
 * Get flat array of all font names
 */
export function getAllFonts(categories: FontCategories): string[] {
  // Deduplicate — a font can appear in both "Popular" and its primary category
  return [...new Set(Object.values(categories).flat())]
}

/**
 * Pre-built O(1) font → category lookup map.
 * Use this instead of getFontCategory() in hot paths.
 * NOTE: This is now empty at init and should be populated dynamically.
 */
export const FONT_CATEGORY_MAP: Record<string, FontCategory> = {}

/**
 * Standard System Fonts (for skipping Fontshare loading)
 */
export const SYSTEM_FONTS = [
  'Arial',
  'Helvetica',
  'Verdana',
  'Georgia',
  'Garamond',
  'Trebuchet MS',
]

/**
 * Empty initial categories (populated after API fetch)
 */
export const FONT_CATEGORIES: FontCategories = {
  'Popular': [],
  'Sans': [],
  'Serif': [],
  'Display': [],
  'Handwritten': [],
  'Mono': [],
  'Installed': [],
}
