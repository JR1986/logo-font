import { ref, computed, watch } from 'vue'
import type { FontCategories, FontCategory, FontshareFont } from '~/types'
import {
  FONT_CATEGORIES,
  FONT_CATEGORY_MAP,
  SYSTEM_FONTS,
  DEFAULT_FONT,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_WEIGHT,
  fetchFontshareFonts,
  buildFontCategories,
  buildFontSlugMap,
  buildFontCategoryMap,
} from '~/utils/fonts'

// Type definition for the Local Font Access API
interface LocalFontData {
  family: string
  fullName: string
  postscriptName: string
  style: string
}

/**
 * Composable for managing Fontshare fonts
 * (kept export name for backwards compatibility)
 */
export function useGoogleFonts() {
  const selectedFont = ref<string>(DEFAULT_FONT)
  const fontSize = ref<number>(DEFAULT_FONT_SIZE)
  const fontWeight = ref<number>(DEFAULT_FONT_WEIGHT)
  const letterSpacing = ref<number>(0)
  const fontColor = ref<string>('#1e293b')

  const installedFonts = ref<string[]>([])
  const fontCategories = ref<FontCategories>({ ...FONT_CATEGORIES })
  const isLoading = ref(false)

  // Font slug lookups (populated after API fetch)
  const nameToSlug = ref<Map<string, string>>(new Map())
  const categoryMap = ref<Map<string, FontCategory>>(new Map())

  const allFonts = computed(() => {
    return [...new Set(Object.values(fontCategories.value).flat())]
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
    return categoryMap.value.get(selectedFont.value) ?? FONT_CATEGORY_MAP[selectedFont.value] ?? null
  })

  /**
   * Fetch all fonts from Fontshare API and populate categories.
   */
  async function fetchFonts(): Promise<void> {
    isLoading.value = true
    try {
      const fonts = await fetchFontshareFonts()
      const categories = buildFontCategories(fonts)
      const slugs = buildFontSlugMap(fonts)
      const catMap = buildFontCategoryMap(fonts)

      fontCategories.value = {
        ...categories,
        'Installed': installedFonts.value,
      }
      nameToSlug.value = slugs.nameToSlug
      categoryMap.value = catMap

      // Populate the global FONT_CATEGORY_MAP for compatibility
      for (const [name, cat] of catMap) {
        FONT_CATEGORY_MAP[name] = cat
      }

      // Update selected categories to include all that have fonts
      selectedCategories.value = (Object.keys(fontCategories.value) as FontCategory[]).filter(
        cat => fontCategories.value[cat].length > 0
      )
    } catch (error) {
      console.error('Failed to fetch Fontshare fonts:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load a Fontshare font dynamically via stylesheet.
   * Uses the Fontshare CSS API with variable font style (covers all weights).
   */
  function loadFont(fontName?: string, _weight?: number): void {
    const font = fontName ?? selectedFont.value

    // Skip loading for system fonts or user-installed fonts
    if (SYSTEM_FONTS.includes(font) || installedFonts.value.includes(font)) {
      return
    }

    const slug = nameToSlug.value.get(font)
    if (!slug) {
      // Font not in Fontshare catalog — skip
      return
    }

    const linkId = `fontshare-${slug}`

    // Already loaded — skip
    if (document.getElementById(linkId)) {
      return
    }

    // Create font link using Fontshare CSS API
    // @1 = variable font (covers all weights), @2 = variable italic
    const link = document.createElement('link')
    link.id = linkId
    link.rel = 'stylesheet'
    link.href = `https://api.fontshare.com/v2/css?f[]=${slug}@1,2&display=swap`
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

      // Update the categories to include installed fonts
      fontCategories.value = {
        ...fontCategories.value,
        'Installed': installedFonts.value,
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

  // Re-load font whenever weight changes
  // Fontshare variable fonts cover all weights in a single load, so no action needed
  if (typeof window !== 'undefined') {
    watch(fontWeight, () => {
      // Fontshare variable fonts already include all weights — no reload needed
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
    installedFonts,
    fetchFonts,
    isLoading,
  }
}
