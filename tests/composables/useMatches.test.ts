import { describe, it, expect } from 'vitest'
import { useMatches } from '../../app/composables/useMatches'
import type { SavedMatch } from '../../app/composables/useMatches'

describe('useMatches', () => {
  it('should save a match', () => {
    const { matches, saveMatch } = useMatches()
    const matchData: Omit<SavedMatch, 'id' | 'timestamp'> = {
      font: 'Roboto',
      text: 'Test',
      fontSize: 16,
      fontWeight: 400,
      logo: null,
      fontColor: '#000000',
      fontCategory: 'Sans-Serif'
    }

    saveMatch(matchData)
    expect(matches.value).toHaveLength(1)
    expect(matches.value[0].font).toBe('Roboto')
    expect(matches.value[0].id).toBeDefined()
  })

  it('should remove a match', () => {
    const { matches, saveMatch, removeMatch } = useMatches()
    matches.value = [] // Reset
    
    saveMatch({
        font: 'Roboto',
        text: 'Test',
        fontSize: 16,
        fontWeight: 400,
        logo: null,
        fontColor: '#000000',
        fontCategory: 'Sans-Serif'
      })

    const id = matches.value[0].id
    removeMatch(id)
    expect(matches.value).toHaveLength(0)
  })
})
