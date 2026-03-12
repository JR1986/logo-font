<template>
  <header class="bg-white border-b-2 border-zinc-200 px-4 py-3 md:px-6 md:py-5 flex items-center justify-between shrink-0 z-10 dark:bg-black dark:border-zinc-800">
    <div class="flex items-center gap-3">
      <AppLogo class="h-8 md:h-10 w-auto transition-all" />
    </div>
    
    <div class="flex items-center gap-3">
      <button 
        @click="toggleColorMode"
        class="p-2.5 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
        :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :aria-pressed="colorMode.value === 'dark'"
        title="Toggle dark mode"
      >
        <svg v-if="colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
        </svg>
      </button>

      <button 
        v-if="currentView === 'editor'"
        @click="$emit('update:currentView', 'matches')"
        class="hidden md:flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-600 bg-white border-2 border-zinc-200 rounded-xl hover:border-zinc-300 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm dark:bg-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 active:scale-95 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform">
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3.25 7.875 3.25c2.106 0 3.875 1.042 4.946 2.56 1.07-1.518 2.84-2.56 4.946-2.56 3.161 0 5.625 2.072 5.625 5.001 0 3.925-2.438 7.111-4.735 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
        Saved Matches
        <span v-if="matchesCount > 0" class="ml-2 px-2 py-0.5 text-[10px] font-black bg-zinc-900 text-white rounded-full dark:bg-white dark:text-zinc-900">
          {{ matchesCount }}
        </span>
      </button>

      <button 
        v-else
        @click="$emit('update:currentView', 'editor')"
        class="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-600 bg-white border-2 border-zinc-200 rounded-xl hover:border-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 transition-all shadow-sm dark:bg-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-95"
      >
        ← Back to Editor
      </button>
    </div>
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

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
