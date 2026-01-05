<template>
  <div class="space-y-4">
    <!-- Category Filter -->
    <div>
      <label class="block text-sm font-semibold text-slate-700 mb-2 dark:text-slate-300">
        Font Categories
      </label>
      <div class="flex flex-wrap gap-3">
        <label 
          v-for="category in allCategories" 
          :key="category"
          class="flex items-center space-x-2 cursor-pointer group"
        >
          <div class="relative flex items-center">
            <input 
              type="checkbox"
              :value="category"
              :checked="selectedCategories.includes(category)"
              @change="toggleCategory(category)"
              class="w-4 h-4 border-2 border-slate-300 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer dark:border-slate-600 dark:bg-slate-800"
            >
          </div>
          <span class="text-sm text-slate-600 group-hover:text-slate-900 transition-colors dark:text-slate-400 dark:group-hover:text-slate-300">
            {{ category }}
          </span>
        </label>
      </div>
    </div>

    <!-- Font Select -->
    <div>
      <label for="font-select" class="block text-sm font-semibold text-slate-700 mb-2 dark:text-slate-300">
        Select Font
      </label>
      <select
        id="font-select"
        :value="modelValue"
        @change="handleChange"
        class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:focus:ring-blue-900"
      >
        <optgroup v-for="(fontList, category) in fontCategories" :key="category" :label="category">
          <option v-for="font in fontList" :key="font" :value="font">
            {{ font }}
          </option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FontCategories, FontCategory } from '~/types'

interface Props {
  modelValue: string
  fontCategories: Partial<FontCategories>
  selectedCategories: FontCategory[]
  allCategories: FontCategory[]
  loadInstalled: (() => Promise<boolean>) | undefined
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:selectedCategories', value: FontCategory[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

function toggleCategory(category: FontCategory): void {
  const newCategories = [...props.selectedCategories]
  const index = newCategories.indexOf(category)
  
  if (index === -1) {
    newCategories.push(category)
  } else {
    newCategories.splice(index, 1)
  }
  
  emit('update:selectedCategories', newCategories)
}

const supportsLocalFonts = ref(false)

onMounted(() => {
  supportsLocalFonts.value = 'queryLocalFonts' in window
})

async function handleLoadLocalFonts() {
  if (props.loadInstalled) {
    const success = await props.loadInstalled()
    if (success) {
      // Ensure 'Installed' is selected so the user sees the new fonts immediately
      if (!props.selectedCategories.includes('Installed')) {
        toggleCategory('Installed')
      }
    }
  }
}
</script>
