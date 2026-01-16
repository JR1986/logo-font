<template>
  <div class="flex flex-1 overflow-hidden relative">
    <!-- MOBILE BACKDROP -->
    <div 
      v-if="isMenuOpen" 
      class="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
      @click="$emit('close-menu')"
    ></div>

    <!-- CONTROL PANEL (Responsive Sidebar) -->
    <aside 
      class="fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out md:static md:z-0 md:shrink-0 shadow-xl md:shadow-none dark:bg-slate-900 dark:border-slate-800"
      :class="[
        isMenuOpen ? 'translate-x-0' : '-translate-x-full',
        isCollapsed ? 'md:w-0 md:opacity-0 md:overflow-hidden' : 'md:w-96 md:translate-x-0 md:opacity-100'
      ]"
    >
      <div class="p-6 space-y-8 pb-24 md:pb-6 min-w-80 md:min-w-96">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex justify-between items-center dark:text-slate-500">
          Control Panel
          <div class="flex items-center gap-2">
            <!-- Desktop collapse button -->
            <button 
              @click="isCollapsed = true" 
              class="hidden md:block text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Collapse sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clip-rule="evenodd" />
              </svg>
            </button>
            <!-- Mobile close button -->
            <button @click="$emit('close-menu')" class="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </h2>
        <slot name="sidebar" />
      </div>
    </aside>

    <!-- LIVE PREVIEW STAGE (Flexible) -->
    <main class="flex-1 bg-slate-50 overflow-y-auto flex items-center justify-center p-4 md:p-12 relative pb-24 md:pb-12 dark:bg-slate-950">
      <!-- Expand button (visible when collapsed on desktop) -->
      <button 
        v-if="isCollapsed"
        @click="isCollapsed = false"
        class="hidden md:flex absolute top-6 left-6 z-10 items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 transition-all"
        title="Expand sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
        </svg>
        Control Panel
      </button>
      <div v-else class="absolute top-6 left-6 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block dark:text-slate-600">Live Preview Stage</div>
      
      <div class="w-full max-w-7xl">
        <slot name="content" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isMenuOpen?: boolean
}>()

defineEmits<{
  (e: 'close-menu'): void
}>()

// Desktop sidebar collapsed state (open by default)
const isCollapsed = ref(false)
</script>
