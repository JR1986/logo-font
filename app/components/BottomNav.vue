<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t-2 border-zinc-200 dark:border-zinc-800 px-6 py-3 z-50 flex justify-around items-center pb-safe">

    <!-- Tools / Menu Toggle -->
    <button 
      class="flex flex-col items-center gap-1.5 p-2 text-[10px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-xl"
      :class="isSettingsOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white'"
      :aria-pressed="isSettingsOpen"
      aria-label="Open settings"
      @click="$emit('toggle-menu')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
      </svg>
      Tools
    </button>

    <!-- Saved Matches Tab -->
    <button 
      class="flex flex-col items-center gap-1.5 p-2 text-[10px] font-black uppercase tracking-widest transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 rounded-xl group"
      :class="currentView === 'matches' ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400'"
      :aria-current="currentView === 'matches' ? 'page' : undefined"
      aria-label="Saved matches"
      @click="$emit('nav', 'matches')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3.25 7.875 3.25c2.106 0 3.875 1.042 4.946 2.56 1.07-1.518 2.84-2.56 4.946-2.56 3.161 0 5.625 2.072 5.625 5.001 0 3.925-2.438 7.111-4.735 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
      </svg>
      Saved
      <span v-if="matchesCount > 0" class="absolute top-1 right-0 sm:right-2 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[9px] font-black text-white ring-2 ring-white dark:bg-white dark:text-zinc-900 dark:ring-black">
        {{ matchesCount }}
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  currentView: 'editor' | 'matches'
  isSettingsOpen: boolean
  matchesCount: number
}>()

defineEmits<{
  (e: 'nav', view: 'editor' | 'matches'): void
  (e: 'toggle-menu'): void
}>()
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>

