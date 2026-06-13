import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SavedDrawer from '../../app/components/SavedDrawer.vue'

const hoisted = vi.hoisted(() => ({
  matches: [] as any[],
  removeMatch: vi.fn()
}))

vi.mock('~/composables/useMatches', async () => {
  const { ref } = await import('vue')
  return {
    useMatches: () => ({
      matches: ref(hoisted.matches),
      removeMatch: hoisted.removeMatch
    })
  }
})

const sampleMatch = {
  id: 'match-1',
  font: 'Satoshi',
  text: 'Acme Studio',
  fontSize: 48,
  fontWeight: 700,
  letterSpacing: 0,
  logo: null,
  fontColor: '#141413',
  fontCategory: 'Sans',
  previewBg: 'white' as const,
  direction: 'horizontal' as const,
  timestamp: 1234567890
}

function mountDrawer(open = true) {
  return mount(SavedDrawer, {
    props: { open },
    global: {
      stubs: { teleport: true }
    }
  })
}

describe('SavedDrawer', () => {
  beforeEach(() => {
    hoisted.matches.length = 0
    hoisted.matches.push({ ...sampleMatch })
    hoisted.removeMatch.mockClear()
  })

  it('renders saved matches with font meta', () => {
    const wrapper = mountDrawer()

    expect(wrapper.text()).toContain('Acme Studio')
    expect(wrapper.text()).toContain('Satoshi')
    expect(wrapper.text()).toContain('700')
  })

  it('renders nothing when closed', () => {
    const wrapper = mountDrawer(false)

    expect(wrapper.find('aside').exists()).toBe(false)
  })

  it('emits apply when a match preview is clicked', async () => {
    const wrapper = mountDrawer()

    await wrapper.find('button[title="Load Satoshi in the editor"]').trigger('click')

    const applied = wrapper.emitted('apply')?.[0]?.[0] as typeof sampleMatch
    expect(applied.font).toBe('Satoshi')
    expect(applied.id).toBe('match-1')
  })

  it('calls removeMatch when delete is clicked', async () => {
    const wrapper = mountDrawer()

    await wrapper.find('button[title="Delete this match"]').trigger('click')

    expect(hoisted.removeMatch).toHaveBeenCalledWith('match-1')
  })

  it('emits close when the backdrop is clicked', async () => {
    const wrapper = mountDrawer()

    await wrapper.find('.fixed.inset-0').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('shows an empty state when there are no matches', () => {
    hoisted.matches.length = 0
    const wrapper = mountDrawer()

    expect(wrapper.text()).toContain('Nothing saved yet')
  })
})
