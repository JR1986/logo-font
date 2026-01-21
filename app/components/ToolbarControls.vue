<template>
  <div class="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-start gap-2 shrink-0 dark:bg-slate-900 dark:border-slate-800 relative">
    <!-- Logo Upload Button -->
    <div class="relative shrink-0">
      <button 
        ref="logoButtonRef"
        @click="togglePopover('logo')"
        class="flex items-center justify-center w-24 h-9 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors dark:border-slate-600 dark:hover:border-blue-500 overflow-hidden"
        :class="{ 'border-solid border-blue-500': uploadedLogo }"
        title="Upload logo"
      >
        <img v-if="uploadedLogo" :src="uploadedLogo" alt="Logo" class="w-full h-full object-contain" />
        <svg v-else class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
    </div>

    <!-- Preview Text Input -->
    <input
      :value="previewText"
      @input="$emit('update:previewText', ($event.target as HTMLInputElement).value)"
      type="text"
      placeholder="Preview text..."
      class="w-40 sm:w-48 min-w-0 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:focus:ring-blue-900 shrink-0"
    />

    <!-- Font Selector - Compact on mobile -->
    <select
      :value="selectedFont"
      @change="handleFontChange"
      class="hidden sm:block px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none transition-all bg-white cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:focus:ring-blue-900 max-w-[140px] shrink-0"
    >
      <optgroup v-for="(fontList, category) in fontCategories" :key="category" :label="category">
        <option v-for="font in fontList" :key="font" :value="font">
          {{ font }}
        </option>
      </optgroup>
    </select>

    <!-- Mobile Font Button - Opens popover with font selector -->
    <button
      ref="fontButtonRef"
      @click="togglePopover('font')"
      class="sm:hidden flex items-center justify-center gap-1 w-24 px-2 py-1.5 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-800 shrink-0"
      :class="{ 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700': activePopover === 'font' }"
    >
      <span class="max-w-[60px] truncate">{{ selectedFont.split(' ')[0] }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- Settings Button - Opens combined settings popover on mobile -->
    <div class="relative shrink-0">
      <button 
        ref="settingsButtonRef"
        @click="togglePopover('settings')"
        class="flex items-center justify-center gap-1 w-24 px-2 py-1.5 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-800"
        :class="{ 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700': activePopover === 'settings' }"
        title="Settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.295a1 1 0 0 1 .804.98v1.36a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.295 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.295A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.295-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clip-rule="evenodd" />
        </svg>
        <span class="hidden md:inline text-xs text-slate-500 dark:text-slate-400">{{ fontSize }}px</span>
      </button>
    </div>

    <!-- Random Font Button -->
    <button
      @click="$emit('randomize')"
      class="flex items-center justify-center w-24 h-9 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0"
      title="Random font (Spacebar)"
    >
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
      @click="activePopover = null"
    ></div>

    <!-- Logo Popover -->
    <div 
      v-if="activePopover === 'logo'"
      class="fixed z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 w-64 max-w-[calc(100vw-32px)]"
      :style="popoverPosition"
    >
      <LogoUpload :model-value="uploadedLogo" @update:model-value="$emit('update:uploadedLogo', $event)" />
    </div>

    <!-- Font Popover (Mobile) -->
    <div 
      v-if="activePopover === 'font'"
      class="fixed z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 w-72 max-w-[calc(100vw-32px)] max-h-[70vh] overflow-y-auto"
      :style="popoverPosition"
    >
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 dark:text-slate-400">Select Font</div>
      
      <!-- Category Filter -->
      <div class="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div class="text-xs text-slate-500 mb-2 dark:text-slate-400">Categories</div>
        <div class="flex flex-wrap gap-2">
          <label 
            v-for="category in allCategories" 
            :key="category"
            class="flex items-center gap-1.5 cursor-pointer"
          >
            <input 
              type="checkbox"
              :checked="selectedCategories.includes(category)"
              @change="toggleCategory(category)"
              class="w-3.5 h-3.5 border-2 border-slate-300 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
            >
            <span class="text-xs text-slate-600 dark:text-slate-400">{{ category }}</span>
          </label>
        </div>
      </div>
      
      <!-- Font List -->
      <select
        :value="selectedFont"
        @change="handleFontChange"
        class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 outline-none bg-white cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
        size="8"
      >
        <optgroup v-for="(fontList, category) in fontCategories" :key="category" :label="category">
          <option v-for="font in fontList" :key="font" :value="font">
            {{ font }}
          </option>
        </optgroup>
      </select>
    </div>

    <!-- Combined Settings Popover -->
    <div 
      v-if="activePopover === 'settings'"
      class="fixed z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 w-72 max-w-[calc(100vw-32px)] max-h-[80vh] overflow-y-auto"
      :style="popoverPosition"
    >
      <!-- Category Filter (Desktop only shows in settings) -->
      <div class="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700 hidden sm:block">
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 dark:text-slate-400">Categories</div>
        <div class="flex flex-wrap gap-2">
          <label 
            v-for="category in allCategories" 
            :key="category"
            class="flex items-center gap-1.5 cursor-pointer"
          >
            <input 
              type="checkbox"
              :checked="selectedCategories.includes(category)"
              @change="toggleCategory(category)"
              class="w-3.5 h-3.5 border-2 border-slate-300 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer dark:border-slate-600 dark:bg-slate-800"
            >
            <span class="text-xs text-slate-600 dark:text-slate-400">{{ category }}</span>
          </label>
        </div>
      </div>

      <!-- Typography Settings -->
      <div class="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 dark:text-slate-400">Typography</div>
        
        <!-- Font Size -->
        <div class="mb-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-600 dark:text-slate-300">Size</span>
            <span class="font-mono text-slate-500 dark:text-slate-400">{{ fontSize }}px</span>
          </div>
          <input
            :value="fontSize"
            @input="$emit('update:fontSize', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="16"
            max="120"
            class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:bg-slate-700"
          />
        </div>
        
        <!-- Font Weight -->
        <div class="mb-3">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-600 dark:text-slate-300">Weight</span>
            <span class="font-mono text-slate-500 dark:text-slate-400">{{ fontWeight }}</span>
          </div>
          <input
            :value="fontWeight"
            @input="$emit('update:fontWeight', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="100"
            max="900"
            step="100"
            class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:bg-slate-700"
          />
        </div>
        
        <!-- Letter Spacing -->
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-600 dark:text-slate-300">Spacing</span>
            <span class="font-mono text-slate-500 dark:text-slate-400">{{ letterSpacing }}px</span>
          </div>
          <input
            :value="letterSpacing"
            @input="$emit('update:letterSpacing', Number(($event.target as HTMLInputElement).value))"
            type="range"
            min="-5"
            max="20"
            step="1"
            class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:bg-slate-700"
          />
        </div>
      </div>
      
      <!-- Colors -->
      <div>
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 dark:text-slate-400">Colors</div>
        
        <!-- Font Color -->
        <div class="mb-3">
          <label class="block text-xs text-slate-600 dark:text-slate-300 mb-1.5">Font Color</label>
          <div class="flex items-center gap-2">
            <input
              :value="fontColor"
              @input="$emit('update:fontColor', ($event.target as HTMLInputElement).value)"
              type="color"
              class="h-8 w-12 p-0.5 bg-white border border-slate-200 rounded cursor-pointer dark:bg-slate-800 dark:border-slate-700"
            />
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ fontColor }}</span>
          </div>
        </div>
        
        <!-- Preview Background -->
        <div>
          <label class="block text-xs text-slate-600 dark:text-slate-300 mb-1.5">Background</label>
          <div class="flex p-0.5 bg-slate-200 rounded-lg dark:bg-slate-700">
            <button
              type="button"
              class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
              :class="previewBg === 'white' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'"
              @click="$emit('update:previewBg', 'white')"
            >
              Light
            </button>
            <button
              type="button"
              class="flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
              :class="previewBg === 'black' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'"
              @click="$emit('update:previewBg', 'black')"
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FontCategories, FontCategory } from '~/types'

