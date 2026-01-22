<template>
  <div class="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-300">
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
      :all-categories="Object.keys(fontCategories) as any"
      @update:selected-font="loadFont"
      @randomize="selectRandomFont"
    />

    <!-- Main Content Area - Editor -->
    <main 
      v-if="currentView === 'editor'"
      class="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 md:p-12 pb-24 md:pb-12 transition-colors duration-300 relative"
      :class="previewBg === 'white' ? 'bg-slate-50 dark:bg-slate-950' : 'bg-slate-900'"
    >
      <!-- Action Buttons - Fixed position -->
      <div class="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
        <!-- Copy SVG Button -->
        <button 
          class="p-2 rounded-full transition-all duration-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-200 active:scale-95 group"
          :class="copySuccess ? 'text-green-500' : 'text-slate-400 hover:text-blue-500'"
          @click="copySvgToClipboard"
          :title="copySuccess ? 'Copied!' : 'Copy as SVG'"
        >
          <svg 
            v-if="!copySuccess"
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
          class="p-2 rounded-full transition-all duration-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-pink-200 active:scale-95 group"
          :class="isCurrentSaved ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'"
          @click="handleToggleSave"
          title="Save match"
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
      :is-menu-open="isMobileMenuOpen"
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
const isMobileMenuOpen = ref(false)
const toolbarRef = ref<{ openSettings: () => void } | null>(null)
const copySuccess = ref(false)

// Composables
const {
  selectedFont,
  fontSize,
  fontWeight,
  letterSpacing,
  fontColor,
  fontCategories,
  filteredFontCategories,
  selectedCategories,
  selectedFontCategory,
  loadFont,
  selectRandomFont,
  loadInstalledFonts
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
    isMobileMenuOpen.value = false
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
    await navigator.clipboard.writeText(svgString)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy SVG:', error)
  }
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
