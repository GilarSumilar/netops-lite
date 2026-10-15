<template>
  <div class="flex w-full min-w-0 max-w-[1440px] flex-col gap-4 p-4 mx-auto sm:gap-6 sm:p-6">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2 text-text-muted font-label-md text-label-md">
        <span>Admin</span><span class="material-symbols-outlined text-sm">chevron_right</span>
        <span class="text-primary-container font-semibold">Pengaturan</span>
      </div>
      <h1 class="font-headline-xl text-headline-xl-mobile text-text-primary tracking-tight sm:text-headline-xl">Pengaturan Sistem</h1>
      <p class="font-body-md text-body-md text-text-muted">Kelola profil admin, keamanan akun, notifikasi, dan konfigurasi sistem.</p>
    </div>
    <div class="flex gap-1 bg-surface-container-low rounded-xl p-1 w-fit flex-wrap">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" type="button"
        :class="['px-4 py-2 rounded-lg font-label-md text-label-md transition-colors',
          activeTab === tab.id ? 'bg-primary-container text-on-primary shadow-sm' : 'text-text-body hover:text-text-primary']">{{ tab.label }}</button>
    </div>
    <!-- Profil -->
    <div v-if="activeTab === 'profil'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-surface-base rounded-xl border border-border-subtle p-6 shadow-sm flex flex-col items-center gap-4">
        <div class="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold ring-4 ring-primary-fixed text-2xl">{{ userInitials }}</div>
        <div class="text-center">
          <p class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ profil.nama }}</p>
          <p class="font-body-sm text-body-sm text-text-muted">{{ profil.jabatan }}</p>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success-bg text-status-success-text font-label-sm font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-status-success-text"></span> Admin Aktif
        </span>
      </div>
      <div class="lg:col-span-2 bg-surface-base rounded-xl border border-border-subtle p-6 shadow-sm flex flex-col gap-5">
        <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">Informasi Profil</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput v-model="profil.nama"    label="Nama Lengkap" />
          <AppInput v-model="profil.jabatan" label="Jabatan" />
          <AppInput v-model="profil.email"   label="Email" type="email" />
          <AppInput v-model="profil.telepon" label="No. Telepon" />
        </div>
        <AppInput v-model="profil.alamat" label="Alamat Kantor" />
        <p v-if="profilSaved" class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg">Profil berhasil disimpan.</p>
        <div class="flex justify-end">
          <AppButton @click="saveProfil"><span class="material-symbols-outlined text-lg">save</span> Simpan Perubahan</AppButton>
        </div>
      </div>
    </div>
    <!-- Keamanan -->
    <div v-if="activeTab === 'keamanan'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-surface-base rounded-xl border border-border-subtle p-6 shadow-sm flex flex-col gap-5">
        <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">Ganti Kata Sandi</h2>
        <div class="flex flex-col gap-4">
          <AppInput v-model="pass.lama"       label="Kata Sandi Lama"            type="password" />
          <AppInput v-model="pass.baru"       label="Kata Sandi Baru"            type="password" />
          <AppInput v-model="pass.konfirmasi" label="Konfirmasi Kata Sandi Baru" type="password" />
        </div>
        <p v-if="pass.baru && pass.konfirmasi && pass.baru !== pass.konfirmasi" class="font-body-sm text-body-sm text-status-danger-text bg-status-danger-bg px-3 py-2 rounded-lg">Konfirmasi kata sandi tidak cocok.</p>
        <p v-if="passSaved" class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg">Kata sandi berhasil diubah.</p>
        <div class="flex justify-end">
        </div>
      </div>
      <div class="bg-surface-base rounded-xl border border-border-subtle p-6 shadow-sm flex flex-col gap-4">
        <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">Sesi Aktif</h2>
        <div class="flex flex-col divide-y divide-border-subtle">
          <div v-for="s in sesi" :key="s.id" class="flex items-center justify-between py-3 gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <span class="material-symbols-outlined text-xl text-text-muted shrink-0">{{ s.icon }}</span>
              <div class="min-w-0">
                <p class="font-label-md text-label-md text-text-primary truncate">{{ s.device }}</p>
                <p class="font-body-sm text-body-sm text-text-muted">{{ s.lokasi }} &middot; {{ s.waktu }}</p>
              </div>
            </div>
            <span v-if="s.current" class="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text font-label-sm font-semibold shrink-0">Saat ini</span>
            <AppButton v-else variant="outline" size="sm" @click="sesi = sesi.filter(x => x.id !== s.id)">Cabut</AppButton>
          </div>
        </div>
      </div>
    </div>
    <!-- Update plan-be.md: F7 marked Notifikasi -->
    <div v-if="activeTab === 'notifikasi'" class="bg-surface-base rounded-xl border border-border-subtle p-6 shadow-sm flex flex-col gap-5">
      <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">Preferensi Notifikasi</h2>
      <div class="flex flex-col divide-y divide-border-subtle">
        <div v-for="n in notifPrefs" :key="n.id" class="flex items-center justify-between py-4 gap-4">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-xl text-primary-container">{{ n.icon }}</span>
            <div>
              <p class="font-label-md text-label-md text-text-primary">{{ n.label }}</p>
              <p class="font-body-sm text-body-sm text-text-muted">{{ n.desc }}</p>
            </div>
          </div>
          <button @click="n.enabled = !n.enabled" type="button"
            :class="['relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors', n.enabled ? 'bg-primary-container' : 'bg-border-default']"
            :aria-checked="n.enabled" role="switch" :aria-label="n.label">
            <span :class="['pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform', n.enabled ? 'translate-x-5' : 'translate-x-0']"></span>
          </button>
        </div>
      </div>
      <p v-if="notifSaved" class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg w-fit">Preferensi disimpan.</p>
      <div class="flex justify-end">
        <AppButton @click="saveNotif"><span class="material-symbols-outlined text-lg">save</span> Simpan Preferensi</AppButton>
      </div>
    </div>
    <!-- Sistem -->
    <div v-if="activeTab === 'sistem'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-surface-base rounded-xl border border-border-subtle p-6 shadow-sm flex flex-col gap-4">
        <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">Informasi Sistem</h2>
        <div class="flex flex-col divide-y divide-border-subtle">
          <div v-for="info in sysInfo" :key="info.label" class="flex items-center justify-between py-3">
            <span class="font-body-md text-body-md text-text-body">{{ info.label }}</span>
            <span class="font-label-md text-label-md text-text-primary font-semibold">{{ info.value }}</span>
          </div>
        </div>
      </div>
      <div class="bg-surface-base rounded-xl border border-border-subtle p-6 shadow-sm flex flex-col gap-5">
        <h2 class="font-headline-sm text-headline-sm text-text-primary font-bold">Konfigurasi ISP</h2>
        <div class="flex flex-col gap-4">
          <AppInput v-model="isp.nama"    label="Nama ISP" />
          <AppInput v-model="isp.telepon" label="Telepon Teknis" />
          <AppInput v-model="isp.email"   label="Email Teknis" type="email" />
          <AppInput v-model="isp.alamat"  label="Alamat Kantor" />
        </div>
        <p v-if="ispSaved" class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg">Konfigurasi disimpan.</p>
        <div class="flex justify-end">
          <AppButton @click="saveIsp"><span class="material-symbols-outlined text-lg">save</span> Simpan</AppButton>
        </div>
      </div>
      <div class="lg:col-span-2 bg-status-danger-bg border border-status-danger-text/20 rounded-xl p-6 flex flex-col gap-4">
        <h2 class="font-headline-sm text-headline-sm text-status-danger-text font-bold">Zona Berbahaya</h2>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p class="font-label-md text-label-md text-text-primary">Reset Data Demo</p>
            <p class="font-body-sm text-body-sm text-text-muted">Kembalikan semua data ke kondisi awal. Tidak dapat dibatalkan.</p>
          </div>
          <AppButton variant="danger" @click="showResetModal = true" class="shrink-0">
            <span class="material-symbols-outlined text-lg">delete_forever</span> Reset Data
          </AppButton>
        </div>
      </div>
    </div>
  </div>
  <AppModal v-model="showResetModal" title="Konfirmasi Reset Data">
    <p class="font-body-md text-body-md text-text-body">Semua data demo akan dikembalikan ke kondisi awal. Tindakan ini <strong>tidak dapat dibatalkan</strong>.</p>
    <div class="flex gap-3">
      <AppButton variant="outline" :full="true" @click="showResetModal = false">Batal</AppButton>
      <AppButton variant="danger"  :full="true" @click="showResetModal = false">Ya, Reset Sekarang</AppButton>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppInput  from '@/components/AppInput.vue'
