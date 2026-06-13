import { describe, it, expect } from 'vitest'
import { generateDesignMd, slugifyFilename, CANVAS_COLORS } from '~/utils/exporters'
import type { BrandKitOptions } from '~/utils/exporters'

const baseOptions: BrandKitOptions = {
  logo: null,
  text: 'Acme Studio',
  font: 'Satoshi',
  fontSize: 48,
  fontWeight: 700,
  letterSpacing: 2,
  fontColor: '#141413',
  fontCategory: 'Sans',
  fontSlug: 'satoshi',
  previewBg: 'white',
  direction: 'horizontal'
}

describe('utils/exporters', () => {
  describe('slugifyFilename', () => {
    it('kebab-cases arbitrary text', () => {
      expect(slugifyFilename('My Brand! Co.')).toBe('my-brand-co')
    })

    it('falls back when nothing remains', () => {
      expect(slugifyFilename('???')).toBe('logofont')
      expect(slugifyFilename('')).toBe('logofont')
    })
  })

  describe('generateDesignMd', () => {
    it('includes the brand name as title', () => {
      const md = generateDesignMd(baseOptions)
      expect(md).toContain('# Acme Studio — Design Sheet')
    })

    it('documents the full typography spec', () => {
      const md = generateDesignMd(baseOptions)

      expect(md).toContain('| Typeface | Satoshi |')
      expect(md).toContain('| Category | Sans |')
      expect(md).toContain('| Weight | 700 |')
      expect(md).toContain('| Size | 48px |')
      expect(md).toContain('| Letter spacing | 2px |')
    })

    it('links to Fontshare and includes the embed snippet', () => {
      const md = generateDesignMd(baseOptions)

      expect(md).toContain('https://www.fontshare.com/fonts/satoshi')
      expect(md).toContain('https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap')
    })

    it('includes ready-to-use wordmark CSS', () => {
      const md = generateDesignMd(baseOptions)

      expect(md).toContain("font-family: 'Satoshi', sans-serif;")
      expect(md).toContain('font-weight: 700;')
      expect(md).toContain('color: #141413;')
    })

    it('documents colors with canvas hex', () => {
      const md = generateDesignMd(baseOptions)

      expect(md).toContain('| Wordmark | #141413 |')
      expect(md).toContain(`| Canvas | ${CANVAS_COLORS.white.toUpperCase()} |`)
    })

    it('notes local fonts when there is no Fontshare slug', () => {
      const md = generateDesignMd({ ...baseOptions, fontSlug: null, font: 'Helvetica' })

      expect(md).toContain('Local / system font')
      expect(md).not.toContain('fontshare.com/fonts')
    })

    it('falls back to a generic title for empty text', () => {
      const md = generateDesignMd({ ...baseOptions, text: '  ' })
      expect(md).toContain('# Untitled brand — Design Sheet')
    })
  })
})
