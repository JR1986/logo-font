<template>
  <div class="relative">
    <button
      class="flex h-10 items-center gap-2 rounded-xl bg-sun px-3.5 md:px-4 text-xs font-black uppercase tracking-widest text-ink shadow-sm transition-all hover:bg-sun-deep active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
      :aria-expanded="open"
      aria-haspopup="true"
      @click="open = !open"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
      </svg>
      <span class="hidden sm:inline">Export</span>
    </button>

    <!-- Click-outside layer -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false"></div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-ink/10 bg-white p-1.5 shadow-pop dark:border-white/10 dark:bg-stone-900"
        role="menu"
      >
        <button
          v-for="item in items"
          :key="item.kind"
          class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-sun/15 focus-visible:bg-sun/15 focus-visible:outline-none dark:hover:bg-sun/10"
          role="menuitem"
          @click="select(item.kind)"
        >
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper text-ink dark:bg-stone-800 dark:text-stone-200" v-html="item.icon"></span>
          <span class="min-w-0">
            <span class="block text-sm font-bold text-ink dark:text-white">{{ item.label }}</span>
            <span class="block truncate text-[11px] font-medium text-ink/50 dark:text-stone-400">{{ item.hint }}</span>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export type ExportKind = 'copy-svg' | 'svg' | 'png' | 'md'

const emit = defineEmits<{
  (e: 'select', kind: ExportKind): void
}>()

const open = ref(false)

const items: Array<{ kind: ExportKind; label: string; hint: string; icon: string }> = [
  {
    kind: 'copy-svg',
    label: 'Copy SVG',
    hint: 'Paste straight into Figma — C',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z"/><path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z"/></svg>'
  },
  {
    kind: 'svg',
    label: 'Download SVG',
    hint: 'Vector wordmark file',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z" clip-rule="evenodd"/></svg>'
  },
  {
    kind: 'png',
    label: 'Download PNG',
    hint: '2× raster on canvas color',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" clip-rule="evenodd"/></svg>'
  },
  {
    kind: 'md',
    label: 'DESIGN.md',
    hint: 'Brand sheet with CSS + font links',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clip-rule="evenodd"/></svg>'
  }
]

function select(kind: ExportKind) {
  open.value = false
  emit('select', kind)
}
</script>
