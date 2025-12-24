<template>
  <div class="h-screen flex flex-col bg-slate-50">
    <!-- Header (Persistent) -->
    <!-- Header (Persistent) -->
    <AppHeader 
      :current-view="currentView"
      :matches-count="matches.length"
      @update:current-view="currentView = $event"
    />

    <!-- Main Content Area -->
    <SplitLayout v-if="currentView === 'editor'">
      <template #sidebar>
        <!-- Upload Logo -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-slate-700">Upload Logo</h3>
          <LogoUpload v-model="uploadedLogo" />
        </div>

        <!-- Preview Text -->
        <div class="space-y-3">
            <label for="preview-text" class="block text-sm font-semibold text-slate-700">
              Preview Text
            </label>
            <input
              id="preview-text"
              v-model="previewText"
              type="text"
              placeholder="Enter your text here..."
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
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
              @save="handleSaveMatch"
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
          class="!p-16 !shadow-2xl"
        />
      </template>
    </SplitLayout>

    <!-- Saved Matches View (Full Screen Replacement for now) -->
    <div v-else class="flex-1 overflow-y-auto p-8">
      <div class="max-w-6xl mx-auto">
         <!-- Passed @back handler is handled by header button now, but keeping prop for compatibility if needed inside -->
        <SavedMatches @back="currentView = 'editor'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGoogleFonts } from '~/composables/useGoogleFonts'
import { useMatches } from '~/composables/useMatches'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'
// Components are auto-imported by Nuxt

// State
const previewText = ref('Company Name')
const uploadedLogo = ref<string | null>(null)
const currentView = ref<'editor' | 'matches'>('editor')

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
  selectRandomFont
} = useGoogleFonts()

const {
  matches,
  saveMatch
} = useMatches()

// Actions
function handleSaveMatch() {
  saveMatch({
    font: selectedFont.value,
    text: previewText.value,
    fontSize: fontSize.value,
    fontWeight: fontWeight.value,
    letterSpacing: letterSpacing.value,
    logo: uploadedLogo.value,
    fontColor: fontColor.value,
    fontCategory: selectedFontCategory.value
  })
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
