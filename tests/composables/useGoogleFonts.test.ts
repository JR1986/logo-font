import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGoogleFonts } from '~/composables/useGoogleFonts'
import type { FontshareFont } from '~/types'

// Minimal Fontshare-shaped catalogue used to back the mocked API
const sampleFonts: FontshareFont[] = [
  { name: 'Satoshi', slug: 'satoshi', category: 'Sans', styles: [], is_hot: false, is_top: false, views: 0 },
  { name: 'Switzer', slug: 'switzer', category: 'Sans', styles: [], is_hot: false, is_top: false, views: 0 },
  { name: 'General Sans', slug: 'general-sans', category: 'Sans', styles: [], is_hot: false, is_top: false, views: 0 },
  { name: 'Zodiak', slug: 'zodiak', category: 'Serif', styles: [], is_hot: false, is_top: false, views: 0 },
]

function mockFontshareApi() {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ count: sampleFonts.length, count_total: sampleFonts.length, fonts: sampleFonts }),
  }) as unknown as typeof fetch
}

describe('useGoogleFonts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the document head between tests
    document.head.innerHTML = ''
  })

  it('should initialize with default state', () => {
    const { selectedFont, fontSize, fontWeight, fontColor } = useGoogleFonts()

    expect(selectedFont.value).toBe('Satoshi')
    expect(fontSize.value).toBe(48)
    expect(fontWeight.value).toBe(400)
    expect(fontColor.value).toBe('#1e293b')
  })

  it('fetchFonts populates categories from the Fontshare API', async () => {
    mockFontshareApi()
    const { fetchFonts, fontCategories } = useGoogleFonts()

    await fetchFonts()

    expect(global.fetch).toHaveBeenCalledOnce()
    expect(fontCategories.value.Sans).toEqual(expect.arrayContaining(['Satoshi', 'Switzer', 'General Sans']))
    expect(fontCategories.value.Serif).toContain('Zodiak')
  })

  it('loadFont should inject a Fontshare stylesheet link', async () => {
    mockFontshareApi()
    const { fetchFonts, loadFont } = useGoogleFonts()

    await fetchFonts()
    loadFont('Satoshi')

    const link = document.getElementById('fontshare-satoshi') as HTMLLinkElement | null
    expect(link).not.toBeNull()
    expect(link?.rel).toBe('stylesheet')
    expect(link?.href).toContain('api.fontshare.com')
    expect(link?.href).toContain('satoshi')
  })

  it('loadFont should not duplicate an already-loaded stylesheet', async () => {
    mockFontshareApi()
    const { fetchFonts, loadFont } = useGoogleFonts()

    await fetchFonts()
    loadFont('Satoshi')
    loadFont('Satoshi')

    expect(document.querySelectorAll('#fontshare-satoshi')).toHaveLength(1)
  })

  it('filteredFontCategories should update based on selectedCategories', () => {
    const { fontCategories, selectedCategories, filteredFontCategories } = useGoogleFonts()

    fontCategories.value = {
      Popular: [],
      Sans: ['Satoshi'],
      Serif: ['Zodiak'],
      Display: [],
      Handwritten: [],
      Mono: [],
      Installed: [],
    }
    selectedCategories.value = ['Sans', 'Serif']

    expect(Object.keys(filteredFontCategories.value)).toEqual(['Sans', 'Serif'])

    // Deselect Serif
    selectedCategories.value = ['Sans']
    expect(filteredFontCategories.value['Serif']).toBeUndefined()
    expect(filteredFontCategories.value['Sans']).toEqual(['Satoshi'])
  })

  it('selectRandomFont should pick a different font within the active filter', () => {
    const { selectedFont, fontCategories, selectedCategories, selectRandomFont } = useGoogleFonts()

    fontCategories.value = {
      Popular: [],
      Sans: ['Satoshi', 'Switzer', 'General Sans'],
      Serif: [],
      Display: [],
      Handwritten: [],
      Mono: [],
      Installed: [],
    }
    selectedCategories.value = ['Sans']
    selectedFont.value = 'Satoshi'

    selectRandomFont()

    expect(selectedFont.value).not.toBe('Satoshi')
    expect(['Switzer', 'General Sans']).toContain(selectedFont.value)
  })

  it('selectRandomFont should respect the category filter', () => {
    const { selectedFont, fontCategories, selectedCategories, selectRandomFont } = useGoogleFonts()

    fontCategories.value = {
      Popular: [],
      Sans: ['Satoshi'],
      Serif: ['Zodiak', 'Sentient'],
      Display: [],
      Handwritten: [],
      Mono: [],
      Installed: [],
    }
    selectedCategories.value = ['Serif']
    selectedFont.value = 'Zodiak'

    selectRandomFont()

    // Only Serif fonts are eligible
    expect(['Zodiak', 'Sentient']).toContain(selectedFont.value)
  })

  it('loadInstalledFonts should update fontCategories', async () => {
    const { loadInstalledFonts, fontCategories } = useGoogleFonts()

    // @ts-expect-error - Experimental Local Font Access API
    window.queryLocalFonts = vi.fn().mockResolvedValue([
      { family: 'Local Font 1' },
      { family: 'Local Font 2' },
    ])

    const success = await loadInstalledFonts()

    expect(success).toBe(true)
    expect(fontCategories.value['Installed']).toContain('Local Font 1')
    expect(fontCategories.value['Installed']).toContain('Local Font 2')
  })
})
