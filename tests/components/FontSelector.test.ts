import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FontSelector from '~/components/FontSelector.vue'

describe('FontSelector', () => {
  let wrapper: any
  const mockCategories = {
    'Sans Serif': ['Roboto', 'Open Sans'],
    'Serif': ['Merriweather', 'Playfair Display']
  }

  beforeEach(() => {
    wrapper = mount(FontSelector, {
      props: {
        modelValue: 'Roboto',
        fontCategories: mockCategories,
        selectedCategories: ['Sans Serif', 'Serif'],
        allCategories: ['Sans Serif', 'Serif'],
        loadInstalled: async () => true
      }
    })
  })

  it('renders select with options', () => {
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
    expect(select.element.value).toBe('Roboto')
    
    const optgroups = wrapper.findAll('optgroup')
    expect(optgroups.length).toBe(2)
  })

  it('emits update:modelValue on change', async () => {
    const select = wrapper.find('select')
    await select.setValue('Merriweather')
    
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Merriweather'])
  })

  it('renders category checkboxes and emits update:selectedCategories', async () => {
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxes.length).toBe(2)
    
    // Uncheck first category
    await checkboxes[0].setValue(false)
    
    const emitted = wrapper.emitted('update:selectedCategories')
    expect(emitted).toBeTruthy()
    // First arg of first call should be array without 'Sans Serif'
    expect(emitted[0][0]).toEqual(['Serif'])
  })
})
