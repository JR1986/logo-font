/**
 * Font category names
 */
export type FontCategory = 'Sans-Serif' | 'Serif' | 'Display' | 'Handwriting' | 'System' | 'Installed'

/**
 * Font categories object structure
 */
export type FontCategories = Record<FontCategory, string[]>

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
