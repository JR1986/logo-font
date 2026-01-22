<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Saved Matches ({{ matches.length }})</h2>

    <div v-if="matches.length === 0" class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <p class="text-slate-500 text-lg dark:text-slate-400">No saved matches yet.</p>
      <p class="text-slate-400 mt-2 dark:text-slate-500">Go back to the editor to save your first match!</p>
    </div>

    <div v-else class="grid md:grid-cols-2 gap-6">
      <div 
        v-for="match in matches" 
        :key="match.id"
        class="relative group"
      >
        <!-- Action Buttons -->
        <div class="absolute top-4 right-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
          <!-- Copy SVG Button -->
          <button 
            @click="copyMatchSvg(match)"
            class="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full transition-all dark:bg-slate-800/90"
            :class="copiedId === match.id ? 'text-green-500' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:text-slate-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'"
            :title="copiedId === match.id ? 'Copied!' : 'Copy as SVG'"
          >
            <svg v-if="copiedId !== match.id" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>

          <!-- Delete Button -->
          <button 
            @click="removeMatch(match.id)"
            class="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all dark:bg-slate-800/90 dark:text-slate-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            title="Remove match"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Preview Card -->
        <PreviewArea
          :logo="match.logo"
          :text="match.text"
          :font="match.font"
          :font-size="match.fontSize"
          :font-weight="match.fontWeight"
          :letter-spacing="match.letterSpacing || 0"
          :font-color="match.fontColor"
          :font-category="match.fontCategory"
          :preview-bg="match.previewBg"
          :direction="match.direction || 'horizontal'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMatches, type SavedMatch } from '~/composables/useMatches'
import { generateSvg } from '~/utils/svg'

defineEmits(['back'])

const { matches, removeMatch } = useMatches()
const copiedId = ref<string | null>(null)

async function copyMatchSvg(match: SavedMatch) {
  try {
    const svgString = generateSvg({
      logo: match.logo,
      text: match.text,
      font: match.font,
      fontSize: match.fontSize,
      fontWeight: match.fontWeight,
      letterSpacing: match.letterSpacing || 0,
      fontColor: match.fontColor
    })
    await navigator.clipboard.writeText(svgString)
    copiedId.value = match.id
    setTimeout(() => {
      copiedId.value = null
    }, 2000)
  } catch (error) {
    console.error('Failed to copy SVG:', error)
  }
}
</script>
