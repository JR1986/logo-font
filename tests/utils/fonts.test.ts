import { describe, it, expect } from 'vitest'
import {
  buildFontCategories,
  buildFontSlugMap,
  buildFontCategoryMap,
  getAllFonts,
  DEFAULT_FONT,
  SYSTEM_FONTS
} from '~/utils/fonts'
import type { FontshareFont } from '~/types'

function makeFont(name: string, slug: string, category: string): FontshareFont {
  return { name, slug, category, styles: [], is_hot: false, is_top: false, views: 0 }
}

const sampleFonts: FontshareFont[] = [
  makeFont('Satoshi', 'satoshi', 'Sans'),
  makeFont('Sentient', 'sentient', 'Serif'),
  makeFont('Clash Display', 'clash-display', 'Display'),
  makeFont('Bonkers', 'bonkers', 'Blackletter'),
  makeFont('Duo Tone', 'duo-tone', 'Sans, Display'),
  makeFont('Scribble', 'scribble', 'Handwritten')
]

describe('utils/fonts', () => {
  it('exports sensible defaults', () => {
    expect(DEFAULT_FONT).toBe('Satoshi')
    expect(SYSTEM_FONTS).toContain('Arial')
  })

  describe('buildFontCategories', () => {
    it('groups fonts by mapped category', () => {
      const categories = buildFontCategories(sampleFonts)

      expect(categories['Sans']).toContain('Satoshi')
      expect(categories['Serif']).toContain('Sentient')
      expect(categories['Display']).toContain('Clash Display')
      expect(categories['Handwritten']).toContain('Scribble')
    })

    it('maps blackletter to Display', () => {
      const categories = buildFontCategories(sampleFonts)
      expect(categories['Display']).toContain('Bonkers')
    })

    it('uses the first category when comma-separated', () => {
      const categories = buildFontCategories(sampleFonts)
      expect(categories['Sans']).toContain('Duo Tone')
      expect(categories['Display']).not.toContain('Duo Tone')
    })

    it('adds curated fonts to Popular', () => {
      const categories = buildFontCategories(sampleFonts)
      expect(categories['Popular']).toContain('Satoshi')
      expect(categories['Popular']).toContain('Clash Display')
      expect(categories['Popular']).not.toContain('Bonkers')
    })
  })

  describe('buildFontSlugMap', () => {
    it('builds bidirectional lookup maps', () => {
      const { nameToSlug, slugToName } = buildFontSlugMap(sampleFonts)

      expect(nameToSlug.get('Clash Display')).toBe('clash-display')
      expect(slugToName.get('clash-display')).toBe('Clash Display')
    })
  })

  describe('buildFontCategoryMap', () => {
    it('maps each font name to its category', () => {
      const map = buildFontCategoryMap(sampleFonts)

      expect(map.get('Satoshi')).toBe('Sans')
      expect(map.get('Sentient')).toBe('Serif')
      expect(map.get('Bonkers')).toBe('Display')
    })
  })

  describe('getAllFonts', () => {
    it('returns a deduplicated flat list', () => {
      const categories = buildFontCategories(sampleFonts)
      const fonts = getAllFonts(categories)

      // Satoshi appears in both Popular and Sans but should be listed once
      expect(fonts.filter(f => f === 'Satoshi')).toHaveLength(1)
      expect(fonts).toContain('Sentient')
      expect(fonts.length).toBe(sampleFonts.length)
    })
  })
})
