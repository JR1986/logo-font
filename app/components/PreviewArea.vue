<template>
  <div class="flex w-full flex-col items-center">
    <!-- Logo + wordmark -->
    <div
      class="flex w-full items-center justify-center gap-6 px-4 md:gap-10"
      :class="direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'"
    >
      <!-- Logo tile -->
      <div class="group/logo relative shrink-0">
        <button
          type="button"
          class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun focus-visible:ring-offset-2 md:h-32 md:w-32"
          :class="logo
            ? 'hover:scale-[1.03] active:scale-95'
            : (onDark
              ? 'border-2 border-dashed border-white/25 text-white/40 hover:border-sun hover:text-sun'
              : 'border-2 border-dashed border-ink/20 text-ink/40 hover:border-sun-deep hover:text-ink')"
          :title="logo ? 'Click to replace logo' : 'Upload a logo (click or drop a file)'"
          :aria-label="logo ? 'Replace logo' : 'Upload logo'"
          @click="triggerLogoUpload"
          @dragover.prevent
          @drop.prevent="handleLogoDrop"
        >
          <img v-if="logo" :src="logo" alt="Logo preview" class="h-full w-full object-contain" />
          <span v-else class="flex flex-col items-center gap-1.5">
            <svg class="h-8 w-8 transition-transform duration-300 group-hover/logo:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-[9px] font-black uppercase tracking-widest">Your logo</span>
          </span>
        </button>
        <input ref="logoInputRef" type="file" accept="image/*" class="hidden" @change="handleLogoSelect" />

        <!-- Remove logo -->
        <button
          v-if="logo && editable"
          type="button"
          class="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white opacity-0 shadow-md transition-opacity hover:bg-coral focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral group-hover/logo:opacity-100 dark:bg-white dark:text-ink dark:hover:bg-coral dark:hover:text-white"
          aria-label="Remove logo"
          title="Remove logo"
          @click.stop="$emit('update:logo', null)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>

      <!-- Wordmark: inline editable in the editor, static elsewhere -->
      <div
        v-if="editable"
        ref="editableRef"
        contenteditable="plaintext-only"
        spellcheck="false"
        data-testid="preview-text"
        :data-placeholder="placeholder"
        :style="fontStyle"
        class="max-w-full cursor-text whitespace-pre-wrap break-words text-center outline-none transition-colors duration-300 empty:before:content-[attr(data-placeholder)] empty:before:opacity-30"
        :class="onDark ? 'caret-[#FFC700]' : 'caret-[#FF5436]'"
        role="textbox"
        aria-label="Wordmark text — type your brand name"
        @input="onTextInput"
        @keydown.enter.prevent
        @paste.prevent="onPaste"
      ></div>
      <div
        v-else
        data-testid="preview-text"
        :style="fontStyle"
        class="max-w-full whitespace-pre-wrap break-words text-center transition-colors duration-300"
      >
        {{ text }}
      </div>
    </div>

    <!-- Font chip -->
    <div class="mt-10 flex justify-center md:mt-14">
      <div
        class="flex items-center gap-2.5 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-sm backdrop-blur transition-colors duration-300"
        :class="onDark ? 'border-white/15 bg-white/5 text-stone-400' : 'border-ink/10 bg-white/80 text-ink/50'"
      >
        <span :class="onDark ? 'text-white' : 'text-ink'">{{ font }}</span>
        <template v-if="fontCategory">
          <span class="opacity-40">·</span>
          <span>{{ fontCategory }}</span>
        </template>
        <span class="opacity-40">·</span>
        <span>{{ fontWeight }}</span>
        <a
          v-if="fontSlug"
          :href="`https://www.fontshare.com/fonts/${fontSlug}`"
          target="_blank"
          rel="noopener"
          class="-mr-1 flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-sun hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun"
          :title="`View ${font} on Fontshare`"
          :aria-label="`View ${font} on Fontshare`"
          @click.stop
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
            <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clip-rule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { CSSProperties } from 'vue'

interface Props {
  logo: string | null
  text: string
  font: string
  fontSize: number
  fontWeight: number
  letterSpacing: number
  fontColor: string
  fontCategory: string | null
  previewBg?: 'white' | 'black'
  direction?: 'horizontal' | 'vertical'
  editable?: boolean
  fontSlug?: string | null
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  previewBg: 'white',
  direction: 'horizontal',
  editable: false,
  fontSlug: null,
  placeholder: 'Your brand'
})

const emit = defineEmits<{
  (e: 'update:logo', value: string | null): void
  (e: 'update:text', value: string): void
}>()

const onDark = computed(() => props.previewBg === 'black')

// --- Logo upload ---
const logoInputRef = ref<HTMLInputElement | null>(null)

function triggerLogoUpload() {
  logoInputRef.value?.click()
}

function handleLogoSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processLogoFile(file)
  }
}

function handleLogoDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processLogoFile(file)
  }
}

function processLogoFile(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('update:logo', e.target?.result as string)
  }
  reader.readAsDataURL(file)
}

// --- Inline wordmark editing ---
// The contenteditable node is intentionally not bound to {{ text }}:
// re-rendering on every keystroke would reset the caret position.
const editableRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (editableRef.value) {
    editableRef.value.textContent = props.text
  }
})

watch(() => props.text, (newText) => {
  const el = editableRef.value
  if (el && el.textContent !== newText) {
    el.textContent = newText
  }
})

function onTextInput() {
  emit('update:text', editableRef.value?.textContent ?? '')
}

function onPaste(event: ClipboardEvent) {
  const plain = event.clipboardData?.getData('text/plain').replace(/\n/g, ' ') ?? ''
  if (!plain) return
  // insertText keeps the caret position and triggers the input event
  document.execCommand('insertText', false, plain)
}

const fontStyle = computed<CSSProperties>(() => ({
  fontFamily: `'${props.font}'`,
  fontSize: `${props.fontSize}px`,
  fontWeight: props.fontWeight,
  letterSpacing: `${props.letterSpacing}px`,
  color: props.fontColor
}))
</script>
