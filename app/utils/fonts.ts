import type { FontCategories, FontCategory } from '~/types'

/**
 * Standard System Fonts (for skipping Google Font loading)
 */
export const SYSTEM_FONTS = [
  'Arial',
  'Helvetica',
  'Verdana',
  'Georgia',
  'Garamond',
  'Trebuchet MS'
]

/**
 * Font categories with all available fonts for logo design
 */
export const FONT_CATEGORIES: FontCategories = {
  'Most Popular': [
    'Helvetica',
    'Montserrat',        // Proxima Nova alternative
    'Josefin Sans',      // Futura alternative
    'EB Garamond',       // Classic Garamond
    'Libre Bodoni',      // Bodoni alternative
    'Playfair Display',  // Didot alternative
    'Inter',
    'Poppins',
    'Roboto'
  ],
  'Sans-Serif': [
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Inter',
    'Oswald',
    'Nunito',
    'Work Sans',
    'Quicksand',
    'Outfit',
    'DM Sans',
    'Manrope',
    'Space Grotesk',
    'Barlow',
    'Kanit',
    'Titillium Web',
    'Josefin Sans',
    'Archivo',
    'Lexend',
    'Figtree',
    'Plus Jakarta Sans'
  ],
  'Serif': [
    'Playfair Display',
    'Merriweather',
    'Libre Baskerville',
    'EB Garamond',
    'Cormorant Garamond',
    'Lora',
    'Libre Bodoni',
    'Bodoni Moda',
    'Spectral',
    'Crimson Pro',
    'DM Serif Display'
  ],
  'Display': [
    'Bebas Neue',
    'Righteous',
    'Alfa Slab One',
    'Orbitron',
    'Anton',
    'Archivo Black',
    'Staatliches',
    'Teko'
  ],
  'Handwriting': [
    'Dancing Script',
    'Great Vibes',
    'Parisienne',
    'Sacramento',
    'Alex Brush',
    'Allura'
  ],
  'System': [
    'Arial',
    'Helvetica',
    'Verdana',
    'Georgia',
    'Garamond',
    'Trebuchet MS'
  ],
  'Installed': []
}

/**
 * Get flat array of all fonts
 */
export function getAllFonts(): string[] {
  return Object.values(FONT_CATEGORIES).flat()
}

/**
 * Get category for a given font
 */
export function getFontCategory(fontName: string): FontCategory | null {
  for (const [category, fonts] of Object.entries(FONT_CATEGORIES)) {
    if (fonts.includes(fontName)) {
      return category as FontCategory
    }
  }
  return null
}

/**
 * Default font settings
 */
export const DEFAULT_FONT = 'Roboto'
export const DEFAULT_FONT_SIZE = 48
export const DEFAULT_FONT_WEIGHT = 400
