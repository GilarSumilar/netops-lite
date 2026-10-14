import { ref } from 'vue'

const toasts = ref([])
let id = 0

export function useToast() {
  function show(message, type = 'success', duration = 3000) {
    const toast = { id: id++, message, type }
    toasts.value.push(toast)
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== toast.id)
    }, duration)
  }

  return {
    toasts,
    showToast: show,
    showSuccess: (msg, dur) => show(msg, 'success', dur),
    showError:   (msg, dur) => show(msg, 'error', dur),
    showWarning: (msg, dur) => show(msg, 'warning', dur),
    showInfo:    (msg, dur) => show(msg, 'info', dur),
  }
}
