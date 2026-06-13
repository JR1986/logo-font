import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGoogleFonts } from '~/composables/useGoogleFonts'
import type { FontshareFont } from '~/types'

function makeFont(name: string, slug: string, category: string): FontshareFont {
  return { name, slug, category, styles: [], is_hot: false, is_top: false, views: 0 }
}

const sampleFonts: FontshareFont[] = [
  makeFont('Satoshi', 'satoshi', 'Sans'),
  makeFont('General Sans', 'general-sans', 'Sans'),
  makeFont('Sentient', 'sentient', 'Serif'),
  makeFont('Zodiak', 'zodiak', 'Serif'),
  makeFont('Clash Display', 'clash-display', 'Display')
]

describe('useGoogleFonts (Fontshare)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ count: sampleFonts.length, count_total: sampleFonts.length, fonts: sampleFonts })
    })))
    // Clean stylesheet links added by previous tests
    document.querySelectorAll('link').forEach(link => link.remove())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('initializes with default state', () => {
    const { selectedFont, fontSize, fontWeight, fontColor } = useGoogleFonts()

    expect(selectedFont.value).toBe('Satoshi')
    expect(fontSize.value).toBe(48)
    expect(fontWeight.value).toBe(400)
    expect(fontColor.value).toBe('#141413')
  })

  it('fetchFonts populates categories from the API', async () => {
    const { fetchFonts, fontCategories } = useGoogleFonts()

    await fetchFonts()

    expect(fontCategories.value['Sans']).toContain('Satoshi')
    expect(fontCategories.value['Serif']).toContain('Sentient')
    expect(fontCategories.value['Display']).toContain('Clash Display')
    // Curated populars present
    expect(fontCategories.value['Popular']).toContain('Satoshi')
  })

  it('availableCategories only lists non-empty categories', async () => {
    const { fetchFonts, availableCategories } = useGoogleFonts()

    await fetchFonts()

    expect(availableCategories.value).toContain('Sans')
    expect(availableCategories.value).not.toContain('Mono')
    expect(availableCategories.value).not.toContain('Installed')
  })

  it('loadFont appends a Fontshare stylesheet link once', async () => {
    const { fetchFonts, loadFont } = useGoogleFonts()
    await fetchFonts()

    loadFont('Sentient')
    loadFont('Sentient')

    const links = document.querySelectorAll('link#fontshare-sentient')
    expect(links).toHaveLength(1)
    expect(links[0]?.getAttribute('href')).toContain('f[]=sentient@1,2')
  })

  it('loadFont skips fonts without a Fontshare slug', async () => {
    const { fetchFonts, loadFont } = useGoogleFonts()
    await fetchFonts()

    loadFont('Arial')
    loadFont('Some Unknown Font')

    expect(document.querySelectorAll('link[id^="fontshare-"]')).toHaveLength(0)
  })

  it('exposes the slug of the selected font', async () => {
    const { fetchFonts, selectedFont, selectedFontSlug, getFontSlug } = useGoogleFonts()
    await fetchFonts()

    selectedFont.value = 'Clash Display'

    expect(selectedFontSlug.value).toBe('clash-display')
    expect(getFontSlug('Zodiak')).toBe('zodiak')
    expect(getFontSlug('Nope')).toBeNull()
  })

  it('selectRandomFont always picks a different font', async () => {
    const { fetchFonts, selectRandomFont, selectedFont } = useGoogleFonts()
    await fetchFonts()

    for (let i = 0; i < 10; i++) {
      const before = selectedFont.value
      selectRandomFont()
      expect(selectedFont.value).not.toBe(before)
    }
  })

  it('selectRandomFont respects the category filter', async () => {
    const { fetchFonts, selectRandomFont, selectedFont, selectedCategories } = useGoogleFonts()
    await fetchFonts()

    selectedCategories.value = ['Serif']

    for (let i = 0; i < 10; i++) {
      selectRandomFont()
      expect(['Sentient', 'Zodiak']).toContain(selectedFont.value)
    }
  })

  it('filteredFontCategories follows selectedCategories', async () => {
    const { fetchFonts, filteredFontCategories, selectedCategories } = useGoogleFonts()
    await fetchFonts()

    selectedCategories.value = ['Sans']

    expect(Object.keys(filteredFontCategories.value)).toEqual(['Sans'])
  })

  it('loadInstalledFonts adds local fonts to the Installed category', async () => {
    const { loadInstalledFonts, fontCategories } = useGoogleFonts()

    // @ts-expect-error - experimental API mock
    window.queryLocalFonts = vi.fn().mockResolvedValue([
      { family: 'Local Font 1' },
      { family: 'Local Font 2' },
      { family: 'Local Font 1' } // duplicate style entries collapse
    ])

    const success = await loadInstalledFonts()

    expect(success).toBe(true)
    expect(fontCategories.value['Installed']).toEqual(['Local Font 1', 'Local Font 2'])
  })

  it('handles API failure gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500 })))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { fetchFonts, isLoading } = useGoogleFonts()
    await fetchFonts()

    expect(isLoading.value).toBe(false)
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
