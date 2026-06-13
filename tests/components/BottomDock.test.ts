import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BottomDock from '../../app/components/BottomDock.vue'
import type { FontCategory } from '../../app/types'

describe('BottomDock', () => {
  let wrapper: ReturnType<typeof mount>

  const defaultProps = {
    selectedFont: 'Satoshi',
    fontSize: 48,
    fontWeight: 400,
    letterSpacing: 0,
    fontColor: '#141413',
    previewBg: 'white' as const,
    layoutDirection: 'horizontal' as const,
    isSaved: false,
    canBack: false,
    canForward: false,
    specimenText: 'Acme',
    fontCategories: { 'Sans': ['Satoshi'] },
    allCategories: ['Sans'] as FontCategory[],
    selectedCategories: ['Sans'] as FontCategory[],
    installedFontsLoaded: false
  }

  beforeEach(() => {
    wrapper = mount(BottomDock, {
      props: defaultProps
    })
  })

  it('shows the selected font name', () => {
    expect(wrapper.text()).toContain('Satoshi')
  })

  it('emits randomize when shuffle is clicked', async () => {
    await wrapper.find('button[title="Try a random font (Space)"]').trigger('click')

    expect(wrapper.emitted('randomize')).toBeTruthy()
  })

  it('emits toggle-save when the heart is clicked', async () => {
    await wrapper.find('button[aria-label="Save this match"]').trigger('click')

    expect(wrapper.emitted('toggle-save')).toBeTruthy()
  })

  it('disables history buttons when there is nowhere to go', () => {
    const back = wrapper.find('button[aria-label="Previous font"]')
    const forward = wrapper.find('button[aria-label="Next font"]')

    expect(back.attributes('disabled')).toBeDefined()
    expect(forward.attributes('disabled')).toBeDefined()
  })

  it('emits back/forward when history is available', async () => {
    await wrapper.setProps({ canBack: true, canForward: true })

    await wrapper.find('button[aria-label="Previous font"]').trigger('click')
    await wrapper.find('button[aria-label="Next font"]').trigger('click')

    expect(wrapper.emitted('back')).toBeTruthy()
    expect(wrapper.emitted('forward')).toBeTruthy()
  })

  it('toggles the canvas background', async () => {
    await wrapper.find('button[aria-label="Switch to dark canvas"]').trigger('click')

    expect(wrapper.emitted('update:previewBg')?.[0]).toEqual(['black'])
  })

  it('toggles the layout direction', async () => {
    await wrapper.find('button[aria-label="Stack logo above text"]').trigger('click')

    expect(wrapper.emitted('update:layoutDirection')?.[0]).toEqual(['vertical'])
  })

  it('opens the font panel and forwards a selection', async () => {
    await wrapper.find('button[title="Browse fonts"]').trigger('click')

    const row = wrapper.find('[data-font="Satoshi"]')
    expect(row.exists()).toBe(true)

    await row.trigger('click')
    expect(wrapper.emitted('update:selectedFont')?.[0]).toEqual(['Satoshi'])
  })

  it('opens the tune panel with sliders', async () => {
    await wrapper.find('button[title="Tune size, weight & spacing"]').trigger('click')

    const sliders = wrapper.findAll('input[type="range"]')
    expect(sliders).toHaveLength(3)
  })

  it('emits font size updates from the tune panel', async () => {
    await wrapper.find('button[title="Tune size, weight & spacing"]').trigger('click')

    const sizeSlider = wrapper.find('input[aria-label="Size"]')
    await sizeSlider.setValue('72')

    expect(wrapper.emitted('update:fontSize')?.[0]).toEqual([72])
  })

  it('emits color updates from the color panel', async () => {
    await wrapper.find('button[title="Wordmark color"]').trigger('click')

    await wrapper.find('button[aria-label="Set color #FF5436"]').trigger('click')

    expect(wrapper.emitted('update:fontColor')?.[0]).toEqual(['#FF5436'])
  })
})
