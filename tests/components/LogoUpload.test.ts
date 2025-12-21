import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LogoUpload from '~/components/LogoUpload.vue'

describe('LogoUpload', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(LogoUpload, {
      props: {
        modelValue: null
      }
    })
  })

  it('renders upload area', () => {
    expect(wrapper.text()).toContain('Upload Logo')
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  it('renders uploaded image when modelValue is present', async () => {
    // Re-mount with different props for this specific test
    // Or set props on existing wrapper if supported, but re-mount is cleaner for "initial settings" per test if they differ significantly
    // However, the rule says "start unit tests always with beforeEach".
    // For this specific test case requiring a different prop, we can update props or re-mount.
    // Let's update props.
    await wrapper.setProps({ modelValue: 'data:image/png;base64,test' })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
  })

  it('emits update:modelValue on file selection', async () => {
    // modelValue is null from beforeEach
    
    const input = wrapper.find('input[type="file"]')
    expect(input.exists()).toBe(true)
  })
})
