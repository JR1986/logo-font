<template>
  <div class="bg-white border-b-2 border-zinc-200 px-4 md:px-6 py-4 flex flex-wrap md:flex-nowrap items-center justify-start gap-4 shrink-0 dark:bg-black dark:border-zinc-800 relative z-20">
    <!-- Preview Text Input -->
    <label for="preview-text-input" class="sr-only">Preview text</label>
    <input
      id="preview-text-input"
      :value="previewText"
      @input="$emit('update:previewText', ($event.target as HTMLInputElement).value)"
      type="text"
      placeholder="Type company name..."
      class="w-full md:w-56 min-w-0 px-4 py-2.5 text-base font-bold bg-zinc-100 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 hover:border-zinc-200 outline-none transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:bg-black dark:focus:border-indigo-500 shrink-0 placeholder:font-medium placeholder:text-zinc-500"
    />

    <!-- Font Selector Button - Custom styled dropdown -->
    <button
      ref="fontButtonRef"
      @click="togglePopover('font')"
      :aria-label="`Select font: ${selectedFont}`"
      :aria-expanded="activePopover === 'font'"
      :aria-haspopup="true"
      class="flex items-center justify-between gap-2 w-full md:w-56 px-4 py-2.5 text-base font-bold rounded-xl border-2 border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 transition-all dark:bg-black dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      :class="{ 'bg-zinc-100 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-600': activePopover === 'font' }"
    >
      <span class="truncate">{{ selectedFont }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 shrink-0 text-slate-400">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Settings Button - Opens combined settings popover on mobile -->
    <div class="relative hidden md:block shrink-0">
      <button 
        ref="settingsButtonRef"
        @click="togglePopover('settings')"
        class="flex items-center justify-center gap-2 w-full md:w-32 px-4 py-2.5 text-sm font-bold rounded-xl border-2 border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 transition-all dark:bg-black dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        :class="{ 'bg-zinc-100 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-600': activePopover === 'settings' }"
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.295a1 1 0 0 1 .804.98v1.36a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.295 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.295A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.295-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clip-rule="evenodd" />
        </svg>
        <span class="inline text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">{{ fontSize }}px</span>
      </button>
    </div>

    <!-- Random Font Button (Desktop) -->
    <button
      @click="$emit('randomize')"
      class="hidden md:flex items-center justify-center w-full md:w-32 h-11 text-[10px] font-black uppercase tracking-widest text-white bg-zinc-900 rounded-xl hover:bg-indigo-600 transition-all shadow-sm shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-indigo-500 dark:hover:text-white"
      title="Try a random font (Space)"
    >
      <span class="mr-1.5">Random</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
        <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>

  <!-- Teleported Popovers -->
  <Teleport to="body">
    <!-- Click outside overlay -->
    <div 
      v-if="activePopover" 
      class="fixed inset-0 z-40" 
      @click="closeActivePopover"
    ></div>

    <!-- Font Popover -->
    <div 
      v-if="activePopover === 'font'"
      class="fixed z-50 bg-white dark:bg-black rounded-t-3xl md:rounded-2xl shadow-2xl border-2 border-zinc-200 dark:border-zinc-800 w-full md:w-80 md:max-w-[calc(100vw-32px)] overflow-hidden"
      :style="popoverPosition"
    >
      <!-- Header -->
      <div class="px-5 py-4 border-b-2 border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
        <div class="text-[10px] font-black text-zinc-900 uppercase tracking-widest dark:text-white">Select Font</div>
        <button
          v-if="!installedFontsLoaded"
          @click="handleLoadInstalledFonts"
          :disabled="isLoadingFonts"
          class="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors border-2"
          :class="isLoadingFonts 
            ? 'bg-zinc-100 text-zinc-400 border-transparent dark:bg-zinc-900 dark:text-zinc-500 cursor-wait' 
            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 dark:bg-black dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700'"
        >
          {{ isLoadingFonts ? 'Loading...' : 'Load Local' }}
        </button>
        <span v-else class="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">✓ Loaded</span>
      </div>
      
      <!-- Search Input -->
      <div class="px-4 py-3 border-b-2 border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-black">
        <div class="relative">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            class="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" />
          </svg>
          <input
            v-model="fontSearchQuery"
            type="text"
            placeholder="Find font by name..."
            class="w-full pl-9 pr-4 py-2 text-sm font-medium border-2 border-transparent bg-zinc-200/50 rounded-xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:bg-zinc-900 dark:text-white dark:focus:bg-black dark:focus:border-indigo-500 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
            @keydown.stop
          />
        </div>
      </div>
      
      <!-- Category Filter -->
      <div class="px-4 py-4 border-b-2 border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black">
        <div class="flex flex-wrap gap-1.5">
          <button 
            v-for="category in allCategories" 
            :key="category"
            @click="toggleCategory(category)"
            :aria-pressed="selectedCategories.includes(category)"
            class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            :class="selectedCategories.includes(category) 
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' 
              : 'bg-white text-zinc-500 border-2 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900 dark:bg-black dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:text-white'"
          >
            {{ category }}
          </button>
        </div>
      </div>
      
      <!-- Font List -->
      <div class="max-h-[50vh] md:max-h-64 overflow-y-auto">
        <template v-for="(fontList, category) in filteredFontsForSearch" :key="category">
          <!-- Category Header -->
          <div class="px-5 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-500 sticky top-0 z-10">
            {{ category }}
          </div>
          <!-- Font Items -->
          <button
            v-for="font in fontList"
            :key="font"
            @click="selectFont(font)"
            class="w-full px-5 py-3 text-left text-base transition-colors duration-100 flex items-center justify-between group focus-visible:outline-none focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-800"
            :class="selectedFont === font 
              ? 'bg-zinc-100 text-zinc-900 font-bold dark:bg-zinc-800 dark:text-white' 
              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'"
          >
            <span :style="selectedFont === font ? { fontFamily: font } : {}">{{ font }}</span>
            <svg 
              v-if="selectedFont === font" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              class="w-4 h-4 text-indigo-600 dark:text-indigo-400"
            >
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
            </svg>
          </button>
        </template>
        <!-- No results message -->
        <div 
          v-if="Object.keys(filteredFontsForSearch).length === 0" 
          class="px-5 py-8 text-center text-sm font-medium text-zinc-400 border-t-2 border-zinc-100 dark:border-zinc-900 dark:text-zinc-500"
        >
          No fonts found matching "{{ fontSearchQuery }}"
        </div>
      </div>
    </div>

    <!-- Combined Settings Popover -->
    <div 
      v-if="activePopover === 'settings'"
      class="fixed z-50 bg-white dark:bg-black rounded-t-3xl md:rounded-2xl shadow-2xl border-2 border-zinc-200 dark:border-zinc-800 p-5 md:w-80 w-full md:max-w-[calc(100vw-32px)] max-h-[85vh] md:max-h-[80vh] overflow-y-auto"
      :style="popoverPosition"
    >
      <!-- Mobile Randomizer Button -->
      <div class="md:hidden pb-5 mb-5 border-b-2 border-zinc-100 dark:border-zinc-900">
        <button
          @click="$emit('randomize')"
          class="flex items-center justify-center w-full h-11 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          <span class="mr-1.5">Try a random font (Space)</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Typography Settings -->
      <div class="mb-5 pb-5 border-b-2 border-zinc-100 dark:border-zinc-900">
        <div class="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-4 dark:text-white">Typography</div>
        
        <!-- Font Size -->
        <div class="mb-3">
          <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mb-2">
            <span class="text-zinc-500 dark:text-zinc-400">Size</span>
            <span class="text-indigo-600 dark:text-indigo-400">{{ fontSize }}px</span>
          </div>
          <input
            :value="fontSize"
            @input="$emit('update:fontSize', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="16"
            max="120"
            class="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-600 dark:bg-zinc-800 dark:accent-indigo-500"
          />
        </div>
        
        <!-- Font Weight -->
        <div class="mb-3">
          <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mb-2">
            <span class="text-zinc-500 dark:text-zinc-400">Weight</span>
            <span class="text-indigo-600 dark:text-indigo-400">{{ fontWeight }}</span>
          </div>
          <input
            :value="fontWeight"
            @input="$emit('update:fontWeight', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="100"
            max="900"
            step="100"
            class="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-600 dark:bg-zinc-800 dark:accent-indigo-500"
          />
        </div>
        
        <!-- Letter Spacing -->
        <div>
          <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest mb-2">
            <span class="text-zinc-500 dark:text-zinc-400">Spacing</span>
            <span class="text-indigo-600 dark:text-indigo-400">{{ letterSpacing }}px</span>
          </div>
          <input
            :value="letterSpacing"
            @input="$emit('update:letterSpacing', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="-5"
            max="20"
            step="1"
            class="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-600 dark:bg-zinc-800 dark:accent-indigo-500"
          />
        </div>
      </div>
      
      <!-- Colors -->
      <div>
        <div class="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-4 dark:text-white">Colors</div>
        
        <!-- Font Color -->
        <div class="mb-4">
          <label class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Font Color</label>
          <div class="flex items-center gap-2">
            <input
              :value="fontColor"
              @input="$emit('update:fontColor', ($event.target as HTMLInputElement).value)"
              type="color"
              class="h-10 w-16 p-1 bg-white border-2 border-zinc-200 rounded-xl cursor-pointer dark:bg-black dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            />
            <span class="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">{{ fontColor }}</span>
          </div>
        </div>
        
        <!-- Preview Background -->
        <div class="mb-4">
          <label class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Background</label>
          <div class="flex p-1 bg-zinc-100 rounded-xl dark:bg-zinc-900 border-2 border-transparent dark:border-zinc-800">
            <button
              type="button"
              class="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              :class="previewBg === 'white' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50 dark:bg-black dark:text-white dark:border-zinc-700' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'"
              @click="$emit('update:previewBg', 'white')"
            >
              Light
            </button>
            <button
              type="button"
              class="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              :class="previewBg === 'black' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50 dark:bg-black dark:text-white dark:border-zinc-700' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'"
              @click="$emit('update:previewBg', 'black')"
            >
              Dark
            </button>
          </div>
        </div>
        
        <!-- Layout Direction -->
        <div class="pt-5 border-t-2 border-zinc-100 dark:border-zinc-900">
          <label class="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Layout</label>
          <div class="flex p-1 bg-zinc-100 rounded-xl dark:bg-zinc-900 border-2 border-transparent dark:border-zinc-800">
            <button
              type="button"
              class="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              :class="layoutDirection === 'horizontal' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50 dark:bg-black dark:text-white dark:border-zinc-700' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'"
              @click="$emit('update:layoutDirection', 'horizontal')"
              title="Horizontal layout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                <path d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" />
              </svg>
            </button>
            <button
              type="button"
              class="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              :class="layoutDirection === 'vertical' ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/50 dark:bg-black dark:text-white dark:border-zinc-700' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'"
              @click="$emit('update:layoutDirection', 'vertical')"
              title="Vertical layout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 rotate-90">
                <path d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FontCategories, FontCategory } from '~/types'

