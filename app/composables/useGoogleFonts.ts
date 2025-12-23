import { ref, computed } from 'vue'
import type { FontCategories, FontCategory } from '~/types'
import { 
  FONT_CATEGORIES, 
  getAllFonts, 
  getFontCategory,
  DEFAULT_FONT,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_WEIGHT
} from '~/utils/fonts'

/**
 * Composable for managing Google Fonts
 */
export function useGoogleFonts() {
  const selectedFont = ref<string>(DEFAULT_FONT)
  const fontSize = ref<number>(DEFAULT_FONT_SIZE)
  const fontWeight = ref<number>(DEFAULT_FONT_WEIGHT)
  const fontColor = ref<string>('#1e293b')

  const fontCategories = FONT_CATEGORIES
  const allFonts = getAllFonts()

  // Initialize with all categories selected by default
  const selectedCategories = ref<FontCategory[]>(Object.keys(FONT_CATEGORIES) as FontCategory[])

  const filteredFontCategories = computed<Partial<FontCategories>>(() => {
    const filtered: Partial<FontCategories> = {}
    
    selectedCategories.value.forEach(category => {
      if (fontCategories[category]) {
        filtered[category] = fontCategories[category]
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
    fontColor,
    fontCategories,
    allFonts,
    selectedCategories,
    filteredFontCategories,
    selectedFontCategory,
    loadFont,
    selectRandomFont
  }
}
