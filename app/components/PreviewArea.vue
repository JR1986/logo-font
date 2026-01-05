<template>
  <div 
    class="rounded-2xl shadow-xl p-12 transition-colors duration-300"
    :class="previewBg === 'white' ? 'bg-white' : 'bg-slate-900 border border-slate-800'"
  >
    <p class="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wide text-center">
      Live Preview
    </p>
    
    <!-- Action Buttons -->
    <div class="absolute top-6 right-6 flex items-center gap-2">
      <!-- Copy SVG Button -->
      <button 
        class="p-2 rounded-full transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 active:scale-95 group"
        :class="copySuccess ? 'text-green-500' : 'text-slate-300 hover:text-blue-400'"
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
          class="w-7 h-7 transition-transform group-hover:scale-110"
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
          class="w-7 h-7"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>

      <!-- Save Toggle Button (Heart) -->
      <button 
        class="p-2 rounded-full transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-200 active:scale-95 group"
        :class="isSaved ? 'text-pink-500' : 'text-slate-300 hover:text-pink-400'"
        @click="$emit('toggle-save')"
        title="Save match"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          :fill="isSaved ? 'currentColor' : 'none'" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          class="w-8 h-8 transition-transform group-hover:scale-110"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>

    <!-- Inline Logo Mark Preview -->
    <div 
      class="flex items-center justify-center gap-4 p-8 rounded-xl min-h-48 transition-colors duration-300"
      :class="previewBg === 'white' ? 'bg-slate-50' : 'bg-slate-800'"
    >
      <!-- Logo -->
      <img 
        v-if="logo" 
        :src="logo" 
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
        :style="fontStyle"
        class="transition-all duration-300"
        data-testid="preview-text"
      >
        {{ text }}
      </div>
    </div>
    
    <p class="text-sm mt-8 text-center transition-colors duration-300" :class="previewBg === 'white' ? 'text-slate-400' : 'text-slate-500'">
      Font: <span class="font-semibold" :class="previewBg === 'white' ? 'text-slate-500' : 'text-slate-400'">{{ font }}</span> 
      <span :class="previewBg === 'white' ? 'text-slate-300' : 'text-slate-600'">({{ fontCategory }})</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CSSProperties } from 'vue'
import { generateSvg } from '~/utils/svg'

interface Props {
  logo: string | null
  text: string
  font: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
  fontCategory: string | null
  isSaved?: boolean
  previewBg?: 'white' | 'black'
}

const props = withDefaults(defineProps<Props>(), {
  previewBg: 'white'
})

defineEmits<{
  (e: 'toggle-save'): void
}>()

const copySuccess = ref(false)

const fontStyle = computed<CSSProperties>(() => ({
  fontFamily: props.font,
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  letterSpacing: `${props.letterSpacing}px`,
  color: props.fontColor
}))

/**
 * Copies the generated SVG to clipboard
 */
async function copySvgToClipboard() {
  try {
    const svgString = generateSvg({
      logo: props.logo,
      text: props.text,
      font: props.font,
      fontSize: props.fontSize,
      fontWeight: props.fontWeight,
      letterSpacing: props.letterSpacing,
      fontColor: props.fontColor
    })
    await navigator.clipboard.writeText(svgString)
    
    // Show success feedback
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy SVG:', error)
  }
}
</script>
