import { ref, watch } from 'vue'
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
  previewBg: 'white' | 'black'
  direction: 'horizontal' | 'vertical'
  timestamp: number
}

const STORAGE_KEY = 'logo-font:matches'

/**
 * Load persisted matches from localStorage (client only).
 */
function loadMatches(): SavedMatch[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Failed to load saved matches:', e)
    return []
  }
}

// Global state to persist across component re-renders
const matches = ref<SavedMatch[]>(loadMatches())

// Persist to localStorage whenever matches change (client only)
if (typeof window !== 'undefined') {
  watch(
    matches,
    (value) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch (e) {
        console.error('Failed to persist saved matches:', e)
      }
    },
    { deep: true }
  )
}

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
      m.fontCategory === match.fontCategory &&
      m.previewBg === match.previewBg &&
      m.direction === match.direction
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