interface Props {
  previewText: string
  selectedFont: string
  fontCategories: Partial<FontCategories>
  selectedCategories: FontCategory[]
  allCategories: FontCategory[]
  installedFontsLoaded: boolean
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
  previewBg: 'white' | 'black'
  layoutDirection: 'horizontal' | 'vertical'
}

interface Emits {
  (e: 'update:previewText', value: string): void
  (e: 'update:selectedFont', value: string): void
  (e: 'update:selectedCategories', value: FontCategory[]): void
  (e: 'update:fontSize', value: number): void
  (e: 'update:fontWeight', value: number): void
  (e: 'update:letterSpacing', value: number): void
  (e: 'update:fontColor', value: string): void
  (e: 'update:previewBg', value: 'white' | 'black'): void
  (e: 'update:layoutDirection', value: 'horizontal' | 'vertical'): void
  (e: 'randomize'): void
  (e: 'loadInstalledFonts'): Promise<boolean>
  (e: 'settings-toggle', open: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Button refs for positioning popovers
const logoButtonRef = ref<HTMLElement | null>(null)
const fontButtonRef = ref<HTMLElement | null>(null)
const settingsButtonRef = ref<HTMLElement | null>(null)

type PopoverType = 'logo' | 'font' | 'settings' | null
const activePopover = ref<PopoverType>(null)
const popoverPosition = ref<{ top?: string; left?: string; bottom?: string; right?: string }>({ top: '120px', left: '16px' })
const isLoadingFonts = ref(false)
const fontSearchQuery = ref('')

// Filter fonts based on search query
const filteredFontsForSearch = computed<Partial<FontCategories>>(() => {
  const query = fontSearchQuery.value.toLowerCase().trim()
  
  // If no search query, return all fonts from fontCategories prop
  if (!query) {
    return props.fontCategories
  }
  
  // Filter fonts that match the search query
  const filtered: Partial<FontCategories> = {}
  
  for (const [category, fonts] of Object.entries(props.fontCategories)) {
    const matchingFonts = fonts.filter(font => 
      font.toLowerCase().includes(query)
    )
    if (matchingFonts.length > 0) {
      filtered[category as FontCategory] = matchingFonts
    }
  }
  
  return filtered
})

async function handleLoadInstalledFonts() {
  isLoadingFonts.value = true
  try {
    await emit('loadInstalledFonts')
  } finally {
    isLoadingFonts.value = false
  }
}

function togglePopover(type: PopoverType) {
  if (activePopover.value === type) {
    activePopover.value = null
    // Clear search when closing font popover
    if (type === 'font') {
      fontSearchQuery.value = ''
    }
    if (type === 'settings') {
      emit('settings-toggle', false)
    }
  } else {
    // Calculate position before opening
    const viewportWidth = window.innerWidth
    
    // Bottom sheet behavior for mobile
    if (viewportWidth < 768) {
      popoverPosition.value = {
        bottom: type === 'settings' ? '64px' : '0px', // slightly higher if settings so it doesn't collide poorly, or attach to bottom
        top: 'auto',
        left: '0px',
        right: '0px'
      }
      activePopover.value = type
      if (type === 'settings') {
        emit('settings-toggle', true)
      }
      return
    }

    // Standard positioning for desktop
    const buttonRefs: Record<string, typeof fontButtonRef> = {
      font: fontButtonRef,
      settings: settingsButtonRef
    }
    const buttonRef = type ? buttonRefs[type] : null
    if (buttonRef?.value) {
      const rect = buttonRef.value.getBoundingClientRect()
      const popoverWidth = 288
      
      // Center the popover under the button
      let left = rect.left + (rect.width / 2) - (popoverWidth / 2)
      
      // Keep popover within viewport
      if (left + popoverWidth > viewportWidth - 16) {
        left = viewportWidth - popoverWidth - 16
      }
      
      // Ensure minimum left margin
      left = Math.max(16, left)
      
      popoverPosition.value = {
        top: `${rect.bottom + 8}px`,
        left: `${left}px`,
        bottom: 'auto',
        right: 'auto'
      }
    }
    activePopover.value = type
    if (type === 'settings') {
      emit('settings-toggle', true)
    }
  }
}

function toggleCategory(category: FontCategory) {
  const newCategories = [...props.selectedCategories]
  const index = newCategories.indexOf(category)
  
  if (index === -1) {
    newCategories.push(category)
  } else {
    newCategories.splice(index, 1)
  }
  
  emit('update:selectedCategories', newCategories)
}

function handleFontChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:selectedFont', target.value)
}

function selectFont(font: string) {
  emit('update:selectedFont', font)
  activePopover.value = null
}

// Open settings popover (exposed for external triggering)
function openSettings() {
  togglePopover('settings')
}

// Close active popover (used by click-outside overlay)
function closeActivePopover() {
  if (activePopover.value === 'settings') {
    emit('settings-toggle', false)
  }
  if (activePopover.value === 'font') {
    fontSearchQuery.value = ''
  }
  activePopover.value = null
}

// Expose for parent component
defineExpose({ openSettings })
</script>

