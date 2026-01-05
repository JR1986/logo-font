<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Saved Matches ({{ matches.length }})</h2>
      <button 
        @click="$emit('back')"
        class="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
      >
        ← Back to Editor
      </button>
    </div>

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
        <!-- Delete Button -->
        <button 
          @click="removeMatch(match.id)"
          class="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 dark:bg-slate-800/90 dark:text-slate-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          title="Remove match"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
          </svg>
        </button>

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
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMatches } from '~/composables/useMatches'

defineEmits(['back'])

const { matches, removeMatch } = useMatches()
</script>
