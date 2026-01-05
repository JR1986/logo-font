import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGoogleFonts } from '~/composables/useGoogleFonts'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

// Mock document for head management
const mockRemove = vi.fn()
const mockAppendChild = vi.fn()
const mockCreateElement = vi.fn(() => ({
  id: '',
  rel: '',
  href: '',
  remove: mockRemove
}))
const mockGetElementById = vi.fn()

// @ts-ignore
global.document = {
  getElementById: mockGetElementById,
  createElement: mockCreateElement,
  head: {
    appendChild: mockAppendChild
  }
}

describe('useGoogleFonts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { selectedFont, fontSize, fontWeight, fontColor } = useGoogleFonts()
    
    expect(selectedFont.value).toBe('Roboto')
    expect(fontSize.value).toBe(48)
    expect(fontWeight.value).toBe(400)
    expect(fontColor.value).toBe('#1e293b')
  })

  it('loadFont should create link element', () => {
    const { loadFont } = useGoogleFonts()
    
    loadFont('Roboto')
    
    expect(mockCreateElement).toHaveBeenCalledWith('link')
    expect(mockAppendChild).toHaveBeenCalled()
    // Verify link properties
    const link = mockAppendChild.mock.calls[0][0]
    expect(link.id).toBe('google-font-link')
    expect(link.href).toContain('Roboto')
  })

  it('loadFont should remove existing link if present', () => {
    const mockExistingLink = { remove: mockRemove }
    mockGetElementById.mockReturnValue(mockExistingLink)
    
    const { loadFont } = useGoogleFonts()
    loadFont('Open Sans')
    
    expect(mockRemove).toHaveBeenCalled()
  })

  it('selectRandomFont should update selectedFont', () => {
    const { selectedFont, selectRandomFont, selectedCategories } = useGoogleFonts()
    const initialFont = selectedFont.value
    
    // Force selection from a category that triggers a load (non-System)
    selectedCategories.value = ['Sans-Serif']
    
    // Attempt multiple times to ensure change (randomness might pick same, although while loop prevents it)
    selectRandomFont()
    
    expect(selectedFont.value).not.toBe(initialFont)
    expect(mockCreateElement).toHaveBeenCalled() // Should trigger load
  })

  it('filteredFontCategories should update based on selectedCategories', () => {
    const { filteredFontCategories, selectedCategories } = useGoogleFonts()
    
    // Initially all selected (now 6 including System and Installed)
    expect(Object.keys(filteredFontCategories.value).length).toBe(6) 
    
    // Deselect one
    selectedCategories.value = selectedCategories.value.filter(c => c !== 'Serif')
    
    expect(Object.keys(filteredFontCategories.value).length).toBe(5)
    expect(filteredFontCategories.value['Serif']).toBeUndefined()
    expect(filteredFontCategories.value['Sans-Serif']).toBeDefined()
    expect(filteredFontCategories.value['System']).toBeDefined()
  })

  it('loadInstalledFonts should update fontCategories', async () => {
    const { loadInstalledFonts, fontCategories } = useGoogleFonts()
    
    // Mock window.queryLocalFonts
    // @ts-ignore
    window.queryLocalFonts = vi.fn().mockResolvedValue([
      { family: 'Local Font 1' },
      { family: 'Local Font 2' }
    ])
    
    const success = await loadInstalledFonts()
    
    expect(success).toBe(true)
    expect(fontCategories.value['Installed']).toContain('Local Font 1')
    expect(fontCategories.value['Installed']).toContain('Local Font 2')
  })

  it('selectRandomFont should respect category filter', () => {
    const { selectRandomFont, selectedFont, selectedCategories } = useGoogleFonts()
    
    // Select only 'Serif'
    selectedCategories.value = ['Serif']
    
    // Try multiple times to ensure we don't get a non-serif font
    for (let i = 0; i < 10; i++) {
        selectRandomFont()
        // We can check if the selected font is in the Serif list
        // In a real app we might not have access to the internal lists in the test easily without exporting them,
        // but we know 'Roboto' is Sans-Serif and 'Merriweather' is Serif (from previous knowledge of fonts.ts)
        // Or better, check category
        
        // Actually, let's just cheat and check against the mock/real data if possible,
        // or just rely on the fact that we know 'Roboto' (default) is Sans-Serif, so it should CHANGE if we select Serif only.
    }
    
    // Since we are using the REAL useGoogleFonts which imports REAL fonts.ts, we can check actual names
    // 'Roboto' is Sans-Serif.
    // If we limit to Serif, 'Roboto' should not be selected.
    // However, if the current font is 'Roboto' and we click random, it should change to a Serif font.
    
    const serifFonts = [
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
    ]
    
    expect(serifFonts).toContain(selectedFont.value)
  })
})
