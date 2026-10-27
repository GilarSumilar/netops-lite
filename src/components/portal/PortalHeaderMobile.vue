<template>
  <header class="fixed top-0 inset-x-0 z-50 bg-surface-base/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
    <div class="h-16 px-gutter-mobile flex items-center justify-between gap-space-sm">
      <!-- Logo → beranda -->
      <RouterLink to="/portal/beranda" class="flex items-center gap-space-sm min-w-0">
        <div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[20px]">router</span>
        </div>
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-space-xs">
            <span class="font-headline-sm text-headline-sm text-text-primary tracking-tight truncate">NetOps</span>
            <span class="font-label-md text-label-md text-primary font-bold">Lite</span>
          </div>
          <span class="font-label-sm text-label-sm text-text-muted truncate">{{ pageTitle }}</span>
        </div>
      </RouterLink>
      <div class="flex items-center gap-space-sm shrink-0">
        <div :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full', hasSubscription ? 'bg-status-success-bg' : 'bg-status-warning-bg']">
          <span class="w-1.5 h-1.5 rounded-full" :class="hasSubscription ? 'bg-status-success-text' : 'bg-status-warning-text'"></span>
          <span :class="['font-label-sm text-label-sm font-semibold', hasSubscription ? 'text-status-success-text' : 'text-status-warning-text']">
            {{ hasSubscription ? 'Berlangganan' : 'Belum berlangganan' }}
          </span>
        </div>
        <!-- Notifikasi -->
        <div class="relative" v-click-outside="() => showNotif = false">
          <button @click="showNotif = !showNotif" aria-label="Notifikasi"
            class="relative w-11 h-11 flex items-center justify-center rounded-lg text-text-body hover:text-text-primary transition-colors" type="button">
            <span class="material-symbols-outlined text-[22px]">notifications</span>
            <span v-if="notifs.length" class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-status-danger-text ring-2 ring-surface-base"></span>
          </button>
          <div v-if="showNotif" class="absolute right-0 top-12 w-72 bg-surface-base border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
              <span class="font-label-md text-label-md text-text-primary font-bold">Notifikasi</span>
              <button @click="notifs = []" class="font-label-sm text-label-sm text-primary-container hover:underline">Bersihkan</button>
            </div>
            <div class="flex flex-col divide-y divide-border-subtle max-h-64 overflow-y-auto">
              <div v-for="n in notifs" :key="n.id" class="flex gap-3 px-4 py-3 hover:bg-surface-container-low">
                <span class="material-symbols-outlined text-lg mt-0.5 text-primary-container">{{ n.icon }}</span>
                <div class="flex flex-col min-w-0">
                  <span class="font-label-md text-label-md text-text-primary">{{ n.title }}</span>
                  <span class="font-label-sm text-label-sm text-text-muted mt-0.5">{{ n.time }}</span>
                </div>
              </div>
              <div v-if="!notifs.length" class="px-4 py-5 text-center font-body-sm text-body-sm text-text-muted">Tidak ada notifikasi</div>
            </div>
          </div>
        </div>
        <!-- Avatar → profil -->
        <RouterLink to="/portal/profil"
          class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-label-md font-bold ring-2 ring-primary-fixed">
          {{ initials }}
        </RouterLink>
        <button @click="handleLogout" class="flex h-9 w-9 items-center justify-center rounded-lg text-status-danger-text hover:bg-status-danger-bg" aria-label="Keluar">
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const hasSubscription = computed(() => !!auth.user?.customerId)
const initials = computed(() => auth.user?.initials || 'U')
const showNotif = ref(false)
const notifs = ref([
  { id:1, icon:'receipt_long', title:'Tagihan Oktober belum dibayar', time:'Jatuh tempo 25 Okt 2024' },
  { id:2, icon:'wifi_off',     title:'Gangguan jaringan di area Anda', time:'Kemarin, 14.30' },
])
const pageTitle = computed(() => ({
  'portal-beranda':   'Beranda',
  'portal-tagihan':   'Tagihan Saya',
  'portal-layanan':   'Layanan Saya',
  'portal-pengaduan': 'Pengaduan & Bantuan',
  'portal-profil':    'Profil Saya',
  'portal-simulasi':  'Simulasi Pembayaran',
}[route.name] || 'Portal Pelanggan'))
async function handleLogout() {
  try {
    await auth.logout()
  } catch (error) {
    window.alert(`Sesi lokal ditutup, tetapi sesi server gagal diakhiri: ${error.message}`)
  } finally {
    router.push('/portal/login')
  }
}

const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) { document.removeEventListener('click', el._handler) },
}
</script>
