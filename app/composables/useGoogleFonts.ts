import { ref, computed, watch } from 'vue'
import type { FontCategories, FontCategory } from '~/types'
import { 
  FONT_CATEGORIES, 
  FONT_CATEGORY_MAP,
  getAllFonts, 
  DEFAULT_FONT,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_WEIGHT,
  SYSTEM_FONTS
} from '~/utils/fonts'

// Type definition for the Local Font Access API
interface LocalFontData {
  family: string
  fullName: string
  postscriptName: string
  style: string
}

/**
 * Composable for managing Google Fonts
 */
export function useGoogleFonts() {
  const selectedFont = ref<string>(DEFAULT_FONT)
  const fontSize = ref<number>(DEFAULT_FONT_SIZE)
  const fontWeight = ref<number>(DEFAULT_FONT_WEIGHT)
  const letterSpacing = ref<number>(0)
  const fontColor = ref<string>('#1e293b')

  const installedFonts = ref<string[]>([])
  const fontCategories = ref<FontCategories>({ ...FONT_CATEGORIES })
  
  // Keep track of dynamically added fonts (installed ones)
  const allFonts = computed(() => {
    return Object.values(fontCategories.value).flat()
  })

  // Initialize with all categories selected by default
  const selectedCategories = ref<FontCategory[]>(Object.keys(FONT_CATEGORIES) as FontCategory[])

  const filteredFontCategories = computed<Partial<FontCategories>>(() => {
    const filtered: Partial<FontCategories> = {}
    
    selectedCategories.value.forEach(category => {
      if (fontCategories.value[category] && fontCategories.value[category].length > 0) {
        filtered[category] = fontCategories.value[category]
      }
    })
    
    return filtered
  })

  // Only expose categories that have fonts (hides empty "Installed" until loaded)
  const availableCategories = computed<FontCategory[]>(() => {
    return (Object.keys(fontCategories.value) as FontCategory[]).filter(
      category => fontCategories.value[category].length > 0
    )
  })

  const selectedFontCategory = computed<FontCategory | null>(() => {
    return FONT_CATEGORY_MAP[selectedFont.value] ?? null
  })

  /**
   * Load a Google Font dynamically via stylesheet.
   * Loads only the active weight to minimise network payload.
   */
  function loadFont(fontName?: string, weight?: number): void {
    const font = fontName ?? selectedFont.value
    const activeWeight = weight ?? fontWeight.value
    
    // Skip loading for system fonts or user-installed fonts
    if (SYSTEM_FONTS.includes(font) || installedFonts.value.includes(font)) {
      return
    }

    const encodedFontName = font.replace(/ /g, '+')
    const linkId = `google-font-${encodedFontName}-${activeWeight}`
    
    // Already loaded this font at this weight — skip
    if (document.getElementById(linkId)) {
      return
    }

    // Remove any previous link for this font (different weight)
    const existingLinks = document.querySelectorAll(`[id^="google-font-${encodedFontName}-"]`)
    existingLinks.forEach(el => el.remove())
    
    // Create new font link for just the active weight
    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodedFontName}:wght@${activeWeight}&display=swap`
    document.head.appendChild(link)
  }

  /**
   * Load local fonts via Local Font Access API
   */
  async function loadInstalledFonts(): Promise<boolean> {
    if (!('queryLocalFonts' in window)) {
      console.warn('Local Font Access API not supported')
      return false
    }

    try {
      // @ts-expect-error - Experimental API
      const localFonts: LocalFontData[] = await window.queryLocalFonts()
      
      // Extract unique font families
      const families = new Set<string>()
      localFonts.forEach(font => families.add(font.family))
      
      installedFonts.value = Array.from(families).sort()
      
      // Update the categories to include installed fonts in 'Installed'
      // We keep System fonts separate
      
      fontCategories.value = {
        ...fontCategories.value,
        'Installed': installedFonts.value
      }
      
      return true
    } catch (e) {
      console.error('Permission denied or error querying local fonts', e)
      return false
    }
  }

  /**
   * Select a random font (different from current).
   * Uses O(1) index-offset selection — guaranteed to pick a different font
   * without any loop or retry risk.
   */
  function selectRandomFont(): void {
    const available = Object.values(filteredFontCategories.value).flat()
    if (available.length === 0) return

    const currentIndex = available.indexOf(selectedFont.value)
    // Offset by 1..n-1 (never 0) to always pick a different font
    const offset = 1 + Math.floor(Math.random() * Math.max(1, available.length - 1))
    selectedFont.value = available[(currentIndex + offset) % available.length]!
    loadFont()
  }

  // Re-load font whenever weight changes (loads only the new weight)
  if (typeof window !== 'undefined') {
    watch(fontWeight, (newWeight) => {
      loadFont(undefined, newWeight)
    })
  }

  return {
    selectedFont,
    fontSize,
    fontWeight,
    letterSpacing,
    fontColor,
    fontCategories,
    allFonts,
    selectedCategories,
    filteredFontCategories,
    availableCategories,
    selectedFontCategory,
    loadFont,
    selectRandomFont,
    loadInstalledFonts,
    installedFonts
  }
}
