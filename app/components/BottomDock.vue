<template>
  <div class="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-4 md:pb-6">
    <!-- Click-outside layer for popovers -->
    <div v-if="panel" class="pointer-events-auto fixed inset-0" @click="closePanel"></div>

    <div class="pointer-events-auto relative flex max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-ink/10 bg-white/95 p-1.5 shadow-dock backdrop-blur-md transition-colors dark:border-white/10 dark:bg-stone-900/95">
      <!-- Font selector -->
      <button
        class="flex h-11 min-w-0 items-center gap-2.5 rounded-xl px-3 transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:hover:bg-white/10"
        :class="{ 'bg-ink/5 dark:bg-white/10': panel === 'font' }"
        :aria-expanded="panel === 'font'"
        aria-haspopup="true"
        title="Browse fonts"
        @click="togglePanel('font')"
      >
        <span class="text-xl leading-none text-ink dark:text-white" :style="{ fontFamily: `'${selectedFont}'` }" aria-hidden="true">Ag</span>
        <span class="max-w-[8.5rem] truncate text-sm font-bold text-ink dark:text-white">{{ selectedFont }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5 shrink-0 text-ink/40 transition-transform dark:text-stone-500" :class="{ 'rotate-180': panel === 'font' }">
          <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832 6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06Z" clip-rule="evenodd" />
        </svg>
      </button>

      <div class="mx-0.5 h-6 w-px bg-ink/10 dark:bg-white/10" aria-hidden="true"></div>

      <!-- Tune (size / weight / spacing) -->
      <button
        class="flex h-11 w-11 items-center justify-center rounded-xl text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
        :class="{ 'bg-ink/5 text-ink dark:bg-white/10 dark:text-white': panel === 'tune' }"
        :aria-expanded="panel === 'tune'"
        aria-haspopup="true"
        title="Tune size, weight & spacing"
        @click="togglePanel('tune')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-5 w-5">
          <line x1="4" y1="6" x2="20" y2="6" /><circle cx="9" cy="6" r="2.2" fill="currentColor" stroke="none" />
          <line x1="4" y1="12" x2="20" y2="12" /><circle cx="15" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <line x1="4" y1="18" x2="20" y2="18" /><circle cx="7" cy="18" r="2.2" fill="currentColor" stroke="none" />
        </svg>
      </button>

      <!-- Color -->
      <button
        class="flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:hover:bg-white/10"
        :class="{ 'bg-ink/5 dark:bg-white/10': panel === 'color' }"
        :aria-expanded="panel === 'color'"
        aria-haspopup="true"
        title="Wordmark color"
        @click="togglePanel('color')"
      >
        <span class="h-5 w-5 rounded-full border-2 border-white shadow ring-1 ring-ink/15 dark:ring-white/20" :style="{ backgroundColor: fontColor }"></span>
      </button>

      <!-- Canvas light/dark -->
      <button
        class="flex h-11 w-11 items-center justify-center rounded-xl text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
        :title="previewBg === 'white' ? 'Switch to dark canvas' : 'Switch to light canvas'"
        :aria-label="previewBg === 'white' ? 'Switch to dark canvas' : 'Switch to light canvas'"
        @click="$emit('update:previewBg', previewBg === 'white' ? 'black' : 'white')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
        </svg>
      </button>

      <!-- Layout direction -->
      <button
        class="flex h-11 w-11 items-center justify-center rounded-xl text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
        :title="layoutDirection === 'horizontal' ? 'Stack logo above text' : 'Place logo beside text'"
        :aria-label="layoutDirection === 'horizontal' ? 'Stack logo above text' : 'Place logo beside text'"
        @click="$emit('update:layoutDirection', layoutDirection === 'horizontal' ? 'vertical' : 'horizontal')"
      >
        <svg v-if="layoutDirection === 'horizontal'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-5 w-5">
          <rect x="3" y="8" width="8" height="8" rx="2" />
          <line x1="14" y1="10" x2="21" y2="10" /><line x1="14" y1="14" x2="19" y2="14" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-5 w-5">
          <rect x="8" y="3" width="8" height="8" rx="2" />
          <line x1="7" y1="15" x2="17" y2="15" /><line x1="9" y1="19" x2="15" y2="19" />
        </svg>
      </button>

      <div class="mx-0.5 h-6 w-px bg-ink/10 dark:bg-white/10" aria-hidden="true"></div>

      <!-- History -->
      <button
        class="flex h-11 w-9 items-center justify-center rounded-xl text-ink/60 transition-colors enabled:hover:bg-ink/5 enabled:hover:text-ink disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-400 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-white"
        :disabled="!canBack"
        title="Previous font (←)"
        aria-label="Previous font"
        @click="$emit('back')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
          <path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd" />
        </svg>
      </button>
      <button
        class="flex h-11 w-9 items-center justify-center rounded-xl text-ink/60 transition-colors enabled:hover:bg-ink/5 enabled:hover:text-ink disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-400 dark:enabled:hover:bg-white/10 dark:enabled:hover:text-white"
        :disabled="!canForward"
        title="Next font (→)"
        aria-label="Next font"
        @click="$emit('forward')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
          <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Shuffle -->
      <button
        class="flex h-11 items-center gap-2 rounded-xl bg-sun px-4 text-xs font-black uppercase tracking-widest text-ink shadow-sm transition-all hover:bg-sun-deep active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink dark:focus-visible:ring-white"
        title="Try a random font (Space)"
        @click="$emit('randomize')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="m15 15 6 6" /><path d="M4 4l5 5" />
        </svg>
        Shuffle
        <kbd class="hidden rounded-md bg-ink/10 px-1.5 py-0.5 font-sans text-[9px] font-black normal-case md:inline">space</kbd>
      </button>

      <!-- Save -->
      <button
        class="flex h-11 w-11 items-center justify-center rounded-xl transition-all hover:bg-coral/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral active:scale-90"
        :class="isSaved ? 'text-coral' : 'text-ink/50 hover:text-coral dark:text-stone-400'"
        :title="isSaved ? 'Remove from saved (S)' : 'Save this match (S)'"
        :aria-label="isSaved ? 'Remove from saved matches' : 'Save this match'"
        :aria-pressed="isSaved"
        @click="$emit('toggle-save')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" class="h-5 w-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      <!-- Popovers -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="panel" class="absolute bottom-full left-1/2 mb-3 -translate-x-1/2">
          <!-- Font browser -->
          <FontPanel
            v-if="panel === 'font'"
            :font-categories="fontCategories"
            :all-categories="allCategories"
            :selected-categories="selectedCategories"
            :selected-font="selectedFont"
            :specimen-text="specimenText"
            :installed-fonts-loaded="installedFontsLoaded"
            @select="selectFont"
            @update:selected-categories="$emit('update:selectedCategories', $event)"
            @load-font="$emit('load-font', $event)"
            @load-installed-fonts="$emit('load-installed-fonts')"
          />

          <!-- Tune sliders -->
          <div v-else-if="panel === 'tune'" class="w-72 rounded-2xl border border-ink/10 bg-white p-5 shadow-pop dark:border-white/10 dark:bg-stone-900">
            <div v-for="slider in sliders" :key="slider.key" class="mb-4 last:mb-0">
              <div class="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span class="text-ink/50 dark:text-stone-400">{{ slider.label }}</span>
                <span class="rounded-md bg-sun/30 px-1.5 py-0.5 text-ink dark:text-sun dark:bg-sun/10">{{ slider.value }}{{ slider.unit }}</span>
              </div>
              <input
                type="range"
                :value="slider.value"
                :min="slider.min"
                :max="slider.max"
                :step="slider.step"
                :aria-label="slider.label"
                class="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/10 accent-ink dark:bg-white/15 dark:accent-sun"
                @input="slider.update(Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>

          <!-- Color swatches -->
          <div v-else-if="panel === 'color'" class="w-64 rounded-2xl border border-ink/10 bg-white p-4 shadow-pop dark:border-white/10 dark:bg-stone-900">
            <div class="mb-3 text-[10px] font-black uppercase tracking-widest text-ink/50 dark:text-stone-400">Wordmark color</div>
            <div class="mb-3 grid grid-cols-6 gap-2">
              <button
                v-for="swatch in swatches"
                :key="swatch"
                class="h-8 w-8 rounded-full border border-ink/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:border-white/20"
                :class="{ 'ring-2 ring-ink ring-offset-2 dark:ring-white dark:ring-offset-stone-900': fontColor.toLowerCase() === swatch.toLowerCase() }"
                :style="{ backgroundColor: swatch }"
                :aria-label="`Set color ${swatch}`"
                :title="swatch"
                @click="$emit('update:fontColor', swatch)"
              ></button>
            </div>
            <label class="flex cursor-pointer items-center gap-2.5 rounded-xl bg-paper px-3 py-2 dark:bg-stone-800">
              <input
                type="color"
                :value="fontColor"
                class="h-7 w-9 cursor-pointer rounded border-none bg-transparent p-0"
                aria-label="Custom wordmark color"
                @input="$emit('update:fontColor', ($event.target as HTMLInputElement).value)"
              />
              <span class="text-xs font-bold uppercase tracking-widest text-ink/70 dark:text-stone-300">{{ fontColor }}</span>
            </label>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FontPanel from '~/components/FontPanel.vue'
import type { FontCategories, FontCategory } from '~/types'

interface Props {
  selectedFont: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
  previewBg: 'white' | 'black'
  layoutDirection: 'horizontal' | 'vertical'
  isSaved: boolean
  canBack: boolean
  canForward: boolean
  specimenText?: string
  fontCategories: Partial<FontCategories>
  allCategories: FontCategory[]
  selectedCategories: FontCategory[]
  installedFontsLoaded: boolean
}

const props = withDefaults(defineProps<Props>(), {
  specimenText: ''
})

const emit = defineEmits<{
  (e: 'update:selectedFont', value: string): void
  (e: 'update:fontSize', value: number): void
  (e: 'update:fontWeight', value: number): void
  (e: 'update:letterSpacing', value: number): void
  (e: 'update:fontColor', value: string): void
  (e: 'update:previewBg', value: 'white' | 'black'): void
  (e: 'update:layoutDirection', value: 'horizontal' | 'vertical'): void
  (e: 'update:selectedCategories', value: FontCategory[]): void
  (e: 'randomize'): void
  (e: 'back'): void
  (e: 'forward'): void
  (e: 'toggle-save'): void
  (e: 'load-font', font: string): void
  (e: 'load-installed-fonts'): void
}>()

type PanelType = 'font' | 'tune' | 'color' | null
const panel = ref<PanelType>(null)

const swatches = [
  '#141413', '#FFFFFF', '#FF5436', '#FFC700', '#4F46E5', '#0EA5E9',
  '#10B981', '#EC4899', '#8B5CF6', '#F97316', '#64748B', '#A16207'
]

const sliders = computed(() => [
  {
    key: 'size',
    label: 'Size',
    value: props.fontSize,
    unit: 'px',
    min: 16,
    max: 160,
    step: 1,
    update: (v: number) => emit('update:fontSize', v)
  },
  {
    key: 'weight',
    label: 'Weight',
    value: props.fontWeight,
    unit: '',
    min: 100,
    max: 900,
    step: 100,
    update: (v: number) => emit('update:fontWeight', v)
  },
  {
    key: 'spacing',
    label: 'Spacing',
    value: props.letterSpacing,
    unit: 'px',
    min: -5,
    max: 20,
    step: 1,
    update: (v: number) => emit('update:letterSpacing', v)
  }
])

function togglePanel(type: PanelType) {
  panel.value = panel.value === type ? null : type
}

function closePanel() {
  panel.value = null
}

function selectFont(font: string) {
  emit('update:selectedFont', font)
  panel.value = null
}

defineExpose({ closePanel, togglePanel })
</script>
