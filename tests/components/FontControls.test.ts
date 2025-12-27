import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FontControls from '~/components/FontControls.vue'

describe('FontControls', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(FontControls, {
      props: {
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: 0,
        fontColor: '#000000',
        previewBg: 'white'
      }
    })
  })

  it('renders inputs with correct values', () => {
    const sizeInput = wrapper.find('input[type="range"][id="font-size"]').element as HTMLInputElement
    const weightInput = wrapper.find('input[type="range"][id="font-weight"]').element as HTMLInputElement
    const colorInput = wrapper.find('input[type="color"]').element as HTMLInputElement

    expect(Number(sizeInput.value)).toBe(24)
    expect(Number(weightInput.value)).toBe(500)
    expect(colorInput.value).toBe('#000000')
  })

  it('emits update events on input', async () => {
    const sizeInput = wrapper.find('input[type="range"][id="font-size"]')
    await sizeInput.setValue(32)
    expect(wrapper.emitted('update:fontSize')?.[0]).toEqual([32])

    const weightInput = wrapper.find('input[type="range"][id="font-weight"]')
    await weightInput.setValue(700)
    expect(wrapper.emitted('update:fontWeight')?.[0]).toEqual([700])

    const colorInput = wrapper.find('input[type="color"]')
    await colorInput.setValue('#ff0000')
    expect(wrapper.emitted('update:fontColor')?.[0]).toEqual(['#ff0000'])
  })

  it('emits update:previewBg when toggle buttons are clicked', async () => {
    // Find Light and Dark buttons
    const buttons = wrapper.findAll('button')
    const lightBtn = buttons.find((b: any) => b.text() === 'Light')
    const darkBtn = buttons.find((b: any) => b.text() === 'Dark')

    await darkBtn.trigger('click')
    expect(wrapper.emitted('update:previewBg')?.[0]).toEqual(['black'])

    await lightBtn.trigger('click')
    expect(wrapper.emitted('update:previewBg')?.[1]).toEqual(['white'])
  })
})
