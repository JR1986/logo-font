<template>
  <header class="z-30 flex h-14 shrink-0 items-center justify-between border-b border-ink/10 bg-cream/85 px-4 backdrop-blur-md transition-colors md:h-16 md:px-6 dark:border-white/10 dark:bg-stone-950/85">
    <AppLogo />

    <div class="flex items-center gap-1.5 md:gap-2">
      <!-- Theme toggle -->
      <button
        class="flex h-10 w-10 items-center justify-center rounded-xl text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
        :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :aria-pressed="colorMode.value === 'dark'"
        title="Toggle dark mode"
        @click="toggleColorMode"
      >
        <svg v-if="colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Saved matches -->
      <button
        class="relative flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-black uppercase tracking-widest text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
        aria-label="Open saved matches"
        title="Saved matches"
        @click="$emit('open-saved')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="matchesCount > 0 ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" class="h-5 w-5" :class="matchesCount > 0 ? 'text-coral' : ''">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <span class="hidden md:inline">Saved</span>
        <span
          v-if="matchesCount > 0"
          class="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[10px] font-black text-white dark:bg-white dark:text-ink"
        >
          {{ matchesCount }}
        </span>
      </button>

      <ExportMenu @select="$emit('export', $event)" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { ExportKind } from '~/components/ExportMenu.vue'

defineProps<{
  matchesCount: number
}>()

defineEmits<{
  (e: 'open-saved'): void
  (e: 'export', kind: ExportKind): void
}>()

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