import AppModal  from '@/components/AppModal.vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const activeTab = ref('profil')
const tabs = [
  { id:'profil',     label:'Profil' },
  { id:'keamanan',   label:'Keamanan' },
  { id:'notifikasi', label:'Notifikasi' },
  { id:'sistem',     label:'Sistem' },
]
const profil = reactive({
  nama:    auth.user?.name  || 'Budi Santoso',
  jabatan: auth.user?.title || 'Super Admin / NOC Lead',
  email:   auth.user?.email || 'budi@netopslite.id',
  telepon: '+62 812-0000-0001',
  alamat:  'Jl. Merdeka No. 1, Kota Anda',
})
const profilSaved = ref(false)
const userInitials = computed(() => profil.nama.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase())
function saveProfil() {
  // ponytail: mock - swap real API + update auth store
  profilSaved.value = true; setTimeout(() => profilSaved.value = false, 2000)
}
const pass = reactive({ lama:'', baru:'', konfirmasi:'' })
const passSaved = ref(false)
function savePass() {
  // ponytail: mock - swap real API
  passSaved.value = true; Object.assign(pass, { lama:'', baru:'', konfirmasi:'' })
  setTimeout(() => passSaved.value = false, 2000)
}
const sesi = ref([
  { id:1, icon:'computer',   device:'Chrome - Windows 11', lokasi:'Jakarta',  waktu:'Aktif sekarang', current:true  },
  { id:2, icon:'smartphone', device:'Chrome - Android',    lokasi:'Bandung',  waktu:'2 jam lalu',     current:false },
  { id:3, icon:'laptop_mac', device:'Safari - macOS',      lokasi:'Surabaya', waktu:'Kemarin',        current:false },
])
const notifPrefs = ref([
  { id:1, icon:'receipt_long',  label:'Tagihan Jatuh Tempo', desc:'Notif saat tagihan pelanggan akan jatuh tempo',         enabled:true  },
  { id:2, icon:'support_agent', label:'Tiket Masuk',         desc:'Notif setiap ada tiket pengaduan baru dari pelanggan',  enabled:true  },
  { id:3, icon:'wifi_off',      label:'Gangguan Jaringan',   desc:'Notif otomatis saat sistem mendeteksi downtime ODP',    enabled:true  },
  { id:4, icon:'person_add',    label:'Pelanggan Baru',      desc:'Notif saat ada pelanggan baru didaftarkan ke sistem',   enabled:false },
  { id:5, icon:'download',      label:'Laporan Mingguan',    desc:'Ringkasan performa jaringan dikirim setiap Senin pagi', enabled:true  },
])
const notifSaved = ref(false)
function saveNotif() { notifSaved.value = true; setTimeout(() => notifSaved.value = false, 2000) }
const sysInfo = [
  { label:'Versi Aplikasi',  value:'NetOps Lite v1.0.0' },
  { label:'Environment',     value:'Production' },
  { label:'Database',        value:'PostgreSQL 15' },
  { label:'Terakhir Backup', value:'Hari ini, 03.00 WIB' },
  { label:'Total Pelanggan', value:'128 akun' },
  { label:'Uptime Server',   value:'99.8% (30 hari)' },
]
const isp = reactive({ nama:'NetOps Lite ISP', telepon:'+62 812-0000-0001', email:'tech@netopslite.id', alamat:'Jl. Merdeka No. 1' })
const ispSaved = ref(false)
function saveIsp() { ispSaved.value = true; setTimeout(() => ispSaved.value = false, 2000) }
const showResetModal = ref(false)
</script>