interface Props {
  uploadedLogo: string | null
  previewText: string
  selectedFont: string
  fontCategories: Partial<FontCategories>
  selectedCategories: FontCategory[]
  allCategories: FontCategory[]
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
  previewBg: 'white' | 'black'
}

interface Emits {
  (e: 'update:uploadedLogo', value: string | null): void
  (e: 'update:previewText', value: string): void
  (e: 'update:selectedFont', value: string): void
  (e: 'update:selectedCategories', value: FontCategory[]): void
  (e: 'update:fontSize', value: number): void
  (e: 'update:fontWeight', value: number): void
  (e: 'update:letterSpacing', value: number): void
  (e: 'update:fontColor', value: string): void
  (e: 'update:previewBg', value: 'white' | 'black'): void
  (e: 'randomize'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Button refs for positioning popovers
const logoButtonRef = ref<HTMLElement | null>(null)
const fontButtonRef = ref<HTMLElement | null>(null)
const settingsButtonRef = ref<HTMLElement | null>(null)

type PopoverType = 'logo' | 'font' | 'settings' | null
const activePopover = ref<PopoverType>(null)
const popoverPosition = ref<{ top: string; left: string }>({ top: '120px', left: '16px' })

function togglePopover(type: PopoverType) {
  if (activePopover.value === type) {
    activePopover.value = null
  } else {
    // Calculate position before opening
    const buttonRefs: Record<string, typeof logoButtonRef> = {
      logo: logoButtonRef,
      font: fontButtonRef,
      settings: settingsButtonRef
    }
    const buttonRef = type ? buttonRefs[type] : null
    if (buttonRef?.value) {
      const rect = buttonRef.value.getBoundingClientRect()
      const popoverWidth = 288
      const viewportWidth = window.innerWidth
      
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
        left: `${left}px`
      }
    }
    activePopover.value = type
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

// Open settings popover (exposed for external triggering)
function openSettings() {
  togglePopover('settings')
}

// Expose for parent component
defineExpose({ openSettings })

// Get popover position based on button location
function getPopoverPosition(buttonRef: typeof logoButtonRef) {
  if (!buttonRef?.value) {
    return { top: '120px', left: '16px' }
  }
  
  const rect = buttonRef.value.getBoundingClientRect()
  const popoverWidth = 288
  const viewportWidth = window.innerWidth
  
  // Center the popover under the button
  let left = rect.left + (rect.width / 2) - (popoverWidth / 2)
  
  // Keep popover within viewport
  if (left + popoverWidth > viewportWidth - 16) {
    left = viewportWidth - popoverWidth - 16
  }
  
  // Ensure minimum left margin
  left = Math.max(16, left)
  
  return {
    top: `${rect.bottom + 8}px`,
    left: `${left}px`
  }
}
</script>

