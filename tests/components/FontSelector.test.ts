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
        fontCategories: mockCategories
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
})
