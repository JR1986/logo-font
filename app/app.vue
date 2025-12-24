<template>
  <div class="min-h-screen from-slate-50 to-slate-100 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 relative">
        <div class="absolute right-0 top-0 hidden md:block">
           <button 
            v-if="currentView === 'editor'"
            @click="currentView = 'matches'"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-pink-600 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-pink-500">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3.25 7.875 3.25c2.106 0 3.875 1.042 4.946 2.56 1.07-1.518 2.84-2.56 4.946-2.56 3.161 0 5.625 2.072 5.625 5.001 0 3.925-2.438 7.111-4.735 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
            Saved Matches
            <span v-if="matches.length > 0" class="ml-1 px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded-full">
              {{ matches.length }}
            </span>
          </button>
        </div>
        <img src="/logofont.svg" alt="Logo Font" width="200" class="mx-auto mb-6" />
        <h1 class="text-4xl font-bold text-slate-800 mb-2">Logo & Font Matcher</h1>
        <p class="text-slate-600">Upload your logo and find the perfect font pairing</p>
        
        <!-- Mobile View Matches Button -->
        <div class="md:hidden mt-4">
           <button 
            v-if="currentView === 'editor'"
            @click="currentView = 'matches'"
            class="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-pink-600 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-pink-500">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3.25 7.875 3.25c2.106 0 3.875 1.042 4.946 2.56 1.07-1.518 2.84-2.56 4.946-2.56 3.161 0 5.625 2.072 5.625 5.001 0 3.925-2.438 7.111-4.735 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
            Saved Matches ({{ matches.length }})
          </button>
        </div>
      </div>

      <!-- Editor View -->
      <div v-if="currentView === 'editor'">
        <!-- Controls Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Logo Upload -->
            <LogoUpload v-model="uploadedLogo" />

            <!-- Text Input -->
            <div>
              <label for="preview-text" class="block text-sm font-semibold text-slate-700 mb-2">
                Preview Text
              </label>
              <input
                id="preview-text"
                v-model="previewText"
                type="text"
                placeholder="Enter your text here..."
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            <!-- Font Selector -->
            <FontSelector 
              v-model="selectedFont" 
              :font-categories="filteredFontCategories"
              v-model:selected-categories="selectedCategories"
              :all-categories="Object.keys(fontCategories) as any"
              @update:model-value="loadFont"
            />
          </div>

          <!-- Font Controls -->
          <FontControls 
            v-model:font-size="fontSize" 
            v-model:font-weight="fontWeight"
            v-model:font-color="fontColor"
            @save="handleSaveMatch"
          />
        </div>

        <!-- Preview Area -->
        <PreviewArea
          :logo="uploadedLogo"
          :text="previewText"
          :font="selectedFont"
          :font-size="fontSize"
          :font-weight="fontWeight"
          :font-color="fontColor"
          :font-category="selectedFontCategory"
        />
      </div>

      <!-- Saved Matches View -->
      <div v-else class="max-w-6xl mx-auto">
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
    logo: uploadedLogo.value,
    fontColor: fontColor.value,
    fontCategory: selectedFontCategory.value
  })
  
  // Optional: Show feedback or switch view?
  // For now let's just stay in editor but maybe show a badge count update
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
