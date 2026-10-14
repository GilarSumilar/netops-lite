import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')
  const isCustomer = computed(() => user.value?.role === 'customer')

  function loginAdmin(credentials) {
    // ponytail: mock auth — swap for real API call when backend ready
    user.value = {
      id: 'admin-001',
      name: 'Budi Santoso',
      role: 'admin',
      email: credentials.email,
      title: 'Super Admin / NOC Lead',
      avatar: null,
    }
  }

  function loginCustomer(credentials) {
    user.value = {
      id: 'CUST-2024-035',
      name: 'Bpk. Agus Setiawan',
      role: 'customer',
      email: credentials.identifier,
      paket: 'Fiber Pro 50 Mbps',
      status: 'aktif',
      initials: 'AS',
    }
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, isAdmin, isCustomer, loginAdmin, loginCustomer, logout }
})
