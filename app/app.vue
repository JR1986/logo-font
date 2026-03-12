<template>
  <div class="h-screen flex flex-col bg-zinc-50 dark:bg-black dark:text-zinc-200 transition-colors duration-300">
    <!-- Header (Persistent) -->
    <AppHeader 
      :current-view="currentView"
      :matches-count="matches.length"
      @update:current-view="currentView = $event"
    />

    <!-- Toolbar Controls (Only in editor view) -->
    <ToolbarControls
      v-if="currentView === 'editor'"
      ref="toolbarRef"
      v-model:preview-text="previewText"
      v-model:selected-font="selectedFont"
      v-model:selected-categories="selectedCategories"
      v-model:font-size="fontSize"
      v-model:font-weight="fontWeight"
      v-model:letter-spacing="letterSpacing"
      v-model:font-color="fontColor"
      v-model:preview-bg="previewBg"
      v-model:layout-direction="layoutDirection"
      :font-categories="filteredFontCategories"
      :all-categories="availableCategories"
      :installed-fonts-loaded="installedFonts.length > 0"
      @update:selected-font="loadFont"
      @randomize="selectRandomFont"
      @load-installed-fonts="loadInstalledFonts"
      @settings-toggle="handleSettingsToggle"
    />

    <!-- Main Content Area - Editor -->
    <main 
      v-if="currentView === 'editor'"
      class="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-12 pb-24 md:pb-12 transition-colors duration-300 relative"
      :class="previewBg === 'white' ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-rose-50/50 dark:from-indigo-950/20 dark:via-black dark:to-rose-950/20' : 'bg-zinc-950'"
    >
      <!-- Action Buttons - Pill containment -->
      <div class="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-1 md:gap-1.5 p-1 md:p-1.5 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl md:rounded-2xl shadow-sm z-10">
        <!-- Copy SVG Button -->
        <button 
          class="p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 active:scale-95 group"
          :class="copyError ? 'text-red-500' : copySuccess ? 'text-green-500' : 'text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400'"
          @click="copySvgToClipboard"
          :aria-label="copyError ? 'Copy failed' : copySuccess ? 'Copied!' : 'Copy as SVG'"
          :title="copyError ? 'Copy failed — clipboard access denied' : copySuccess ? 'Copied!' : 'Copy as SVG'"
        >
          <svg 
            v-if="copyError"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="w-6 h-6"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <svg 
            v-else-if="!copySuccess"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="w-6 h-6 transition-transform group-hover:scale-110"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg 
            v-else
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="w-6 h-6"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>

        <!-- Save Toggle Button (Heart) -->
        <button 
          class="p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1 active:scale-95 group"
          :class="isCurrentSaved ? 'text-rose-500' : 'text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400'"
          @click="handleToggleSave"
          :aria-label="isCurrentSaved ? 'Remove saved match' : 'Save match'"
          :title="isCurrentSaved ? 'Remove saved match' : 'Save match'"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            :fill="isCurrentSaved ? 'currentColor' : 'none'" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            class="w-6 h-6 transition-transform group-hover:scale-110"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <PreviewArea
        :logo="uploadedLogo"
        :text="previewText"
        :font="selectedFont"
        :font-size="fontSize"
        :font-weight="fontWeight"
        :letter-spacing="letterSpacing"
        :font-color="fontColor"
        :font-category="selectedFontCategory"
        :preview-bg="previewBg"
        :direction="layoutDirection"
        @update:logo="uploadedLogo = $event"
      />
    </main>

    <!-- Saved Matches View (Full Screen Replacement for now) -->
    <div v-else class="flex-1 overflow-y-auto p-8 pb-24 md:pb-8">
      <div class="max-w-6xl mx-auto">
         <!-- Passed @back handler is handled by header button now, but keeping prop for compatibility if needed inside -->
        <SavedMatches @back="currentView = 'editor'" />
      </div>
    </div>

    <!-- Mobile Bottom Navigation -->
    <BottomNav 
      :current-view="currentView"
      :is-settings-open="isSettingsOpen"
      :matches-count="matches.length"
      @nav="handleNav"
      @toggle-menu="handleToggleMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useGoogleFonts } from '~/composables/useGoogleFonts'
import { useMatches } from '~/composables/useMatches'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
import { generateSvg } from '~/utils/svg'
// Components are auto-imported by Nuxt

// State
const previewText = ref('Company Name')
const uploadedLogo = ref<string | null>(null)
const previewBg = ref<'white' | 'black'>('white')
const layoutDirection = ref<'horizontal' | 'vertical'>('horizontal')
const currentView = ref<'editor' | 'matches'>('editor')
const isSettingsOpen = ref(false)
const toolbarRef = ref<{ openSettings: () => void } | null>(null)
const copySuccess = ref(false)
const copyError = ref(false)

// Composables
const {
  selectedFont,
  fontSize,
  fontWeight,
  letterSpacing,
  fontColor,
  fontCategories,
  filteredFontCategories,
  availableCategories,
  selectedCategories,
  selectedFontCategory,
  loadFont,
  selectRandomFont,
  loadInstalledFonts,
  installedFonts
} = useGoogleFonts()

const {
  matches,
  saveMatch,
  removeMatch,
  findMatchId,
  isMatchSaved
} = useMatches()

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

// Watchers
const colorMode = useColorMode()

watch(() => colorMode.value, (newMode) => {
  if (newMode === 'dark') {
    previewBg.value = 'black'
  } else {
    previewBg.value = 'white'
  }
})

watch(previewBg, (newBg) => {
  if (newBg === 'black') {
    fontColor.value = '#ffffff'
  } else {
    fontColor.value = '#000000'
  }
})

// Actions
function handleToggleSave() {
  if (isCurrentSaved.value) {
    const id = findMatchId(currentMatchConfig.value)
    if (id) removeMatch(id)
  } else {
    saveMatch(currentMatchConfig.value)
  }
}

function handleNav(view: 'editor' | 'matches') {
  currentView.value = view
  if (view === 'matches') {
    isSettingsOpen.value = false
  }
}

async function copySvgToClipboard() {
  try {
    const svgString = generateSvg({
      logo: uploadedLogo.value,
      text: previewText.value,
      font: selectedFont.value,
      fontSize: fontSize.value,
      fontWeight: fontWeight.value,
      letterSpacing: letterSpacing.value,
      fontColor: fontColor.value
    })
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not available')
    }
    await navigator.clipboard.writeText(svgString)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy SVG:', error)
    copyError.value = true
    setTimeout(() => {
      copyError.value = false
    }, 2500)
  }
}

function handleSettingsToggle(open: boolean) {
  isSettingsOpen.value = open
}

function handleToggleMenu() {
  if (currentView.value === 'matches') {
    currentView.value = 'editor'
    // Wait for toolbar to mount then open settings
    nextTick(() => {
      toolbarRef.value?.openSettings()
    })
  } else {
    // Open settings popover
    toolbarRef.value?.openSettings()
  }
}

// Keyboard shortcuts
useKeyboardShortcuts([
  {
    code: 'Space',
    handler: selectRandomFont,
    preventDefault: true
  }
])

// Load initial font
onMounted(() => {
  loadFont()
})
</script>
