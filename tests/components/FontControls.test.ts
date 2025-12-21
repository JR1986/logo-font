import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FontControls from '~/components/FontControls.vue'

describe('FontControls', () => {
  it('renders inputs with correct values', () => {
    const wrapper = mount(FontControls, {
      props: {
        fontSize: 24,
        fontWeight: 500,
        fontColor: '#000000'
      }
    })

    const sizeInput = wrapper.find('input[type="range"][id="font-size"]').element as HTMLInputElement
    const weightInput = wrapper.find('input[type="range"][id="font-weight"]').element as HTMLInputElement
    const colorInput = wrapper.find('input[type="color"]').element as HTMLInputElement

    expect(Number(sizeInput.value)).toBe(24)
    expect(Number(weightInput.value)).toBe(500)
    expect(colorInput.value).toBe('#000000')
  })

  it('emits update events on input', async () => {
    const wrapper = mount(FontControls, {
      props: {
        fontSize: 24,
        fontWeight: 500,
        fontColor: '#000000'
      }
    })

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
})
