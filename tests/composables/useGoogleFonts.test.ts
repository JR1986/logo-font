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
    const { selectedFont, selectRandomFont } = useGoogleFonts()
    const initialFont = selectedFont.value
    
    // Attempt multiple times to ensure change (randomness might pick same, although while loop prevents it)
    selectRandomFont()
    
    expect(selectedFont.value).not.toBe(initialFont)
    expect(mockCreateElement).toHaveBeenCalled() // Should trigger load
  })
})
