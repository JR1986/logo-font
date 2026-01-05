import { ref, computed } from 'vue'
import type { FontCategories, FontCategory } from '~/types'
import { 
  FONT_CATEGORIES, 
  getAllFonts, 
  getFontCategory,
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
      if (fontCategories.value[category]) {
        filtered[category] = fontCategories.value[category]
      }
    })
    
    return filtered
  })

  const selectedFontCategory = computed<FontCategory | null>(() => {
    return getFontCategory(selectedFont.value)
  })

  /**
   * Load a Google Font dynamically via stylesheet
   */
  function loadFont(fontName?: string): void {
    const font = fontName ?? selectedFont.value
    
    // Skip loading for system fonts or user-installed fonts
    if (SYSTEM_FONTS.includes(font) || installedFonts.value.includes(font)) {
      return
    }

    const encodedFontName = font.replace(/ /g, '+')
    const linkId = 'google-font-link'
    
    // Remove existing font link if present
    const existingLink = document.getElementById(linkId)
    if (existingLink) {
      existingLink.remove()
    }
    
    // Create new font link
    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodedFontName}:wght@100;200;300;400;500;600;700;800;900&display=swap`
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
   * Select a random font (different from current)
   */
  function selectRandomFont(): void {
    // Get flat list of currently available fonts based on filters
    const availableFonts = Object.values(filteredFontCategories.value).flat()
    
    if (availableFonts.length === 0) return

    const currentIndex = availableFonts.indexOf(selectedFont.value)
    let randomIndex = currentIndex
    
    // Ensure we get a different font (unless it's the only one)
    if (availableFonts.length > 1) {
      while (randomIndex === currentIndex || randomIndex === -1) {
        randomIndex = Math.floor(Math.random() * availableFonts.length)
      }
    } else {
        randomIndex = 0
    }
    
    selectedFont.value = availableFonts[randomIndex]!
    loadFont()
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
    selectedFontCategory,
    loadFont,
    selectRandomFont,
    loadInstalledFonts,
    installedFonts
  }
}
