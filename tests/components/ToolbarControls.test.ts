import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolbarControls from '../../app/components/ToolbarControls.vue'

describe('ToolbarControls', () => {
  let wrapper: any

  const defaultProps = {
    previewText: 'Company Name',
    selectedFont: 'Roboto',
    fontCategories: {
      'Sans-Serif': ['Roboto', 'Open Sans'],
      'Serif': ['Merriweather', 'Playfair Display']
    },
    selectedCategories: ['Sans-Serif', 'Serif'],
    allCategories: ['Sans-Serif', 'Serif', 'Display'],
    installedFontsLoaded: false,
    fontSize: 48,
    fontWeight: 400,
    letterSpacing: 0,
    fontColor: '#000000',
    previewBg: 'white' as const,
    layoutDirection: 'horizontal'
  }

  beforeEach(() => {
    wrapper = mount(ToolbarControls, {
      props: defaultProps
    })
  })

  it('renders inputs with correct values', () => {
    const textInput = wrapper.find('input[type="text"]')
    expect((textInput.element as HTMLInputElement).value).toBe('Company Name')
    expect(wrapper.text()).toContain('Roboto')
  })

  it('emits update events when text input changes', async () => {
    const textInput = wrapper.find('input[type="text"]')
    await textInput.setValue('New Logo Text')
    expect(wrapper.emitted('update:previewText')?.[0]).toEqual(['New Logo Text'])
  })

  it('emits randomize event when random button is clicked', async () => {
    // There might be two random buttons (desktop/mobile). Let's grab the first one.
    const rb = wrapper.find('button[title="Try a random font (Space)"]')
    await rb.trigger('click')
    expect(wrapper.emitted('randomize')).toBeTruthy()
  })
})
