<template>
  <div class="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-300">
    <!-- Header (Persistent) -->
    <!-- Header (Persistent) -->
    <AppHeader 
      :current-view="currentView"
      :matches-count="matches.length"
      @update:current-view="currentView = $event"
    />

    <!-- Main Content Area -->
    <SplitLayout 
      v-if="currentView === 'editor'"
      :is-menu-open="isMobileMenuOpen"
      @close-menu="isMobileMenuOpen = false"
    >
      <template #sidebar>
        <!-- Upload Logo -->
        <div class="space-y-3">
          <LogoUpload v-model="uploadedLogo" />
        </div>

        <!-- Preview Text -->
        <div class="space-y-3">
            <label for="preview-text" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Preview Text
            </label>
            <input
              id="preview-text"
              v-model="previewText"
              type="text"
              placeholder="Enter your text here..."
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:focus:ring-blue-900 dark:placeholder-slate-500"
            />
        </div>

          <!-- Font Selection -->
          <div class="space-y-3">
            <FontSelector 
              v-model="selectedFont" 
              :font-categories="filteredFontCategories"
              v-model:selected-categories="selectedCategories"
              :all-categories="Object.keys(fontCategories) as any"
              @update:model-value="loadFont"
            />
          </div>

          <!-- Typography Settings -->
          <div class="space-y-3 pb-6">
            <h3 class="text-sm font-semibold text-slate-700">Typography Settings</h3>
            <FontControls 
              v-model:font-size="fontSize" 
              v-model:font-weight="fontWeight"
              v-model:letter-spacing="letterSpacing"
              v-model:font-color="fontColor"
              v-model:preview-bg="previewBg"
            />
          </div>
      </template>

      <template #content>
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
          class="!p-16 !shadow-2xl relative" 
          @toggle-save="handleToggleSave"
        />
      </template>
    </SplitLayout>

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
import { ref, onMounted, computed, watch } from 'vue'
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
    // Small delay to allow component to mount before opening menu, 
    // though in Vue 3 reactivity usually handles this, a nextTick might be needed if strict.
    // simpler: just set it true.
    isMobileMenuOpen.value = true
  } else {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
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
