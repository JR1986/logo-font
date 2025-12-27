<template>
  <div class="space-y-6">
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

    <!-- Letter Spacing Slider -->
    <div>
      <label for="letter-spacing" class="block text-sm font-semibold text-slate-700 mb-2">
        Letter Spacing: {{ letterSpacing }}px
      </label>
      <input
        id="letter-spacing"
        :value="letterSpacing"
        @input="handleSpacingChange"
        type="range"
        min="-5"
        max="20"
        step="1"
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


  </div>
</template>

<script setup lang="ts">
interface Props {
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
}

interface Emits {
  (e: 'update:fontSize', value: number): void
  (e: 'update:fontWeight', value: number): void
  (e: 'update:letterSpacing', value: number): void
  (e: 'update:fontColor', value: string): void
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

function handleSpacingChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:letterSpacing', Number(target.value))
}

function handleColorChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:fontColor', target.value)
}
</script>
