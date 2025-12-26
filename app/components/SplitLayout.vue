<template>
  <div class="flex flex-1 overflow-hidden relative"> <!-- Added relative for positioning context if needed, though fixed is viewport based -->
    <!-- MOBILE BACKDROP -->
    <div 
      v-if="isMenuOpen" 
      class="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
      @click="$emit('close-menu')"
    ></div>

    <!-- CONTROL PANEL (Responsive Sidebar) -->
    <aside 
      class="fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 md:w-96 md:shrink-0 shadow-xl md:shadow-none"
      :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-6 space-y-8 pb-24 md:pb-6"> <!-- Added padding bottom for mobile nav spacing -->
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex justify-between items-center">
          Control Panel
          <button @click="$emit('close-menu')" class="md:hidden text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
          </button>
        </h2>
        <slot name="sidebar" />
      </div>
    </aside>

    <!-- LIVE PREVIEW STAGE (Flexible) -->
    <main class="flex-1 bg-slate-50 overflow-y-auto flex items-center justify-center p-4 md:p-12 relative pb-24 md:pb-12"> <!-- Adjusted padding for mobile -->
      <div class="absolute top-6 left-6 text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">Live Preview Stage</div>
      
      <div class="w-full max-w-7xl">
        <slot name="content" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isMenuOpen?: boolean
}>()

defineEmits<{
  (e: 'close-menu'): void
}>()
</script>
