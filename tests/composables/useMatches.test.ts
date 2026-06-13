import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useMatches } from '../../app/composables/useMatches'
import type { SavedMatch } from '../../app/composables/useMatches'

const STORAGE_KEY = 'logofont:matches'

function makeMatchData(overrides: Partial<Omit<SavedMatch, 'id' | 'timestamp'>> = {}): Omit<SavedMatch, 'id' | 'timestamp'> {
  return {
    font: 'Satoshi',
    text: 'Test',
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 0,
    logo: null,
    fontColor: '#000000',
    fontCategory: 'Sans',
    previewBg: 'white',
    direction: 'horizontal',
    ...overrides
  }
}

describe('useMatches', () => {
  beforeEach(() => {
    const { matches } = useMatches()
    matches.value = []
    localStorage.clear()
  })

  it('saves a match', () => {
    const { matches, saveMatch } = useMatches()

    saveMatch(makeMatchData())

    expect(matches.value).toHaveLength(1)
    expect(matches.value[0]!.font).toBe('Satoshi')
    expect(matches.value[0]!.id).toBeDefined()
  })

  it('removes a match', () => {
    const { matches, saveMatch, removeMatch } = useMatches()

    saveMatch(makeMatchData())
    const id = matches.value[0]!.id
    removeMatch(id)

    expect(matches.value).toHaveLength(0)
  })

  it('detects whether the current config is already saved', () => {
    const { saveMatch, isMatchSaved } = useMatches()
    const data = makeMatchData()

    expect(isMatchSaved(data)).toBe(false)
    saveMatch(data)
    expect(isMatchSaved(data)).toBe(true)
    expect(isMatchSaved(makeMatchData({ font: 'Sentient' }))).toBe(false)
  })

  it('persists matches to localStorage', async () => {
    const { saveMatch } = useMatches()

    saveMatch(makeMatchData({ font: 'Zodiak' }))
    await nextTick()

    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).toBeTruthy()
    expect(JSON.parse(stored!)[0].font).toBe('Zodiak')
  })

  it('hydrates matches from localStorage on first use', async () => {
    const saved: SavedMatch = {
      ...makeMatchData({ font: 'Clash Display' }),
      id: 'persisted-1',
      timestamp: 123
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([saved]))

    // Fresh module so the hydration path runs again
    vi.resetModules()
    const { useMatches: freshUseMatches } = await import('../../app/composables/useMatches')
    const { matches } = freshUseMatches()

    expect(matches.value).toHaveLength(1)
    expect(matches.value[0]!.font).toBe('Clash Display')
  })

  it('ignores corrupt storage data', async () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    vi.resetModules()
    const { useMatches: freshUseMatches } = await import('../../app/composables/useMatches')
    const { matches } = freshUseMatches()

    expect(matches.value).toEqual([])
    warnSpy.mockRestore()
  })
})
