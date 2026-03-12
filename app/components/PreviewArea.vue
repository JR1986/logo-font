<template>
  <div>
    <!-- Inline Logo Mark Preview -->
    <div class="flex items-center min-h-48" :class="direction === 'vertical' ? 'overflow-y-auto' : 'overflow-x-auto'">
      <!-- Inner container for centering -->
      <div 
        class="gap-4 mx-auto shrink-0"
        :class="direction === 'vertical' ? 'flex flex-col items-center' : 'flex items-center'">
        <!-- Logo Upload Area -->
        <div 
          class="shrink-0 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center overflow-hidden hover:scale-105 active:scale-95 shadow-sm group"
          :class="[
            logo 
              ? 'h-24 md:h-32 w-24 md:w-32 ring-offset-2 ring-offset-transparent outline-none ring-2 ring-transparent focus-within:ring-indigo-600' 
              : 'h-24 md:h-32 w-24 md:w-32 ' + (previewBg === 'white' ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-600 hover:text-zinc-300')
          ]"
          @click="triggerLogoUpload"
          @dragover.prevent="isDragging = true"
          @drop.prevent="handleLogoDrop"
          :title="logo ? 'Click to replace logo' : 'Upload a logo (click or drag)'"
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
              class="w-10 h-10 mb-2 transition-transform duration-300 group-hover:-translate-y-1"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-[10px] font-black uppercase tracking-widest">
              Add Logo
            </span>
          </template>
        </div>

        <!-- Font Text -->
        <div
          :style="fontStyle"
          class="transition-colors duration-300 whitespace-nowrap shrink-0"
          data-testid="preview-text"
        >
          {{ text }}
        </div>
      </div>
    </div>
    
    <div class="mt-12 md:mt-16 flex justify-center">
      <div 
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-300 shadow-sm border-2"
        :class="previewBg === 'white' ? 'bg-white border-zinc-200 text-zinc-500' : 'bg-black border-zinc-800 text-zinc-400'"
      >
        <span class="opacity-50">Font</span>
        <span :class="previewBg === 'white' ? 'text-zinc-900' : 'text-white'">{{ font }}</span>
        <span class="opacity-50 text-[9px] font-bold" v-if="fontCategory">({{ fontCategory }})</span>
      </div>
    </div>
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
  direction?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  previewBg: 'white',
  direction: 'horizontal'
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

