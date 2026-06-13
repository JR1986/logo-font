import { onMounted, onUnmounted } from 'vue'
import type { KeyboardShortcut } from '~/types'

/**
 * Composable for managing keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  function isTypingTarget(target: HTMLElement): boolean {
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      return true
    }
    // Skip contenteditable regions (e.g. the inline wordmark editor)
    if (target.isContentEditable) {
      return true
    }
    return !!target.closest?.(
      '[contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]'
    )
  }

  function handleKeyDown(event: KeyboardEvent): void {
    // Skip if user is typing in an input field
    const target = event.target as HTMLElement
    if (isTypingTarget(target)) {
      return
    }

    for (const shortcut of shortcuts) {
      if (event.code === shortcut.code) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault()
        }
        shortcut.handler()
        break
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}
