import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewArea from '../../app/components/PreviewArea.vue'

describe('PreviewArea', () => {
  let wrapper: any
  const defaultProps = {
    logo: null,
    text: 'Company Name',
    font: 'Roboto',
    fontSize: 24,
    fontWeight: 400,
    fontColor: '#000000',
    fontCategory: 'Sans Serif',
    letterSpacing: 0
  }

  beforeEach(() => {
    wrapper = mount(PreviewArea, {
      props: defaultProps
    })
  })

  it('renders text with correct styles', () => {
    const textElement = wrapper.find('[data-testid="preview-text"]')
    expect(textElement.text()).toBe('Company Name')
    
    const style = textElement.attributes('style')
    expect(style).toContain('font-family: Roboto')
    expect(style).toContain('font-size: 24px')
    expect(style).toContain('font-weight: 400')
    expect(style).toContain('color: #000000')
  })

  it('renders logo when provided', async () => {
    await wrapper.setProps({ logo: 'logo.png' })

    const img = wrapper.find('img[alt="Logo preview"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('logo.png')
  })

  it('renders font info', () => {
    expect(wrapper.text()).toContain('Font: Roboto')
    expect(wrapper.text()).toContain('(Sans Serif)')
  })

  it('applies correct background classes based on prop', async () => {
    // Default (white)
    expect(wrapper.find('.bg-white').exists()).toBe(true)
    expect(wrapper.find('.bg-slate-900').exists()).toBe(false)

    // Dark mode
    await wrapper.setProps({ previewBg: 'black' })
    expect(wrapper.find('.bg-slate-900').exists()).toBe(true)
    expect(wrapper.find('.bg-white').exists()).toBe(false)
  })
})
