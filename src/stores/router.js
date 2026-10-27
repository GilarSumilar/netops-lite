import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export const useRouterStore = defineStore('router', () => {
  // ── State ────────────────────────────────────────────────────────
  const status       = ref(null)
  const traffic      = ref(null)
  const sessions     = ref([])
  const settings     = ref({ host: '', port: '8728', username: 'admin', password: '', useSSL: false })

  const loadingStatus   = ref(false)
  const loadingTraffic  = ref(false)
  const loadingSessions = ref(false)
  const loadingKick     = ref(false)
  const loadingSettings = ref(false)

  const errorStatus   = ref('')
  const errorTraffic  = ref('')
  const errorSessions = ref('')
  const errorKick     = ref('')
  const errorSettings = ref('')
  const successSettings = ref('')

  // ── Computed ─────────────────────────────────────────────────────
  const ramPercent = computed(() => {
    if (!status.value) return 0
    const used = status.value.totalMemory - status.value.freeMemory
    return Math.round((used / status.value.totalMemory) * 100)
  })

  const hddPercent = computed(() => {
    if (!status.value) return 0
    const used = status.value.totalHddSpace - status.value.freeHddSpace
    return Math.round((used / status.value.totalHddSpace) * 100)
  })

  // ── Actions ──────────────────────────────────────────────────────
  async function fetchStatus() {
    loadingStatus.value = true
    errorStatus.value   = ''
    try {
      status.value = await api.routerStatus()
    } catch (e) {
      errorStatus.value = e.message || 'Gagal mengambil status router.'
    } finally {
      loadingStatus.value = false
    }
  }

  async function fetchTraffic() {
    loadingTraffic.value = true
    errorTraffic.value   = ''
    try {
      traffic.value = await api.routerTraffic()
    } catch (e) {
      errorTraffic.value = e.message || 'Gagal mengambil data trafik.'
    } finally {
      loadingTraffic.value = false
    }
  }

  async function fetchSessions() {
    loadingSessions.value = true
    errorSessions.value   = ''
    try {
      const data = await api.routerSessions()
      sessions.value = data.sessions || []
    } catch (e) {
      errorSessions.value = e.message || 'Gagal mengambil sesi aktif.'
    } finally {
      loadingSessions.value = false
    }
  }

  async function kickUser(payload) {
    loadingKick.value = true
    errorKick.value   = ''
    try {
      const result = await api.routerKickUser(payload)
      // Optimistically remove from local list
      sessions.value = sessions.value.filter(s =>
        s.id !== payload.sessionId && s.name !== payload.username,
      )
      return result
    } catch (e) {
      errorKick.value = e.message || 'Gagal memutus sesi pelanggan.'
      throw e
    } finally {
      loadingKick.value = false
    }
  }

  async function fetchSettings() {
    loadingSettings.value = true
    errorSettings.value   = ''
    try {
      const data = await api.routerSettings()
      settings.value = { ...settings.value, ...data }
    } catch (e) {
      errorSettings.value = e.message || 'Gagal mengambil pengaturan router.'
    } finally {
      loadingSettings.value = false
    }
  }

  async function saveSettings(payload) {
    loadingSettings.value  = true
    errorSettings.value    = ''
    successSettings.value  = ''
    try {
      const result = await api.routerSaveSettings(payload)
      settings.value = { ...payload, password: payload.password ? '••••••••' : '' }
      successSettings.value = result.message || 'Pengaturan berhasil disimpan.'
      return result
    } catch (e) {
      errorSettings.value = e.message || 'Gagal menyimpan pengaturan router.'
      throw e
    } finally {
      loadingSettings.value = false
    }
  }

  function clearErrors() {
    errorStatus.value = errorTraffic.value = errorSessions.value =
    errorKick.value   = errorSettings.value = successSettings.value = ''
  }

  return {
    // state
    status, traffic, sessions, settings,
    loadingStatus, loadingTraffic, loadingSessions, loadingKick, loadingSettings,
    errorStatus, errorTraffic, errorSessions, errorKick, errorSettings, successSettings,
    // computed
    ramPercent, hddPercent,
    // actions
    fetchStatus, fetchTraffic, fetchSessions, kickUser, fetchSettings, saveSettings, clearErrors,
  }
})
