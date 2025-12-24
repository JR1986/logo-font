<template>
  <div class="flex flex-1 overflow-hidden">
    <!-- CONTROL PANEL (Fixed Sidebar) -->
    <aside class="w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 z-0">
      <div class="p-6 space-y-8">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Control Panel</h2>
        <slot name="sidebar" />
      </div>
    </aside>

    <!-- LIVE PREVIEW STAGE (Flexible) -->
    <main class="flex-1 bg-slate-50 overflow-y-auto flex items-center justify-center p-8 md:p-12 relative">
      <div class="absolute top-6 left-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview Stage</div>
      
      <div class="w-full max-w-4xl">
        <slot name="content" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout component logic can go here if needed in the future
</script>
