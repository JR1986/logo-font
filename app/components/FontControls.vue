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
  </div>
</template>

<script setup lang="ts">
interface Props {
  fontSize: number
  fontWeight: number
}

interface Emits {
  (e: 'update:fontSize', value: number): void
  (e: 'update:fontWeight', value: number): void
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
</script>
