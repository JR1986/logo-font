/**
 * Fontshare font category names
 */
export type FontCategory = 'Popular' | 'Sans' | 'Serif' | 'Display' | 'Handwritten' | 'Mono' | 'Installed'

/**
 * Font categories object structure
 */
export type FontCategories = Record<FontCategory, string[]>

/**
 * Fontshare API font style
 */
export interface FontshareStyle {
  id: string
  is_italic: boolean
  is_variable: boolean
  weight: {
    label: string
    name: string
    number: number
    weight: number
  }
}

/**
 * Fontshare API font entry
 */
export interface FontshareFont {
  name: string
  slug: string
  category: string
  styles: FontshareStyle[]
  is_hot: boolean
  is_top: boolean
  views: number
}

/**
 * Fontshare API response
 */
export interface FontshareApiResponse {
  count: number
  count_total: number
  fonts: FontshareFont[]
}

/**
 * Font settings for preview
 */
export interface FontSettings {
  font: string
  size: number
  weight: number
}

/**
 * Logo upload state
 */
export interface LogoUploadState {
  logo: string | null
  isDragging: boolean
}

/**
 * Keyboard shortcut handler
 */
export interface KeyboardShortcut {
  code: string
  handler: () => void
  preventDefault?: boolean
}
