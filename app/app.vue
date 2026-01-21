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
      v-model:uploaded-logo="uploadedLogo"
      v-model:preview-text="previewText"
      v-model:selected-font="selectedFont"
      v-model:selected-categories="selectedCategories"
      v-model:font-size="fontSize"
      v-model:font-weight="fontWeight"
      v-model:letter-spacing="letterSpacing"
      v-model:font-color="fontColor"
      v-model:preview-bg="previewBg"
      :font-categories="filteredFontCategories"
      :all-categories="Object.keys(fontCategories) as any"
      @update:selected-font="loadFont"
      @randomize="selectRandomFont"
    />

    <!-- Main Content Area - Editor -->
    <main 
      v-if="currentView === 'editor'"
      class="flex-1 bg-slate-50 overflow-y-auto flex items-center justify-center p-4 md:p-12 pb-24 md:pb-12 dark:bg-slate-950"
    >
      <div class="w-full max-w-7xl">
        <PreviewArea
          :logo="uploadedLogo"
          :text="previewText"
          :font="selectedFont"
          :font-size="fontSize"
          :font-weight="fontWeight"
          :letter-spacing="letterSpacing"
          :font-color="fontColor"
          :font-category="selectedFontCategory"
          :is-saved="isCurrentSaved"
          :preview-bg="previewBg"
          class="!p-6 md:!p-16 !shadow-2xl relative" 
          @toggle-save="handleToggleSave"
        />
      </div>
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
// Components are auto-imported by Nuxt

// State
const previewText = ref('Company Name')
const uploadedLogo = ref<string | null>(null)
const previewBg = ref<'white' | 'black'>('white')
const currentView = ref<'editor' | 'matches'>('editor')
const isMobileMenuOpen = ref(false)
const toolbarRef = ref<{ openSettings: () => void } | null>(null)

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
  previewBg: previewBg.value
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
