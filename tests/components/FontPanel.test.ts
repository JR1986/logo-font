import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FontPanel from '../../app/components/FontPanel.vue'
import type { FontCategory } from '../../app/types'

describe('FontPanel', () => {
  let wrapper: ReturnType<typeof mount>

  const defaultProps = {
    fontCategories: {
      'Sans': ['Satoshi', 'General Sans'],
      'Serif': ['Sentient']
    },
    allCategories: ['Popular', 'Sans', 'Serif'] as FontCategory[],
    selectedCategories: ['Sans', 'Serif'] as FontCategory[],
    selectedFont: 'Satoshi',
    specimenText: 'Acme Studio',
    installedFontsLoaded: false
  }

  beforeEach(() => {
    wrapper = mount(FontPanel, {
      props: defaultProps
    })
  })

  it('renders category headers and font rows with the specimen text', () => {
    expect(wrapper.text()).toContain('Sans')
    expect(wrapper.text()).toContain('Serif')
    expect(wrapper.text()).toContain('Satoshi')
    expect(wrapper.text()).toContain('Sentient')

    const specimens = wrapper.findAll('[data-font]')
    expect(specimens).toHaveLength(3)
    expect(specimens[0]!.text()).toContain('Acme Studio')
  })

  it('emits select when a font row is clicked', async () => {
    await wrapper.find('[data-font="Sentient"]').trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual(['Sentient'])
  })

  it('filters fonts by search query', async () => {
    await wrapper.find('input[type="text"]').setValue('sent')

    expect(wrapper.findAll('[data-font]')).toHaveLength(1)
    expect(wrapper.find('[data-font="Sentient"]').exists()).toBe(true)
  })

  it('shows an empty state when nothing matches', async () => {
    await wrapper.find('input[type="text"]').setValue('zzzz')

    expect(wrapper.findAll('[data-font]')).toHaveLength(0)
    expect(wrapper.text()).toContain('No fonts found')
  })

  it('emits update:selectedCategories when toggling a pill', async () => {
    const pills = wrapper.findAll('button[aria-pressed]')
    const sansPill = pills.find(p => p.text() === 'Sans')!

    await sansPill.trigger('click')

    expect(wrapper.emitted('update:selectedCategories')?.[0]).toEqual([['Serif']])
  })

  it('marks the selected font with a check', () => {
    const selectedRow = wrapper.find('[data-font="Satoshi"]')
    expect(selectedRow.find('svg').exists()).toBe(true)
  })

  it('offers to load local fonts until they are loaded', async () => {
    expect(wrapper.text()).toContain('My fonts')

    await wrapper.setProps({ installedFontsLoaded: true })
    expect(wrapper.text()).not.toContain('My fonts')
  })

  it('emits load-installed-fonts when requesting local fonts', async () => {
    const button = wrapper.findAll('button').find(b => b.text().includes('My fonts'))!
    await button.trigger('click')

    expect(wrapper.emitted('load-installed-fonts')).toBeTruthy()
  })
})
