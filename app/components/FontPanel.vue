<template>
  <div class="flex max-h-[min(560px,60vh)] w-[min(94vw,26rem)] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-pop dark:border-white/10 dark:bg-stone-900">
    <!-- Search -->
    <div class="border-b border-ink/5 p-3 dark:border-white/5">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30 dark:text-stone-500">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search fonts…"
          aria-label="Search fonts"
          class="w-full rounded-xl border-none bg-paper py-2.5 pl-9 pr-4 text-sm font-semibold text-ink outline-none ring-sun/60 transition-shadow placeholder:text-ink/35 focus:ring-2 dark:bg-stone-800 dark:text-white dark:placeholder:text-stone-500"
          @keydown.stop
        />
      </div>
    </div>

    <!-- Category pills -->
    <div class="flex flex-wrap items-center gap-1.5 border-b border-ink/5 px-3 py-2.5 dark:border-white/5">
      <button
        v-for="category in allCategories"
        :key="category"
        :aria-pressed="selectedCategories.includes(category)"
        class="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun"
        :class="selectedCategories.includes(category)
          ? 'bg-ink text-white dark:bg-white dark:text-ink'
          : 'bg-ink/5 text-ink/50 hover:bg-ink/10 hover:text-ink dark:bg-white/10 dark:text-stone-400 dark:hover:text-white'"
        @click="toggleCategory(category)"
      >
        {{ category }}
      </button>

      <button
        v-if="!installedFontsLoaded"
        class="ml-auto rounded-full border border-dashed border-ink/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-ink/50 transition-colors hover:border-sun-deep hover:text-ink disabled:cursor-wait disabled:opacity-50 dark:border-white/20 dark:text-stone-400 dark:hover:text-white"
        :disabled="isLoadingLocal"
        title="Browse fonts installed on this computer"
        @click="loadLocal"
      >
        {{ isLoadingLocal ? 'Loading…' : '+ My fonts' }}
      </button>
    </div>

    <!-- Font list with live specimens -->
    <div ref="listRef" class="flex-1 overflow-y-auto overscroll-contain">
      <template v-for="(fontList, category) in visibleFonts" :key="category">
        <div class="sticky top-0 z-10 bg-paper/95 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-ink/40 backdrop-blur dark:bg-stone-800/95 dark:text-stone-500">
          {{ category }}
        </div>
        <button
          v-for="fontName in fontList"
          :key="`${category}-${fontName}`"
          :ref="registerRow"
          :data-font="fontName"
          class="group flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-sun/15 focus-visible:bg-sun/15 focus-visible:outline-none dark:hover:bg-sun/10"
          :class="{ 'bg-sun/20 dark:bg-sun/15': fontName === selectedFont }"
          @click="$emit('select', fontName)"
        >
          <span class="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-ink/40 dark:text-stone-500">
            {{ fontName }}
            <svg v-if="fontName === selectedFont" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5 text-ink dark:text-sun">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
            </svg>
          </span>
          <span class="truncate text-xl text-ink dark:text-white" :style="{ fontFamily: `'${fontName}'` }">
            {{ specimen }}
          </span>
        </button>
      </template>

      <div v-if="noResults" class="px-5 py-10 text-center">
        <p class="font-serif text-lg italic text-ink/60 dark:text-stone-400">No fonts found</p>
        <p class="mt-1 text-xs font-medium text-ink/40 dark:text-stone-500">Try another name or switch categories on.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, nextTick } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import type { FontCategories, FontCategory } from '~/types'

interface Props {
  fontCategories: Partial<FontCategories>
  allCategories: FontCategory[]
  selectedCategories: FontCategory[]
  selectedFont: string
  specimenText?: string
  installedFontsLoaded: boolean
}

const props = withDefaults(defineProps<Props>(), {
  specimenText: ''
})

const emit = defineEmits<{
  (e: 'select', font: string): void
  (e: 'update:selectedCategories', value: FontCategory[]): void
  (e: 'load-font', font: string): void
  (e: 'load-installed-fonts'): void
}>()

const searchQuery = ref('')
const isLoadingLocal = ref(false)
const listRef = ref<HTMLElement | null>(null)

const specimen = computed(() => props.specimenText.trim() || 'Almost before we knew it')

const visibleFonts = computed<Partial<FontCategories>>(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return props.fontCategories

  const filtered: Partial<FontCategories> = {}
  for (const [category, fonts] of Object.entries(props.fontCategories)) {
    const matching = fonts.filter(font => font.toLowerCase().includes(query))
    if (matching.length > 0) {
      filtered[category as FontCategory] = matching
    }
  }
  return filtered
})

const noResults = computed(() => Object.keys(visibleFonts.value).length === 0)

function toggleCategory(category: FontCategory) {
  const next = [...props.selectedCategories]
  const index = next.indexOf(category)
  if (index === -1) {
    next.push(category)
  } else {
    next.splice(index, 1)
  }
  emit('update:selectedCategories', next)
}

async function loadLocal() {
  isLoadingLocal.value = true
  try {
    emit('load-installed-fonts')
    await nextTick()
  } finally {
    // Parent flips installedFontsLoaded when done; keep spinner brief
    setTimeout(() => { isLoadingLocal.value = false }, 1200)
  }
}

// --- Lazy specimen loading ---
// Each row's font stylesheet is requested only when the row scrolls into view,
// so opening the panel doesn't download the whole Fontshare catalog at once.
// The observer is created lazily because :ref callbacks fire before onMounted.
let observer: IntersectionObserver | null = null
const requested = new Set<string>()

function ensureObserver(): IntersectionObserver | null {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const fontName = (entry.target as HTMLElement).dataset.font
        if (fontName && !requested.has(fontName)) {
          requested.add(fontName)
          emit('load-font', fontName)
        }
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '160px' }
  )
  return observer
}

function registerRow(el: Element | ComponentPublicInstance | null) {
  const obs = ensureObserver()
  if (el instanceof Element && obs) {
    obs.observe(el)
  }
}

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>
