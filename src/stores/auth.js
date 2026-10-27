import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api } from '@/services/api'
import { usePortalStore } from '@/stores/portal'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const ready = ref(false)
  let restoreRequest

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTechnician = computed(() => user.value?.role === 'teknisi')
  const isCustomer = computed(() => user.value?.role === 'pelanggan')
  const hasSubscription = computed(() => !!user.value?.customerId)

  async function restoreSession() {
    if (ready.value) return user.value
    if (!restoreRequest) {
      restoreRequest = api.session()
        .then(result => { user.value = result.user })
        .catch(error => {
          if (error.status !== 401) throw error
          user.value = null
        })
        .finally(() => {
          ready.value = true
          restoreRequest = null
        })
    }
    await restoreRequest
    return user.value
  }

  async function loginAdmin(credentials) {
    const result = await api.login({ identifier: credentials.email, password: credentials.password })
    if (!['admin', 'teknisi'].includes(result.user.role)) {
      await api.logout()
      throw new Error('Akun ini tidak memiliki akses staf.')
    }
    user.value = result.user
    ready.value = true
    return user.value
  }

  async function loginCustomer(credentials) {
    const result = await api.login({ identifier: credentials.identifier, password: credentials.password })
    if (result.user.role !== 'pelanggan') {
      await api.logout()
      throw new Error('Gunakan halaman masuk admin untuk akun staf.')
    }
    user.value = result.user
    ready.value = true
    return user.value
  }

  async function registerCustomer(data) {
    return api.register(data)
  }

  async function changePassword(passwords) {
    return api.changePassword(passwords)
  }

  async function logout() {
    const portal = usePortalStore()
    user.value = null
    ready.value = true
    portal.clear()
    await api.logout()
  }

  return {
    user,
    ready,
    isLoggedIn,
    isAdmin,
    isTechnician,
    isCustomer,
    hasSubscription,
    restoreSession,
    loginAdmin,
    loginCustomer,
    registerCustomer,
    changePassword,
    logout,
  }
})
