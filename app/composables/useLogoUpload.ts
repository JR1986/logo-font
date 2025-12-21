import { ref } from 'vue'

/**
 * Composable for managing logo upload with drag & drop
 */
export function useLogoUpload() {
  const uploadedLogo = ref<string | null>(null)
  const isDragging = ref<boolean>(false)
  const fileInput = ref<HTMLInputElement | null>(null)

  /**
   * Trigger the hidden file input
   */
  function triggerFileInput(): void {
    fileInput.value?.click()
  }

  /**
   * Handle file selection from input
   */
  function handleFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  /**
   * Handle file drop
   */
  function handleDrop(event: DragEvent): void {
    isDragging.value = false
    const file = event.dataTransfer?.files[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    }
  }

  /**
   * Process uploaded file to base64
   */
  function processFile(file: File): void {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedLogo.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  /**
   * Clear the uploaded logo
   */
  function clearLogo(): void {
    uploadedLogo.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  /**
   * Set dragging state
   */
  function setDragging(value: boolean): void {
    isDragging.value = value
  }

  return {
    uploadedLogo,
    isDragging,
    fileInput,
    triggerFileInput,
    handleFileSelect,
    handleDrop,
    clearLogo,
    setDragging
  }
}
