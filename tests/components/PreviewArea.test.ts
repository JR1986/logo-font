import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PreviewArea from '../../app/components/PreviewArea.vue'

describe('PreviewArea', () => {
  let wrapper: ReturnType<typeof mount>
  const defaultProps = {
    logo: null,
    text: 'Company Name',
    font: 'Satoshi',
    fontSize: 24,
    fontWeight: 400,
    fontColor: '#000000',
    fontCategory: 'Sans',
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
    expect(style).toContain('Satoshi')
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

  it('shows the upload tile when no logo is set', () => {
    expect(wrapper.find('img[alt="Logo preview"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Your logo')
  })

  it('renders the font chip with name, category and weight', () => {
    expect(wrapper.text()).toContain('Satoshi')
    expect(wrapper.text()).toContain('Sans')
    expect(wrapper.text()).toContain('400')
  })

  it('links to Fontshare when a slug is provided', async () => {
    expect(wrapper.find('a[href*="fontshare.com"]').exists()).toBe(false)

    await wrapper.setProps({ fontSlug: 'satoshi' })

    const link = wrapper.find('a[href*="fontshare.com"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://www.fontshare.com/fonts/satoshi')
  })

  it('stacks vertically when direction is vertical', async () => {
    await wrapper.setProps({ direction: 'vertical' })
    expect(wrapper.find('.flex-col').exists()).toBe(true)
  })

  describe('editable mode', () => {
    beforeEach(() => {
      wrapper = mount(PreviewArea, {
        props: { ...defaultProps, editable: true }
      })
    })

    it('renders a contenteditable wordmark seeded with the text', () => {
      const editable = wrapper.find('[data-testid="preview-text"]')
      expect(editable.attributes('contenteditable')).toBe('plaintext-only')
      expect(editable.text()).toBe('Company Name')
    })

    it('emits update:text when typing', async () => {
      const editable = wrapper.find('[data-testid="preview-text"]')
      editable.element.textContent = 'New Brand'
      await editable.trigger('input')

      expect(wrapper.emitted('update:text')?.[0]).toEqual(['New Brand'])
    })

    it('emits update:logo with null when removing the logo', async () => {
      await wrapper.setProps({ logo: 'logo.png' })

      await wrapper.find('button[aria-label="Remove logo"]').trigger('click')

      expect(wrapper.emitted('update:logo')?.[0]).toEqual([null])
    })
  })
})
