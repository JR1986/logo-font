/**
 * SVG Generation Utilities
 * 
 * Functions for generating SVG content for logo + font export.
 */

export interface SvgGenerationOptions {
  logo: string | null
  text: string
  font: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
}

interface ExtractedSvgContent {
  content: string
  viewBox: string
  width: number
  height: number
}

/**
 * Extracts SVG content from a data URL.
 * Returns the inner content of the SVG (everything inside <svg>...</svg>)
 * along with the viewBox dimensions for proper scaling.
 */
export function extractSvgContent(dataUrl: string): ExtractedSvgContent | null {
  try {
    // Check if it's an SVG data URL
    if (!dataUrl.startsWith('data:image/svg+xml')) {
      return null
    }

    let svgString: string

    // Handle base64 encoded SVGs
    if (dataUrl.includes('base64,')) {
      const base64Content = dataUrl.split('base64,')[1] ?? ''
      svgString = atob(base64Content)
    } else {
      // Handle URL-encoded SVGs
      const encodedContent = dataUrl.split(',')[1] ?? ''
      svgString = decodeURIComponent(encodedContent)
    }

    // Parse SVG to extract content and dimensions
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgString, 'image/svg+xml')
    const svgElement = doc.querySelector('svg')

    if (!svgElement) {
      return null
    }

    // Get viewBox or width/height for sizing
    const viewBox = svgElement.getAttribute('viewBox') || '0 0 100 100'
    const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
    
    // Get width/height, falling back to viewBox dimensions
    const width = parseFloat(svgElement.getAttribute('width') || String(vbWidth)) || 100
    const height = parseFloat(svgElement.getAttribute('height') || String(vbHeight)) || 100

    // Extract inner content (all children of the SVG)
    const content = svgElement.innerHTML

    return { content, viewBox, width, height }
  } catch {
    console.error('Failed to extract SVG content')
    return null
  }
}

/**
 * Escapes special XML characters in text content
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generates an SVG string containing the logo and styled text.
 * For SVG logos, the content is inlined for full design tool compatibility.
 * For raster logos (PNG/JPG), an image reference is used (limited compatibility).
 */
export function generateSvg(options: SvgGenerationOptions): string {
  const { logo, text, font, fontSize, fontWeight, letterSpacing, fontColor } = options
  
  const logoSize = 80
  const gap = 16
  const padding = 24
  
  // Calculate text width estimate (rough approximation)
  const textWidth = text.length * fontSize * 0.6
  const totalWidth = (logo ? logoSize + gap : 0) + textWidth + padding * 2
  const totalHeight = Math.max(logoSize, fontSize * 1.2) + padding * 2
  
  // Position calculations
  const logoX = padding
  const logoY = (totalHeight - logoSize) / 2
  const textX = logo ? padding + logoSize + gap : padding
  const textY = totalHeight / 2 + fontSize * 0.35

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">\n`
  
  // Add embedded font style with Google Fonts import
  svgContent += `  <defs>\n`
  svgContent += `    <style>\n`
  svgContent += `      @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@${fontWeight}&amp;display=swap');\n`
  svgContent += `    </style>\n`
  svgContent += `  </defs>\n`
  
  // Add logo if available
  if (logo) {
    const extractedSvg = extractSvgContent(logo)
    
    if (extractedSvg) {
      // Inline SVG content with transform for positioning and scaling
      const scale = Math.min(logoSize / extractedSvg.width, logoSize / extractedSvg.height)
      const scaledWidth = extractedSvg.width * scale
      const scaledHeight = extractedSvg.height * scale
      const offsetX = logoX + (logoSize - scaledWidth) / 2
      const offsetY = logoY + (logoSize - scaledHeight) / 2
      
      svgContent += `  <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">\n`
      svgContent += `    ${extractedSvg.content}\n`
      svgContent += `  </g>\n`
    } else {
      // Fall back to image reference for non-SVG logos (PNG, JPG, etc.)
      svgContent += `  <image x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" xlink:href="${logo}" preserveAspectRatio="xMidYMid meet" />\n`
    }
  }
  
  // Add text element with styling
  svgContent += `  <text x="${textX}" y="${textY}" font-family="'${font}', sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="${letterSpacing}" fill="${fontColor}">${escapeXml(text)}</text>\n`
  
  svgContent += `</svg>`
  
  return svgContent
}
