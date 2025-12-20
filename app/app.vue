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
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">
              Upload Logo
            </label>
            <div 
              class="relative w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center"
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleDrop"
              :class="{ 'border-blue-500 bg-blue-50': isDragging }"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
              <div v-if="!uploadedLogo" class="text-center">
                <svg class="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-slate-500">Click or drag to upload</p>
              </div>
              <img v-else :src="uploadedLogo" alt="Uploaded logo" class="max-h-28 max-w-full object-contain" />
            </div>
            <button 
              v-if="uploadedLogo" 
              @click="clearLogo"
              class="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Remove logo
            </button>
          </div>

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
          <div>
            <label for="font-select" class="block text-sm font-semibold text-slate-700 mb-2">
              Select Font
            </label>
            <select
              id="font-select"
              v-model="selectedFont"
              @change="loadFont"
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white cursor-pointer"
            >
              <option v-for="font in fonts" :key="font" :value="font">
                {{ font }}
              </option>
            </select>
          </div>
        </div>

        <!-- Font Size & Weight Sliders -->
        <div class="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
          <!-- Font Size Slider -->
          <div>
            <label for="font-size" class="block text-sm font-semibold text-slate-700 mb-2">
              Font Size: {{ fontSize }}px
            </label>
            <input
              id="font-size"
              v-model="fontSize"
              type="range"
              min="16"
              max="120"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <!-- Font Weight Slider -->
          <div>
            <label for="font-weight" class="block text-sm font-semibold text-slate-700 mb-2">
              Font Weight: {{ fontWeight }}
            </label>
            <input
              id="font-weight"
              v-model="fontWeight"
              type="range"
              min="100"
              max="900"
              step="100"
              class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Logo + Font Preview Card -->
      <div class="bg-white rounded-2xl shadow-xl p-12">
        <p class="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wide text-center">
          Live Preview
        </p>
        
        <!-- Inline Logo Mark Preview -->
        <div class="flex items-center justify-center gap-4 p-8 bg-slate-50 rounded-xl min-h-48">
          <!-- Logo -->
          <img 
            v-if="uploadedLogo" 
            :src="uploadedLogo" 
            alt="Logo preview" 
            class="h-16 md:h-20 w-auto object-contain"
          />
          <img 
            v-else 
            src="https://placehold.co/80x80/e2e8f0/94a3b8?text=Logo" 
            alt="Placeholder logo" 
            class="h-16 md:h-20 w-auto object-contain rounded-lg"
          />

          <!-- Font Text -->
          <div
            :style="{ fontFamily: selectedFont, fontSize: fontSize + 'px', fontWeight: fontWeight }"
            class="text-slate-800 transition-all duration-300"
          >
            {{ previewText }}
          </div>
        </div>
        
        <p class="text-sm text-slate-400 mt-8 text-center">
          Font: <span class="font-semibold">{{ selectedFont }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// State
const previewText = ref('Company Name')
const selectedFont = ref('Roboto')
const uploadedLogo = ref<string | null>(null)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const fontSize = ref(48)
const fontWeight = ref(400)

// Popular Google Fonts
const fonts = ref([
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Inter',
  'Playfair Display',
  'Merriweather',
  'Oswald',
  'Source Sans Pro',
  'Nunito',
  'Ubuntu',
  'PT Sans',
  'Mukta',
  'Rubik',
  'Work Sans',
  'Crimson Text',
  'Bebas Neue',
  'Dancing Script'
])

// Load Google Font dynamically
const loadFont = () => {
  const fontName = selectedFont.value.replace(/ /g, '+')
  const linkId = 'google-font-link'
  
  // Remove existing font link if present
  const existingLink = document.getElementById(linkId)
  if (existingLink) {
    existingLink.remove()
  }
  
  // Create new font link
  const link = document.createElement('link')
  link.id = linkId
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@100;200;300;400;500;600;700;800;900&display=swap`
  document.head.appendChild(link)
}

// File upload handlers
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedLogo.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const clearLogo = () => {
  uploadedLogo.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Random font selection with spacebar
const selectRandomFont = () => {
  const currentIndex = fonts.value.indexOf(selectedFont.value)
  let randomIndex = currentIndex
  // Ensure we get a different font
  while (randomIndex === currentIndex) {
    randomIndex = Math.floor(Math.random() * fonts.value.length)
  }
  selectedFont.value = fonts.value[randomIndex] as string
  loadFont()
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Only trigger if not typing in an input field
  if (event.code === 'Space' && event.target === document.body) {
    event.preventDefault()
    selectRandomFont()
  }
}

// Load initial font on mount and add keyboard listener
onMounted(() => {
  loadFont()
  window.addEventListener('keydown', handleKeyDown)
})

// Cleanup keyboard listener
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
