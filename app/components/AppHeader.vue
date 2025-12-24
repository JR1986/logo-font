<template>
  <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
    <div class="flex items-center gap-3">
      <img src="/logofont.svg" alt="Logo Font" width="32" class="h-8 w-auto" />
    </div>
    
    <button 
      v-if="currentView === 'editor'"
      @click="$emit('update:currentView', 'matches')"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-pink-600 transition-colors shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-pink-500">
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3.25 7.875 3.25c2.106 0 3.875 1.042 4.946 2.56 1.07-1.518 2.84-2.56 4.946-2.56 3.161 0 5.625 2.072 5.625 5.001 0 3.925-2.438 7.111-4.735 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
      </svg>
      Saved Matches
      <span v-if="matchesCount > 0" class="ml-1 px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded-full">
        {{ matchesCount }}
      </span>
    </button>

    <button 
      v-else
      @click="$emit('update:currentView', 'editor')"
      class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
    >
      ← Back to Editor
    </button>
  </header>
</template>

<script setup lang="ts">
interface Props {
  currentView: 'editor' | 'matches'
  matchesCount: number
}

interface Emits {
  (e: 'update:currentView', value: 'editor' | 'matches'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
