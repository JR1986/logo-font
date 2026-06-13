<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px]" aria-hidden="true" @click="$emit('close')"></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="open"
        class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-ink/10 bg-cream shadow-pop dark:border-white/10 dark:bg-stone-950"
        role="dialog"
        aria-label="Saved matches"
      >
        <!-- Header -->
        <header class="flex h-14 shrink-0 items-center justify-between border-b border-ink/10 px-5 md:h-16 dark:border-white/10">
          <h2 class="flex items-baseline gap-2 text-lg font-black text-ink dark:text-white">
            Saved <span class="font-serif italic font-medium">matches</span>
            <span v-if="matches.length > 0" class="rounded-full bg-sun px-2 py-0.5 text-[10px] font-black text-ink">{{ matches.length }}</span>
          </h2>
          <button
            class="flex h-9 w-9 items-center justify-center rounded-xl text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close saved matches"
            @click="$emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </header>

        <!-- Empty state -->
        <div v-if="matches.length === 0" class="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-10 w-10 text-ink/20 dark:text-stone-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <p class="font-serif text-xl italic text-ink/70 dark:text-stone-300">Nothing saved yet</p>
          <p class="text-sm font-medium text-ink/40 dark:text-stone-500">
            Found a font that clicks with your mark?<br />
            Hit the heart — or press <kbd class="rounded-md bg-ink/10 px-1.5 py-0.5 font-sans text-[10px] font-black dark:bg-white/10">S</kbd> — to keep it here.
          </p>
        </div>

        <!-- Matches -->
        <div v-else class="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
          <article
            v-for="match in matches"
            :key="match.id"
            class="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition-shadow hover:shadow-pop dark:border-white/10 dark:bg-stone-900"
          >
            <!-- Mini preview (click to apply) -->
            <button
              class="block w-full px-6 py-7 text-left transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sun"
              :style="{ backgroundColor: match.previewBg === 'black' ? '#141413' : '#FFFFFF' }"
              :title="`Load ${match.font} in the editor`"
              @click="$emit('apply', match)"
            >
              <span
                class="flex items-center gap-3 overflow-hidden"
                :class="match.direction === 'vertical' ? 'flex-col' : 'flex-row'"
              >
                <img v-if="match.logo" :src="match.logo" alt="" class="h-9 w-9 shrink-0 object-contain" />
                <span
                  class="block max-w-full truncate text-2xl leading-snug"
                  :style="{
                    fontFamily: `'${match.font}'`,
                    fontWeight: match.fontWeight,
                    letterSpacing: `${(match.letterSpacing || 0) * 0.5}px`,
                    color: match.fontColor
                  }"
                >
                  {{ match.text || 'Your brand' }}
                </span>
              </span>
            </button>

            <!-- Meta + actions -->
            <footer class="flex items-center justify-between gap-2 border-t border-ink/5 px-4 py-2.5 dark:border-white/5">
              <div class="min-w-0 text-[10px] font-black uppercase tracking-widest text-ink/50 dark:text-stone-400">
                <span class="block truncate text-ink dark:text-white">{{ match.font }}</span>
                <span>{{ match.fontCategory || '—' }} · {{ match.fontWeight }} · {{ match.fontSize }}px</span>
              </div>
              <div class="flex shrink-0 items-center gap-0.5">
                <button
                  class="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-sun/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun dark:text-stone-500 dark:hover:text-white"
                  title="Load in editor"
                  :aria-label="`Load ${match.font} in editor`"
                  @click="$emit('apply', match)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                    <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                    <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v8.5A2.75 2.75 0 0 0 4.75 18h8.5A2.75 2.75 0 0 0 16 15.25V13a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-8.5c-.69 0-1.25-.56-1.25-1.25v-8.5Z" />
                  </svg>
                </button>
                <button
                  class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-sun/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun"
                  :class="copyErrorId === match.id ? 'text-coral' : copiedId === match.id ? 'text-emerald-500' : 'text-ink/40 hover:text-ink dark:text-stone-500 dark:hover:text-white'"
                  :title="copyErrorId === match.id ? 'Copy failed — check clipboard permissions' : copiedId === match.id ? 'Copied!' : 'Copy as SVG'"
                  :aria-label="copyErrorId === match.id ? 'Copy failed' : copiedId === match.id ? 'Copied' : 'Copy as SVG'"
                  @click="copyMatchSvg(match)"
                >
                  <svg v-if="copiedId === match.id" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
                <button
                  class="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-coral/10 hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral dark:text-stone-500"
                  title="Delete this match"
                  :aria-label="`Delete ${match.text} match`"
                  @click="removeMatch(match.id)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </footer>
          </article>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMatches, type SavedMatch } from '~/composables/useMatches'
import { generateSvg } from '~/utils/svg'

defineProps<{
  open: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'apply', match: SavedMatch): void
}>()

const { matches, removeMatch } = useMatches()
const copiedId = ref<string | null>(null)
const copyErrorId = ref<string | null>(null)

async function copyMatchSvg(match: SavedMatch) {
  try {
    const svgString = generateSvg({
      logo: match.logo,
      text: match.text,
      font: match.font,
      fontSize: match.fontSize,
      fontWeight: match.fontWeight,
      letterSpacing: match.letterSpacing || 0,
      fontColor: match.fontColor,
      direction: match.direction || 'horizontal'
    })
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not available')
    }
    await navigator.clipboard.writeText(svgString)
    copiedId.value = match.id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (error) {
    console.error('Failed to copy SVG:', error)
    copyErrorId.value = match.id
    setTimeout(() => {
      copyErrorId.value = null
    }, 2500)
  }
}
</script>
