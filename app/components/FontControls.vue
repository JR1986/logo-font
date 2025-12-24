<template>
  <div class="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
    <!-- Font Size Slider -->
    <div>
      <label for="font-size" class="block text-sm font-semibold text-slate-700 mb-2">
        Font Size: {{ fontSize }}px
      </label>
      <input
        id="font-size"
        :value="fontSize"
        @input="handleSizeChange"
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
        :value="fontWeight"
        @input="handleWeightChange"
        type="range"
        min="100"
        max="900"
        step="100"
        class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>

    <!-- Font Color Picker -->
    <div>
      <label for="font-color" class="block text-sm font-semibold text-slate-700 mb-2">
        Font Color
      </label>
      <div class="flex items-center gap-3">
        <input
          id="font-color"
          :value="fontColor"
          @input="handleColorChange"
          type="color"
          class="h-10 w-20 p-1 bg-white border border-slate-200 rounded cursor-pointer"
        />
        <span class="text-sm font-mono text-slate-500">{{ fontColor }}</span>
      </div>
    </div>

    <!-- Save Match Button -->
    <div class="flex items-end">
      <button 
        @click="$emit('save')"
        class="w-full h-10 flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow active:scale-95 duration-100"
        title="Save this match"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3.25 7.875 3.25c2.106 0 3.875 1.042 4.946 2.56 1.07-1.518 2.84-2.56 4.946-2.56 3.161 0 5.625 2.072 5.625 5.001 0 3.925-2.438 7.111-4.735 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
        Save Match
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fontSize: number
  fontWeight: number
  fontColor: string
}

interface Emits {
  (e: 'update:fontSize', value: number): void
  (e: 'update:fontWeight', value: number): void
  (e: 'update:fontColor', value: string): void
  (e: 'save'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleSizeChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:fontSize', Number(target.value))
}

function handleWeightChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:fontWeight', Number(target.value))
}

function handleColorChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:fontColor', target.value)
}
</script>
