/**
 * Export Utilities
 *
 * Brand-kit style exports: DESIGN.md brand sheet, PNG rasterisation
 * and generic file downloads.
 */

export interface BrandKitOptions {
  logo: string | null
  text: string
  font: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
  fontCategory?: string | null
  fontSlug?: string | null
  previewBg: 'white' | 'black'
  direction: 'horizontal' | 'vertical'
}

/** Canvas colors used across preview + exports */
export const CANVAS_COLORS = {
  white: '#FFFFFF',
  black: '#141413'
} as const

/**
 * Turn arbitrary text into a safe kebab-case file name fragment.
 */
export function slugifyFilename(text: string, fallback = 'logofont'): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}

/**
 * Trigger a browser download for a string or Blob.
 */
export function downloadFile(filename: string, content: string | Blob, mime = 'text/plain'): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

/**
 * Generate a DESIGN.md brand sheet for the current match.
 */
export function generateDesignMd(options: BrandKitOptions): string {
  const {
    text,
    font,
    fontSize,
    fontWeight,
    letterSpacing,
    fontColor,
    fontCategory,
    fontSlug,
    previewBg,
    logo
  } = options

  const brand = text.trim() || 'Untitled brand'
  const canvasColor = CANVAS_COLORS[previewBg]
  const date = new Date().toISOString().slice(0, 10)

  const lines: string[] = []
  lines.push(`# ${brand} — Design Sheet`)
  lines.push('')
  lines.push(`> Wordmark spec generated with logofont. on ${date}`)
  lines.push('')
  lines.push('## Typography')
  lines.push('')
  lines.push('| Property | Value |')
  lines.push('| --- | --- |')
  lines.push(`| Typeface | ${font} |`)
  if (fontCategory) lines.push(`| Category | ${fontCategory} |`)
  lines.push(`| Weight | ${fontWeight} |`)
  lines.push(`| Size | ${fontSize}px |`)
  lines.push(`| Letter spacing | ${letterSpacing}px |`)
  lines.push('')

  if (fontSlug) {
    lines.push('### Get the font')
    lines.push('')
    lines.push(`- Fontshare page: https://www.fontshare.com/fonts/${fontSlug}`)
    lines.push('- Free for personal and commercial use under the [ITF FFL license](https://www.fontshare.com/licenses/itf-ffl)')
    lines.push('')
    lines.push('```html')
    lines.push(`<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=${fontSlug}@1,2&display=swap">`)
    lines.push('```')
    lines.push('')
  } else {
    lines.push('> Local / system font — make sure the font file ships with your brand assets.')
    lines.push('')
  }

  lines.push('### Wordmark CSS')
  lines.push('')
  lines.push('```css')
  lines.push('.wordmark {')
  lines.push(`  font-family: '${font}', sans-serif;`)
  lines.push(`  font-weight: ${fontWeight};`)
  lines.push(`  font-size: ${fontSize}px;`)
  lines.push(`  letter-spacing: ${letterSpacing}px;`)
  lines.push(`  color: ${fontColor};`)
  lines.push('}')
  lines.push('```')
  lines.push('')
  lines.push('## Colors')
  lines.push('')
  lines.push('| Token | Hex |')
  lines.push('| --- | --- |')
  lines.push(`| Wordmark | ${fontColor.toUpperCase()} |`)
  lines.push(`| Canvas | ${canvasColor.toUpperCase()} |`)
  lines.push('')
  lines.push('## Logo')
  lines.push('')
  lines.push(
    logo
      ? '- Logo uploaded in logofont. — keep your original vector source next to this sheet.'
      : '- No logo uploaded yet.'
  )
  lines.push('')

  return lines.join('\n')
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load logo image'))
    img.src = src
  })
}

/**
 * Rasterise the current match to a PNG blob using a canvas.
 * Fonts must already be loaded in the document (they are — we preview them).
 */
export async function exportPng(options: BrandKitOptions, scale = 2): Promise<Blob> {
  const {
    logo,
    text,
    font,
    fontSize,
    fontWeight,
    letterSpacing,
    fontColor,
    previewBg,
    direction
  } = options

  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready
  }

  const padding = 64
  const logoSize = fontSize * 2
  const gap = Math.round(fontSize * 0.6)
  const isVertical = direction === 'vertical'
  const fontDecl = `${fontWeight} ${fontSize}px '${font}'`

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable')
  }

  // Measure text first (letter spacing approximated when unsupported)
  ctx.font = fontDecl
  const rawTextWidth = ctx.measureText(text).width
  const textWidth = rawTextWidth + Math.max(0, text.length - 1) * letterSpacing
  const textHeight = fontSize * 1.2

  let width: number
  let height: number
  if (isVertical) {
    width = Math.max(logo ? logoSize : 0, textWidth) + padding * 2
    height = (logo ? logoSize + gap : 0) + textHeight + padding * 2
  } else {
    width = (logo ? logoSize + gap : 0) + textWidth + padding * 2
    height = Math.max(logo ? logoSize : 0, textHeight) + padding * 2
  }

  canvas.width = Math.ceil(width * scale)
  canvas.height = Math.ceil(height * scale)
  ctx.scale(scale, scale)

  // Background
  ctx.fillStyle = CANVAS_COLORS[previewBg]
  ctx.fillRect(0, 0, width, height)

  // Logo
  if (logo) {
    const img = await loadImage(logo)
    const ratio = Math.min(logoSize / img.width, logoSize / img.height) || 1
    const drawW = img.width * ratio
    const drawH = img.height * ratio
    const logoX = isVertical ? (width - drawW) / 2 : padding + (logoSize - drawW) / 2
    const logoY = isVertical ? padding + (logoSize - drawH) / 2 : (height - drawH) / 2
    ctx.drawImage(img, logoX, logoY, drawW, drawH)
  }

  // Text
  ctx.font = fontDecl
  ctx.fillStyle = fontColor
  ctx.textBaseline = 'middle'
  // Native letter-spacing support where available (Chromium)
  if ('letterSpacing' in ctx) {
    ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${letterSpacing}px`
  }

  if (isVertical) {
    ctx.textAlign = 'center'
    const textY = (logo ? padding + logoSize + gap : padding) + textHeight / 2
    ctx.fillText(text, width / 2, textY)
  } else {
    ctx.textAlign = 'left'
    const textX = logo ? padding + logoSize + gap : padding
    ctx.fillText(text, textX, height / 2)
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
      else reject(new Error('PNG export failed'))
    }, 'image/png')
  })
}
