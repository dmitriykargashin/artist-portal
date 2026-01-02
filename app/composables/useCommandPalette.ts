export const useCommandPalette = () => {
  const isOpen = useState('command-palette-open', () => false)
  const search = useState('command-palette-search', () => '')

  function open() {
    isOpen.value = true
    search.value = ''
  }

  function close() {
    isOpen.value = false
    search.value = ''
  }

  function toggle() {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  // Setup keyboard shortcut
  if (import.meta.client) {
    onMounted(() => {
      const handleKeydown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault()
          toggle()
        }
        if (e.key === 'Escape' && isOpen.value) {
          close()
        }
      }

      window.addEventListener('keydown', handleKeydown)
      
      onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown)
      })
    })
  }

  return {
    isOpen,
    search,
    open,
    close,
    toggle
  }
}
