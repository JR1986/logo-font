import { ref } from 'vue'
import type { FontCategory } from '~/types'

export interface SavedMatch {
  id: string
  font: string
  text: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  logo: string | null
  fontColor: string
  fontCategory: FontCategory | null
  timestamp: number
}

// Global state to persist across component re-renders
const matches = ref<SavedMatch[]>([])

export function useMatches() {
  function saveMatch(match: Omit<SavedMatch, 'id' | 'timestamp'>) {
    const newMatch: SavedMatch = {
      ...match,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    }
    matches.value.unshift(newMatch) // Add to beginning
  }

  function removeMatch(id: string) {
    matches.value = matches.value.filter(m => m.id !== id)
  }

  function findMatchId(match: Omit<SavedMatch, 'id' | 'timestamp'>): string | undefined {
    return matches.value.find(m => 
      m.font === match.font &&
      m.text === match.text &&
      m.fontSize === match.fontSize &&
      m.fontWeight === match.fontWeight &&
      m.letterSpacing === match.letterSpacing &&
      m.logo === match.logo &&
      m.fontColor === match.fontColor &&
      m.fontCategory === match.fontCategory
    )?.id
  }

  function isMatchSaved(match: Omit<SavedMatch, 'id' | 'timestamp'>): boolean {
    return !!findMatchId(match)
  }

  return {
    matches,
    saveMatch,
    removeMatch,
    findMatchId,
    isMatchSaved
  }
}
