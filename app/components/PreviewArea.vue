<template>
  <div class="bg-white rounded-2xl shadow-xl p-12">
    <p class="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wide text-center">
      Live Preview
    </p>
    
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
  fontColor: string
  fontCategory: string | null
}

const props = defineProps<Props>()

const fontStyle = computed<CSSProperties>(() => ({
  fontFamily: props.font,
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  color: props.fontColor
}))
</script>
