import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SavedMatches from '../../app/components/SavedMatches.vue'

// Mock the useMatches composable
const mockMatches = [
  {
    id: '1',
    font: 'Roboto',
    text: 'Test Logo',
    fontSize: 24,
    fontWeight: 400,
    logo: null,
    fontColor: '#000000',
    fontCategory: 'Sans-Serif',
    timestamp: 1234567890
  }
]
const removeMatchMock = vi.fn()

vi.mock('~/composables/useMatches', async () => {
  const { ref } = await import('vue')
  return {
    useMatches: () => ({
      matches: ref(mockMatches),
      removeMatch: removeMatchMock
    })
  }
})

// Stub PreviewArea since it might have its own dependencies
const PreviewAreaStub = {
  template: '<div class="preview-area-stub"></div>',
  props: ['logo', 'text', 'font', 'fontSize', 'fontWeight', 'fontColor', 'fontCategory']
}

describe('SavedMatches', () => {
  it('renders saved matches', () => {
    const wrapper = mount(SavedMatches, {
      global: {
        stubs: {
          PreviewArea: PreviewAreaStub
        }
      }
    })

    expect(wrapper.text()).toContain('Saved Matches (1)')
    expect(wrapper.findAll('.preview-area-stub').length).toBe(1)
  })

  it('emits back event when back button is clicked', async () => {
    const wrapper = mount(SavedMatches, {
      global: {
        stubs: {
          PreviewArea: PreviewAreaStub
        }
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })
  
  // Note: Testing the delete button might require finding it specifically if there are multiple buttons
  it('calls removeMatch when delete button is clicked', async () => {
      const wrapper = mount(SavedMatches, {
        global: {
          stubs: {
            PreviewArea: PreviewAreaStub
          }
        }
      })
      
      // Find the delete button (it has a title attribute)
      const deleteBtn = wrapper.find('button[title="Remove match"]')
      await deleteBtn.trigger('click')
      
      expect(removeMatchMock).toHaveBeenCalledWith('1')
  })
})
