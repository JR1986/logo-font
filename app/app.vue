<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-paper font-sans text-ink antialiased transition-colors duration-300 dark:bg-stone-950 dark:text-stone-100">
    <AppHeader
      :matches-count="matches.length"
      @open-saved="savedOpen = true"
      @export="handleExport"
    />

    <!-- Canvas -->
    <main
      class="relative flex-1 overflow-hidden transition-colors duration-300"
      :style="canvasStyle"
      @dragover.prevent="isDraggingFile = true"
      @dragleave.self="isDraggingFile = false"
      @drop.prevent="handleCanvasDrop"
    >
      <!-- Centered preview (scrolls if wordmark outgrows the viewport) -->
      <div class="absolute inset-0 overflow-auto">
        <div class="flex min-h-full w-full items-center justify-center px-4 pb-48 pt-8 md:pb-44">
          <PreviewArea
            :logo="uploadedLogo"
            :text="previewText"
            :font="selectedFont"
            :font-size="fontSize"
            :font-weight="fontWeight"
            :letter-spacing="letterSpacing"
            :font-color="fontColor"
            :font-category="selectedFontCategory"
            :font-slug="selectedFontSlug"
            :preview-bg="previewBg"
            :direction="layoutDirection"
            editable
            @update:logo="uploadedLogo = $event"
            @update:text="previewText = $event"
          />
        </div>
      </div>

      <!-- Full-canvas drop overlay -->
      <div
        v-if="isDraggingFile"
        class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center border-4 border-dashed border-sun bg-sun/10 backdrop-blur-[1px]"
      >
        <div class="rounded-2xl bg-ink px-6 py-3 text-sm font-black uppercase tracking-widest text-sun shadow-pop">
          Drop your logo anywhere
        </div>
      </div>

      <!-- First-visit hint -->
      <Transition
        leave-active-class="transition duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="showHint" class="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center px-4 md:bottom-28">
          <div class="animate-fade-up rounded-full border border-ink/10 bg-white/90 px-5 py-2.5 text-xs font-bold text-ink/70 shadow-card backdrop-blur dark:border-white/10 dark:bg-stone-900/90 dark:text-stone-300">
            Press <kbd class="mx-0.5 rounded-md bg-sun px-2 py-0.5 font-sans text-[10px] font-black text-ink">space</kbd> to shuffle fonts
            <span class="mx-1.5 opacity-40">·</span>
            <kbd class="rounded-md bg-ink/10 px-1.5 py-0.5 font-sans text-[10px] font-black dark:bg-white/15">←</kbd>
            <kbd class="ml-1 rounded-md bg-ink/10 px-1.5 py-0.5 font-sans text-[10px] font-black dark:bg-white/15">→</kbd>
            <span class="ml-1.5">to revisit</span>
          </div>
        </div>
      </Transition>

      <!-- Floating dock -->
      <BottomDock
        v-model:selected-font="dockSelectedFont"
        v-model:font-size="fontSize"
        v-model:font-weight="fontWeight"
        v-model:letter-spacing="letterSpacing"
        v-model:font-color="fontColor"
        v-model:preview-bg="previewBg"
        v-model:layout-direction="layoutDirection"
        v-model:selected-categories="selectedCategories"
        :is-saved="isCurrentSaved"
        :can-back="canBack"
        :can-forward="canForward"
        :specimen-text="previewText"
        :font-categories="filteredFontCategories"
        :all-categories="availableCategories"
        :installed-fonts-loaded="installedFonts.length > 0"
        @randomize="shuffle"
        @back="goBack"
        @forward="goForward"
        @toggle-save="handleToggleSave"
        @load-font="loadFont"
        @load-installed-fonts="loadInstalledFonts"
      />
    </main>

    <!-- Saved matches drawer -->
    <SavedDrawer :open="savedOpen" @close="savedOpen = false" @apply="applyMatch" />

    <!-- Toast -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="toast" class="pointer-events-none fixed left-1/2 top-20 z-[60] -translate-x-1/2">
        <div class="rounded-full bg-ink px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-pop dark:bg-white dark:text-ink">
          {{ toast }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useGoogleFonts } from '~/composables/useGoogleFonts'
import { useMatches, type SavedMatch } from '~/composables/useMatches'
import { useLogoUpload } from '~/composables/useLogoUpload'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import { generateSvg } from '~/utils/svg'
import {
  generateDesignMd,
  exportPng,
  downloadFile,
  slugifyFilename
} from '~/utils/exporters'
import type { ExportKind } from '~/components/ExportMenu.vue'
// Components are auto-imported by Nuxt

const HINT_KEY = 'logofont:hint-dismissed'

// State
const previewText = ref('Your brand')
const previewBg = ref<'white' | 'black'>('white')
const layoutDirection = ref<'horizontal' | 'vertical'>('horizontal')
const savedOpen = ref(false)
const toast = ref<string | null>(null)
const showHint = ref(false)
const isDraggingFile = ref(false)

// Composables
const {
  selectedFont,
  fontSize,
  fontWeight,
  letterSpacing,
  fontColor,
  filteredFontCategories,
  availableCategories,
  selectedCategories,
  selectedFontCategory,
  selectedFontSlug,
  loadFont,
  selectRandomFont,
  loadInstalledFonts,
  installedFonts,
  fetchFonts
} = useGoogleFonts()

const { uploadedLogo, handleDrop } = useLogoUpload()

const {
  matches,
  saveMatch,
  removeMatch,
  findMatchId,
  isMatchSaved
} = useMatches()

// --- Font history (coolors-style ← / → travel) ---
const fontHistory = ref<string[]>([])
const historyIndex = ref(-1)
let isNavigatingHistory = false

const canBack = computed(() => historyIndex.value > 0)
const canForward = computed(() => historyIndex.value < fontHistory.value.length - 1)

