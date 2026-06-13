import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('useKeyboardShortcuts', () => {
  let addEventListenerSpy: any
  let removeEventListenerSpy: any

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should attach event listener on mount', async () => {
    const TestComponent = defineComponent({
      setup() {
        useKeyboardShortcuts([])
        return {}
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('should execute handler when shortcut matches', async () => {
    const handler = vi.fn()
    const TestComponent = defineComponent({
      setup() {
        useKeyboardShortcuts([
          { code: 'Space', handler }
        ])
        return {}
      },
      template: '<div></div>'
    })

    mount(TestComponent)
    
    // Simulate keydown
    const event = new KeyboardEvent('keydown', { code: 'Space' })
    window.dispatchEvent(event)
    
    expect(handler).toHaveBeenCalled()
  })

  it('should respect preventDefault', async () => {
    const handler = vi.fn()
    const TestComponent = defineComponent({
      setup() {
        useKeyboardShortcuts([
          { code: 'Enter', handler, preventDefault: true }
        ])
        return {}
      },
      template: '<div></div>'
    })

    mount(TestComponent)

    const event = new KeyboardEvent('keydown', { code: 'Enter' })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(handler).toHaveBeenCalled()
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should not fire while typing in an input', () => {
    const handler = vi.fn()
    const TestComponent = defineComponent({
      setup() {
        useKeyboardShortcuts([{ code: 'Space', handler }])
        return {}
      },
      template: '<div></div>'
    })

    mount(TestComponent)

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

    expect(handler).not.toHaveBeenCalled()
    input.remove()
  })

  it('should not fire while typing in a contenteditable element', () => {
    const handler = vi.fn()
    const TestComponent = defineComponent({
      setup() {
        useKeyboardShortcuts([{ code: 'Space', handler }])
        return {}
      },
      template: '<div></div>'
    })

    mount(TestComponent)

    const editable = document.createElement('div')
    editable.setAttribute('contenteditable', 'plaintext-only')
    document.body.appendChild(editable)
    editable.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }))

    expect(handler).not.toHaveBeenCalled()
    editable.remove()
  })
})
