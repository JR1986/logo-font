import { describe, it, expect } from 'vitest'
import { getAllFonts, getFontCategory, FONT_CATEGORIES, DEFAULT_FONT } from '~/utils/fonts'

describe('utils/fonts', () => {
  it('should export font categories', () => {
    expect(FONT_CATEGORIES).toBeDefined()
    expect(Object.keys(FONT_CATEGORIES).length).toBeGreaterThan(0)
  })

  it('getAllFonts should return an array of font names', () => {
    const fonts = getAllFonts()
    expect(Array.isArray(fonts)).toBe(true)
    expect(fonts.length).toBeGreaterThan(0)
    expect(fonts).toContain(DEFAULT_FONT)
  })

  it('getFontCategory should return correct category for known font', () => {
    const category = getFontCategory('Roboto')
    expect(category).toBe('Sans-Serif')
  })

  it('getFontCategory should return null for unknown font', () => {
    const category = getFontCategory('Unknown Font')
    expect(category).toBeNull()
  })
})
