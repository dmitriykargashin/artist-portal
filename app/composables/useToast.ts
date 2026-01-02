interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  function addToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).slice(2)
    const newToast: Toast = { ...toast, id }
    
    toasts.value.push(newToast)
    
    // Auto-remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string, title?: string) {
    return addToast({ type: 'success', message, title })
  }

  function error(message: string, title?: string) {
    return addToast({ type: 'error', message, title })
  }

  function warning(message: string, title?: string) {
    return addToast({ type: 'warning', message, title })
  }

  function info(message: string, title?: string) {
    return addToast({ type: 'info', message, title })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
