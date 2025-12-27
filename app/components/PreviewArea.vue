<template>
  <div class="bg-white rounded-2xl shadow-xl p-12">
    <p class="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wide text-center">
      Live Preview
    </p>
    
    <!-- Save Toggle Button (Heart) -->
    <button 
      class="absolute top-6 right-6 p-2 rounded-full transition-all duration-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-pink-200 active:scale-95 group"
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

    <!-- Inline Logo Mark Preview -->
    <div class="flex items-center justify-center gap-4 p-8 bg-slate-50 rounded-xl min-h-48">
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
      >
        {{ text }}
      </div>
    </div>
    
    <p class="text-sm text-slate-400 mt-8 text-center">
      Font: <span class="font-semibold">{{ font }}</span> 
      <span class="text-slate-300">({{ fontCategory }})</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

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
}

const props = defineProps<Props>()
defineEmits<{
  (e: 'toggle-save'): void
}>()

const fontStyle = computed<CSSProperties>(() => ({
  fontFamily: props.font,
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  letterSpacing: `${props.letterSpacing}px`,
  color: props.fontColor
}))
</script>
