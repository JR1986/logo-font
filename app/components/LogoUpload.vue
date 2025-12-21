<template>
  <div>
    <label class="block text-sm font-semibold text-slate-700 mb-2">
      Upload Logo
    </label>
    <div 
      class="relative w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center"
      @click="triggerFileInput"
      @dragover.prevent="setDragging(true)"
      @dragleave="setDragging(false)"
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
      <div v-if="!modelValue" class="text-center">
        <svg class="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-sm text-slate-500">Click or drag to upload</p>
      </div>
      <img v-else :src="modelValue" alt="Uploaded logo" class="max-h-28 max-w-full object-contain" />
    </div>
    <button 
      v-if="modelValue" 
      @click="clearLogo"
      class="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors"
    >
      Remove logo
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string | null
}

interface Emits {
  (e: 'update:modelValue', value: string | null): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput(): void {
  fileInput.value?.click()
}

function handleFileSelect(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(event: DragEvent): void {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

function processFile(file: File): void {
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:modelValue', e.target?.result as string)
  }
  reader.readAsDataURL(file)
}

function clearLogo(): void {
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function setDragging(value: boolean): void {
  isDragging.value = value
}
</script>
