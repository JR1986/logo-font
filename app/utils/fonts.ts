import type { FontCategories, FontCategory } from '~/types'

/**
 * Standard System Fonts
 */
export const SYSTEM_FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Georgia',
  'Palatino',
  'Garamond',
  'Bookman',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Impact'
]

/**
 * Font categories with all available Google Fonts
 */
export const FONT_CATEGORIES: FontCategories = {
  'System': SYSTEM_FONTS,
  'Installed': [],
  'Sans-Serif': [
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Inter',
    'Oswald',
    'Source Sans Pro',
    'Nunito',
    'Ubuntu',
    'PT Sans',
    'Mukta',
    'Rubik',
    'Work Sans',
    'Quicksand',
    'Outfit',
    'DM Sans',
    'Manrope',
    'Space Grotesk',
    'Barlow',
    'Exo 2',
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
    'Crimson Text',
    'Libre Baskerville',
    'EB Garamond',
    'Cormorant Garamond',
    'Lora',
    'PT Serif',
    'Source Serif Pro',
    'Bitter',
    'Spectral',
    'Vollkorn'
  ],
  'Display': [
    'Bebas Neue',
    'Righteous',
    'Lobster',
    'Pacifico',
    'Alfa Slab One',
    'Permanent Marker',
    'Bungee',
    'Orbitron'
  ],
  'Handwriting': [
    'Dancing Script',
    'Caveat',
    'Satisfy',
    'Great Vibes',
    'Parisienne',
    'Sacramento'
  ]
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