watch(selectedFont, (font) => {
  if (isNavigatingHistory) return
  // A new pick truncates any "forward" entries, like browser history
  fontHistory.value = fontHistory.value.slice(0, historyIndex.value + 1)
  fontHistory.value.push(font)
  historyIndex.value = fontHistory.value.length - 1
}, { immediate: true })

function jumpToHistory(index: number) {
  const font = fontHistory.value[index]
  if (!font) return
  isNavigatingHistory = true
  historyIndex.value = index
  selectedFont.value = font
  loadFont(font)
  isNavigatingHistory = false
}

function goBack() {
  if (canBack.value) jumpToHistory(historyIndex.value - 1)
}

function goForward() {
  if (canForward.value) jumpToHistory(historyIndex.value + 1)
}

// Dock writes the font through this proxy so a manual pick also loads the font
const dockSelectedFont = computed({
  get: () => selectedFont.value,
  set: (font: string) => {
    selectedFont.value = font
    loadFont(font)
  }
})

// --- Current match ---
const currentMatchConfig = computed(() => ({
  font: selectedFont.value,
  text: previewText.value,
  fontSize: fontSize.value,
  fontWeight: fontWeight.value,
  letterSpacing: letterSpacing.value,
  logo: uploadedLogo.value,
  fontColor: fontColor.value,
  fontCategory: selectedFontCategory.value,
  previewBg: previewBg.value,
  direction: layoutDirection.value
}))

const isCurrentSaved = computed(() => isMatchSaved(currentMatchConfig.value))

const exportConfig = computed(() => ({
  ...currentMatchConfig.value,
  fontSlug: selectedFontSlug.value
}))

// --- Canvas ---
const canvasStyle = computed(() => {
  const light = previewBg.value === 'white'
  return {
    backgroundColor: light ? '#FFFFFF' : '#141413',
    backgroundImage: light
      ? 'radial-gradient(circle, rgba(20, 20, 19, 0.09) 1px, transparent 1px)'
      : 'radial-gradient(circle, rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
    backgroundSize: '22px 22px'
  }
})

// Keep canvas + wordmark color in sync with the chosen theme
const colorMode = useColorMode()

watch(() => colorMode.value, (newMode) => {
  previewBg.value = newMode === 'dark' ? 'black' : 'white'
})

watch(previewBg, (newBg) => {
  fontColor.value = newBg === 'black' ? '#FFFFFF' : '#141413'
})

// --- Actions ---
let toastTimer: ReturnType<typeof setTimeout> | undefined

function notify(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = null
  }, 1800)
}

function shuffle() {
  selectRandomFont()
  dismissHint()
}

function dismissHint() {
  if (!showHint.value) return
  showHint.value = false
  try {
    localStorage.setItem(HINT_KEY, '1')
  } catch { /* private mode — hint just shows again next time */ }
}

function handleToggleSave() {
  if (isCurrentSaved.value) {
    const id = findMatchId(currentMatchConfig.value)
    if (id) removeMatch(id)
    notify('Removed from saved')
  } else {
    saveMatch(currentMatchConfig.value)
    notify('Match saved ♥')
  }
}

function applyMatch(match: SavedMatch) {
  previewText.value = match.text
  fontSize.value = match.fontSize
  fontWeight.value = match.fontWeight
  letterSpacing.value = match.letterSpacing || 0
  uploadedLogo.value = match.logo
  previewBg.value = match.previewBg
  layoutDirection.value = match.direction || 'horizontal'
  selectedFont.value = match.font
  loadFont(match.font)
  // fontColor last: the previewBg watcher above resets it
  nextTick(() => {
    fontColor.value = match.fontColor
  })
  savedOpen.value = false
  notify(`Loaded ${match.font}`)
}

function handleCanvasDrop(event: DragEvent) {
  isDraggingFile.value = false
  handleDrop(event)
}

// --- Export ---
async function copySvgToClipboard() {
  try {
    const svgString = generateSvg(exportConfig.value)
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not available')
    }
    await navigator.clipboard.writeText(svgString)
    notify('SVG copied to clipboard')
  } catch (error) {
    console.error('Failed to copy SVG:', error)
    notify('Copy failed — check permissions')
  }
}

async function handleExport(kind: ExportKind) {
  const base = slugifyFilename(previewText.value)
  try {
    switch (kind) {
      case 'copy-svg':
        await copySvgToClipboard()
        break
      case 'svg':
        downloadFile(`${base}-wordmark.svg`, generateSvg(exportConfig.value), 'image/svg+xml')
        notify('SVG downloaded')
        break
      case 'png': {
        const blob = await exportPng(exportConfig.value)
        downloadFile(`${base}-wordmark@2x.png`, blob)
        notify('PNG downloaded')
        break
      }
      case 'md':
        downloadFile('DESIGN.md', generateDesignMd(exportConfig.value), 'text/markdown')
        notify('Design sheet downloaded')
        break
    }
  } catch (error) {
    console.error('Export failed:', error)
    notify('Export failed')
  }
}

// --- Keyboard shortcuts ---
useKeyboardShortcuts([
  { code: 'Space', handler: shuffle, preventDefault: true },
  { code: 'ArrowLeft', handler: goBack },
  { code: 'ArrowRight', handler: goForward },
  { code: 'KeyS', handler: handleToggleSave },
  { code: 'KeyC', handler: copySvgToClipboard },
  { code: 'Escape', handler: () => { savedOpen.value = false } }
])

// Fetch Fontshare catalog and load initial font
onMounted(async () => {
  try {
    showHint.value = !localStorage.getItem(HINT_KEY)
  } catch {
    showHint.value = true
  }
  await fetchFonts()
  loadFont()
})
</script>
