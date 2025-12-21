<template>
  <div>
    <label for="font-select" class="block text-sm font-semibold text-slate-700 mb-2">
      Select Font
    </label>
    <select
      id="font-select"
      :value="modelValue"
      @change="handleChange"
      class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white cursor-pointer"
    >
      <optgroup v-for="(fontList, category) in fontCategories" :key="category" :label="category">
        <option v-for="font in fontList" :key="font" :value="font">
          {{ font }}
        </option>
      </optgroup>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { FontCategories } from '~/types'

interface Props {
  modelValue: string
  fontCategories: FontCategories
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
