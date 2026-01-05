import { describe, it, expect } from 'vitest'
import { extractSvgContent, escapeXml, generateSvg } from '../../app/utils/svg'

describe('svg utils', () => {
  describe('extractSvgContent', () => {
    it('returns null for non-SVG data URLs', () => {
      const pngDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      expect(extractSvgContent(pngDataUrl)).toBeNull()
    })

    it('returns null for invalid URLs', () => {
      expect(extractSvgContent('not-a-data-url')).toBeNull()
    })

    it('extracts content from base64-encoded SVG', () => {
      // Simple SVG: <svg viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>
      const svgBase64 = btoa('<svg viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>')
      const dataUrl = `data:image/svg+xml;base64,${svgBase64}`
      
      const result = extractSvgContent(dataUrl)
      
      expect(result).not.toBeNull()
      expect(result?.width).toBe(100)
      expect(result?.height).toBe(100)
      expect(result?.content).toContain('circle')
    })

    it('extracts content from URL-encoded SVG', () => {
      const svg = '<svg viewBox="0 0 50 50" width="50" height="50"><rect x="10" y="10" width="30" height="30"/></svg>'
      const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`
      
      const result = extractSvgContent(dataUrl)
      
      expect(result).not.toBeNull()
      expect(result?.width).toBe(50)
      expect(result?.height).toBe(50)
      expect(result?.content).toContain('rect')
    })
  })

  describe('escapeXml', () => {
    it('escapes ampersands', () => {
      expect(escapeXml('A & B')).toBe('A &amp; B')
    })

    it('escapes angle brackets', () => {
      expect(escapeXml('<tag>')).toBe('&lt;tag&gt;')
    })

    it('escapes quotes', () => {
      expect(escapeXml('"hello"')).toBe('&quot;hello&quot;')
    })

    it('leaves normal text unchanged', () => {
      expect(escapeXml('Hello World')).toBe('Hello World')
    })
  })

  describe('generateSvg', () => {
    const defaultOptions = {
      logo: null,
      text: 'Company',
      font: 'Roboto',
      fontSize: 48,
      fontWeight: 400,
      letterSpacing: 0,
      fontColor: '#000000'
    }

    it('generates valid SVG structure', () => {
      const svg = generateSvg(defaultOptions)
      
      expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"')
      expect(svg).toContain('</svg>')
    })

    it('includes font import', () => {
      const svg = generateSvg(defaultOptions)
      
      expect(svg).toContain('fonts.googleapis.com')
      expect(svg).toContain('Roboto')
    })

    it('includes text element with correct styling', () => {
      const svg = generateSvg(defaultOptions)
      
      expect(svg).toContain('<text')
      expect(svg).toContain('Company')
      expect(svg).toContain('font-size="48"')
      expect(svg).toContain('font-weight="400"')
    })

    it('does not include logo elements when no logo provided', () => {
      const svg = generateSvg(defaultOptions)
      
      expect(svg).not.toContain('<image')
      expect(svg).not.toContain('<g transform')
    })

    it('includes image element for raster logo', () => {
      const svg = generateSvg({
        ...defaultOptions,
        logo: 'data:image/png;base64,abc123'
      })
      
      expect(svg).toContain('<image')
      expect(svg).toContain('xlink:href="data:image/png;base64,abc123"')
    })

    it('inlines SVG logo content as group', () => {
      const svgLogo = btoa('<svg viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>')
      const svg = generateSvg({
        ...defaultOptions,
        logo: `data:image/svg+xml;base64,${svgLogo}`
      })
      
      expect(svg).toContain('<g transform')
      expect(svg).toContain('circle')
      expect(svg).not.toContain('<image')
    })
  })
})
