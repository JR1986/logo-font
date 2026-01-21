<template>
  <div>
    <!-- Inline Logo Mark Preview -->
    <div class="flex items-center min-h-48 overflow-x-auto">
      <!-- Inner container for centering -->
      <div class="flex items-center gap-4 mx-auto shrink-0">
        <!-- Logo Upload Area -->
        <div 
          class="shrink-0 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center overflow-hidden"
          :class="[
            logo 
              ? 'h-20 md:h-24 w-20 md:w-24 hover:ring-2 hover:ring-blue-400 hover:ring-offset-2' 
              : 'h-28 md:h-32 w-28 md:w-32 border-2 border-dashed hover:border-blue-400 ' + (previewBg === 'white' ? 'border-slate-300 hover:bg-slate-100' : 'border-slate-600 hover:bg-slate-700')
          ]"
          @click="triggerLogoUpload"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleLogoDrop"
          :title="logo ? 'Click to change logo' : 'Click or drag to upload logo'"
        >
          <input
            ref="logoInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleLogoSelect"
          />
          <img 
            v-if="logo" 
            :src="logo" 
            alt="Logo preview" 
            class="h-full w-full object-contain"
          />
          <template v-else>
            <svg 
              class="w-8 h-8 mb-2"
              :class="previewBg === 'white' ? 'text-slate-400' : 'text-slate-500'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span 
              class="text-sm font-medium"
              :class="previewBg === 'white' ? 'text-slate-400' : 'text-slate-500'"
            >
              Add Logo
            </span>
          </template>
        </div>

        <!-- Font Text -->
        <div
          :style="fontStyle"
          class="transition-all duration-300 whitespace-nowrap shrink-0"
          data-testid="preview-text"
        >
          {{ text }}
        </div>
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

interface Props {
  logo: string | null
  text: string
  font: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
  fontCategory: string | null
  previewBg?: 'white' | 'black'
}

const props = withDefaults(defineProps<Props>(), {
  previewBg: 'white'
})

const emit = defineEmits<{
  (e: 'update:logo', value: string | null): void
}>()

const isDragging = ref(false)
const logoInputRef = ref<HTMLInputElement | null>(null)

function triggerLogoUpload() {
  logoInputRef.value?.click()
}

function handleLogoSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processLogoFile(file)
  }
}

function handleLogoDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processLogoFile(file)
  }
}

function processLogoFile(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:logo', e.target?.result as string)
  }
  reader.readAsDataURL(file)
}

const fontStyle = computed<CSSProperties>(() => ({
  fontFamily: props.font,
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  letterSpacing: `${props.letterSpacing}px`,
  color: props.fontColor
}))
</script>

