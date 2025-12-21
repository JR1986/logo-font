<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <img src="/logofont.svg" alt="Logo Font" width="200" class="mx-auto mb-6" />
        <h1 class="text-4xl font-bold text-slate-800 mb-2">Logo & Font Matcher</h1>
        <p class="text-slate-600">Upload your logo and find the perfect font pairing</p>
      </div>

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
            :font-categories="fontCategories"
            @update:model-value="loadFont"
          />
        </div>

        <!-- Font Controls -->
        <FontControls 
          v-model:font-size="fontSize" 
          v-model:font-weight="fontWeight"
          v-model:font-color="fontColor"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGoogleFonts } from '~/composables/useGoogleFonts'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'

// Components are auto-imported by Nuxt

// State
const previewText = ref('Company Name')
const uploadedLogo = ref<string | null>(null)

// Google Fonts
const {
  selectedFont,
  fontSize,
  fontWeight,
  fontColor,
  fontCategories,
  selectedFontCategory,
  loadFont,
  selectRandomFont
} = useGoogleFonts()

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
