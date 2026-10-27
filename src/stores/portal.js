import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const usePortalStore = defineStore('portal', () => {
  const data = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      data.value = await api.portal()
      return data.value
    } catch (cause) {
      error.value = cause.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profile) {
    const result = await api.portalProfile(profile)
    if (data.value) {
      data.value.user = result.user
      data.value.customer = result.customer
    }
    return result
  }

  async function createTicket(ticket) {
    const created = await api.portalTicket(ticket)
    if (data.value) data.value.pengaduan.unshift(created)
    return created
  }

  function clear() {
    data.value = null
    error.value = ''
  }

  return { data, loading, error, load, updateProfile, createTicket, clear }
})
