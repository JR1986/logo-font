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
  previewBg: 'white' | 'black'
  direction: 'horizontal' | 'vertical'
  timestamp: number
}

const STORAGE_KEY = 'logofont:matches'

// Global state to persist across component re-renders
const matches = ref<SavedMatch[]>([])
let hydrated = false

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matches.value))
  } catch {
    // Quota exceeded — logos are data URLs and can be large.
    // Retry without the logo images so the font matches themselves survive.
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(matches.value.map(m => ({ ...m, logo: null })))
      )
    } catch {
      console.warn('logofont: unable to persist saved matches')
    }
  }
}

function hydrate() {
  if (hydrated || typeof window === 'undefined' || !window.localStorage) return
  hydrated = true

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        matches.value = parsed
      }
    }
  } catch {
    console.warn('logofont: could not read saved matches from storage')
  }
}

export function useMatches() {
  hydrate()

  // Persistence is explicit (not a watcher): a watcher registered during a
  // component's setup dies with that component's effect scope.
  function saveMatch(match: Omit<SavedMatch, 'id' | 'timestamp'>) {
    const newMatch: SavedMatch = {
      ...match,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    }
    matches.value.unshift(newMatch) // Add to beginning
    persist()
  }

  function removeMatch(id: string) {
    matches.value = matches.value.filter(m => m.id !== id)
    persist()
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
