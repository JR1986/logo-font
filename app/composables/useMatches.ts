import { ref } from 'vue'
import type { FontCategory } from '~/types'

export interface SavedMatch {
  id: string
  font: string
  text: string
  fontSize: number
  fontWeight: number
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

  return {
    matches,
    saveMatch,
    removeMatch
  }
}
