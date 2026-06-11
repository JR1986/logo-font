import { describe, it, expect } from 'vitest'
import {
  getAllFonts,
  buildFontCategories,
  buildFontSlugMap,
  buildFontCategoryMap,
  FONT_CATEGORIES,
  DEFAULT_FONT,
} from '~/utils/fonts'
import type { FontshareFont } from '~/types'

// Minimal Fontshare-shaped sample data
const sampleFonts: FontshareFont[] = [
  { name: 'Satoshi', slug: 'satoshi', category: 'Sans', styles: [], is_hot: false, is_top: false, views: 0 },
  { name: 'Zodiak', slug: 'zodiak', category: 'Serif', styles: [], is_hot: false, is_top: false, views: 0 },
  { name: 'Clash Display', slug: 'clash-display', category: 'Display', styles: [], is_hot: false, is_top: false, views: 0 },
  { name: 'Comico', slug: 'comico', category: 'Handwritten', styles: [], is_hot: false, is_top: false, views: 0 },
]

describe('utils/fonts', () => {
  it('should export font categories with the expected keys', () => {
    expect(FONT_CATEGORIES).toBeDefined()
    expect(Object.keys(FONT_CATEGORIES)).toEqual(
      expect.arrayContaining(['Popular', 'Sans', 'Serif', 'Display', 'Handwritten', 'Mono', 'Installed'])
    )
  })

  it('DEFAULT_FONT should be Satoshi', () => {
    expect(DEFAULT_FONT).toBe('Satoshi')
  })

  it('buildFontCategories sorts fonts into their categories', () => {
    const categories = buildFontCategories(sampleFonts)
    expect(categories.Sans).toContain('Satoshi')
    expect(categories.Serif).toContain('Zodiak')
    expect(categories.Display).toContain('Clash Display')
    expect(categories.Handwritten).toContain('Comico')
  })

  it('buildFontCategories adds curated fonts to Popular', () => {
    const categories = buildFontCategories(sampleFonts)
    // 'satoshi', 'zodiak' and 'clash-display' are in the curated POPULAR_SLUGS set
    expect(categories.Popular).toEqual(expect.arrayContaining(['Satoshi', 'Zodiak', 'Clash Display']))
    // 'comico' is not curated
    expect(categories.Popular).not.toContain('Comico')
  })

  it('getAllFonts returns a deduplicated array of font names', () => {
    const categories = buildFontCategories(sampleFonts)
    const fonts = getAllFonts(categories)
    expect(Array.isArray(fonts)).toBe(true)
    // A font in both Popular and its primary category should appear once
    expect(fonts.filter(f => f === 'Satoshi')).toHaveLength(1)
    expect(fonts).toContain('Satoshi')
  })

  it('buildFontSlugMap maps names to slugs and back', () => {
    const { nameToSlug, slugToName } = buildFontSlugMap(sampleFonts)
    expect(nameToSlug.get('Satoshi')).toBe('satoshi')
    expect(slugToName.get('clash-display')).toBe('Clash Display')
  })

  it('buildFontCategoryMap returns the category for a known font', () => {
    const map = buildFontCategoryMap(sampleFonts)
    expect(map.get('Satoshi')).toBe('Sans')
    expect(map.get('Zodiak')).toBe('Serif')
    expect(map.get('Unknown Font')).toBeUndefined()
  })
})
