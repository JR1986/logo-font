import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewArea from '~/components/PreviewArea.vue'

describe('PreviewArea', () => {
  const defaultProps = {
    logo: null,
    text: 'Company Name',
    font: 'Roboto',
    fontSize: 24,
    fontWeight: 400,
    fontColor: '#000000',
    fontCategory: 'Sans Serif'
  }

  it('renders text with correct styles', () => {
    const wrapper = mount(PreviewArea, {
      props: defaultProps
    })

    const textElement = wrapper.find('.transition-all')
    expect(textElement.text()).toBe('Company Name')
    
    const style = textElement.attributes('style')
    expect(style).toContain('font-family: Roboto')
    expect(style).toContain('font-size: 24px')
    expect(style).toContain('font-weight: 400')
    expect(style).toContain('color: #000000')
  })

  it('renders logo when provided', () => {
    const wrapper = mount(PreviewArea, {
      props: {
        ...defaultProps,
        logo: 'logo.png'
      }
    })

    const img = wrapper.find('img[alt="Logo preview"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('logo.png')
  })

  it('renders font info', () => {
    const wrapper = mount(PreviewArea, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Font: Roboto')
    expect(wrapper.text()).toContain('(Sans Serif)')
  })
})
