<template>
  <header class="fixed left-0 right-0 top-0 z-40 flex h-16 items-center gap-2 border-b border-border-subtle bg-surface-base/90 px-3 backdrop-blur-md sm:px-4 md:left-64 md:gap-4 md:px-6">
    <button
      class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-body transition-colors hover:bg-surface-container-low md:hidden"
      type="button"
      aria-label="Buka navigasi"
      @click="$emit('toggle-sidebar')"
    >
      <span class="material-symbols-outlined text-2xl">menu</span>
    </button>
    <!-- Search -->
    <div class="flex min-w-0 flex-1 items-center gap-space-md">
      <div class="relative w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none">search</span>
        <input
          v-model="search"
          @keydown.enter="doSearch"
          class="h-10 w-full rounded-lg border border-border-default bg-surface-base pl-10 pr-3 text-body-sm font-body-sm text-text-primary placeholder:text-text-muted transition-all focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20 sm:pr-space-md"
          placeholder="Cari pelanggan, tagihan, atau tiket..."
          aria-label="Cari pelanggan, tagihan, atau tiket"
          type="text"
        />
      </div>
      <div class="hidden shrink-0 items-center gap-1.5 rounded-full border border-status-success-text/20 bg-status-success-bg px-3 py-1 font-label-sm text-label-sm text-status-success-text xl:flex">
        <span class="w-2 h-2 rounded-full bg-status-success-text animate-pulse"></span>
        <span>Network Stable (99.8%)</span>
      </div>
    </div>

    <!-- Right actions -->
    <div class="flex shrink-0 items-center gap-1 sm:gap-space-sm md:gap-space-md">
      <div class="hidden flex-col text-right lg:flex">
        <span class="font-label-sm text-label-sm text-text-muted">Hari ini</span>
        <span class="font-label-md text-label-md text-text-primary font-bold">{{ today }}</span>
      </div>
      <div class="hidden h-6 w-px bg-border-subtle lg:block"></div>

      <!-- Notifikasi dropdown -->
      <div class="relative" v-click-outside="() => showNotif = false">
        <button @click="showNotif = !showNotif"
          class="relative rounded-lg p-2 text-text-body transition-colors hover:bg-surface-container-low hover:text-text-primary"
          type="button" aria-label="Notifikasi">
          <span class="material-symbols-outlined text-2xl">notifications</span>
          <span v-if="notifs.length" class="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-status-danger-text text-on-error font-label-sm text-[10px] font-bold">{{ notifs.length }}</span>
        </button>
        <div v-if="showNotif" class="absolute right-0 top-12 w-80 bg-surface-base border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <span class="font-label-md text-label-md text-text-primary font-bold">Notifikasi</span>
            <button @click="notifs = []" class="font-label-sm text-label-sm text-primary-container hover:underline">Tandai dibaca</button>
          </div>
          <div class="flex flex-col divide-y divide-border-subtle max-h-72 overflow-y-auto">
            <div v-for="n in notifs" :key="n.id" class="flex gap-3 px-4 py-3 hover:bg-surface-container-low">
              <span class="material-symbols-outlined text-xl mt-0.5" :class="n.iconColor">{{ n.icon }}</span>
              <div class="flex flex-col min-w-0">
                <span class="font-label-md text-label-md text-text-primary">{{ n.title }}</span>
                <span class="font-body-sm text-body-sm text-text-muted">{{ n.desc }}</span>
                <span class="font-label-sm text-label-sm text-text-muted mt-0.5">{{ n.time }}</span>
              </div>
            </div>
            <div v-if="!notifs.length" class="px-4 py-6 text-center font-body-sm text-body-sm text-text-muted">Tidak ada notifikasi baru</div>
          </div>
        </div>
      </div>

      <!-- Catat Pembayaran -->
      <button v-if="auth.isAdmin" @click="$router.push('/admin/tagihan')"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary-container text-on-primary shadow-sm transition-all hover:bg-primary sm:w-auto sm:px-space-md"
        type="button" aria-label="Catat Pembayaran">
        <span class="material-symbols-outlined text-lg">add</span>
        <span class="hidden font-label-lg text-label-lg sm:inline">Catat Pembayaran</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/composables/useUtils.js'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const auth = useAuthStore()
const search = ref('')
const today = formatDate(new Date())
const showNotif = ref(false)
const notifs = ref([
  { id:1, icon:'receipt_long',  iconColor:'text-status-warning-text', title:'Tagihan jatuh tempo',       desc:'12 pelanggan belum bayar',        time:'5 menit lalu' },
  { id:2, icon:'support_agent', iconColor:'text-primary-container',   title:'Tiket baru masuk',          desc:'TKT-102: Koneksi mati Jl. Melati', time:'23 menit lalu' },
  { id:3, icon:'wifi_off',      iconColor:'text-status-danger-text',  title:'Gangguan ODP-07',           desc:'Status offline terdeteksi',        time:'1 jam lalu' },
])

function doSearch() {
  const q = search.value.trim().toLowerCase()
  if (!q) return
  if (q.includes('tagih') || q.includes('bayar')) router.push('/admin/tagihan')
  else if (q.includes('tiket') || q.includes('gangguan') || q.includes('pengaduan')) router.push('/admin/pengaduan')
  else if (q.includes('paket')) router.push('/admin/paket')
  else router.push('/admin/pelanggan')
}

const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) { document.removeEventListener('click', el._handler) },
}
</script>
