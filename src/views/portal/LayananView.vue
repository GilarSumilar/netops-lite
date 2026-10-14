<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
    <h2 class="font-headline-lg text-headline-lg text-text-primary">Layanan Saya</h2>
    <!-- Active package card -->
    <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="font-label-md text-label-md text-text-muted">Paket Aktif</p>
          <h3 class="font-headline-md text-headline-md text-text-primary font-bold mt-0.5">Fiber Pro 50 Mbps</h3>
          <p class="font-body-sm text-body-sm text-text-body mt-1">Layanan fiber optik untuk keluarga aktif</p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-status-success-bg text-status-success-text font-label-sm font-semibold shrink-0">Aktif</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div v-for="s in specs" :key="s.label" class="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1">
          <span class="font-label-sm text-label-sm text-text-muted">{{ s.label }}</span>
          <span class="font-label-md text-label-md text-text-primary font-semibold">{{ s.value }}</span>
        </div>
      </div>
      <button @click="showUpgradeModal = true" class="h-10 rounded-lg border border-primary-container text-primary-container font-label-lg flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary transition-all">
        <span class="material-symbols-outlined text-[18px]">upgrade</span> Upgrade Paket
      </button>
    </div>
    <!-- Network info -->
    <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-3">
      <h3 class="font-headline-sm text-headline-sm text-text-primary">Informasi Jaringan</h3>
      <div class="flex flex-col divide-y divide-border-subtle">
        <div v-for="info in networkInfo" :key="info.label" class="flex items-center justify-between py-3">
          <span class="font-body-md text-body-md text-text-body">{{ info.label }}</span>
          <span class="font-label-md text-label-md text-text-primary font-semibold">{{ info.value }}</span>
        </div>
      </div>
    </div>
    <!-- Modal Upgrade Paket -->
    <div v-if="showUpgradeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="showUpgradeModal = false">
      <div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 p-6">
        <div class="flex items-center justify-between">
          <h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">Upgrade Paket Internet</h3>
          <button @click="showUpgradeModal = false" class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted transition-colors"><span class="material-symbols-outlined text-xl">close</span></button>
        </div>
        <p class="font-body-sm text-body-sm text-text-body">Pilih paket yang ingin Anda upgrade. Permintaan akan diteruskan ke admin untuk diproses.</p>
        <div class="flex flex-col gap-2">
          <div v-for="p in upgradePakets" :key="p.name"
            :class="['flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all', selectedPaket === p.name ? 'border-primary-container bg-primary-fixed/30' : 'border-border-default hover:border-border-strong']"
            @click="selectedPaket = p.name">
            <div class="flex items-center gap-3">
              <div :class="['w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0', selectedPaket === p.name ? 'border-primary-container' : 'border-border-default']">
                <div v-if="selectedPaket === p.name" class="w-2 h-2 rounded-full bg-primary-container"></div>
              </div>
              <div>
                <p class="font-label-md text-label-md text-text-primary">{{ p.name }}</p>
                <p class="font-body-sm text-body-sm text-text-muted">{{ p.desc }}</p>
              </div>
            </div>
            <span class="font-label-md text-label-md text-primary-container font-semibold shrink-0">{{ p.price }}</span>
          </div>
        </div>
        <div class="flex gap-3 pt-1">
          <button @click="showUpgradeModal = false" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low transition-colors">Batal</button>
          <button @click="submitUpgrade" :disabled="!selectedPaket" class="flex-1 h-10 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">Ajukan Upgrade</button>
        </div>
        <p v-if="upgradeSubmitted" class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg text-center">Permintaan upgrade dikirim. Admin akan menghubungi Anda.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const showUpgradeModal = ref(false)
const selectedPaket = ref('')
const upgradeSubmitted = ref(false)
const specs = [
  { label:'Kecepatan Download', value:'50 Mbps' },
  { label:'Kecepatan Upload',   value:'25 Mbps' },
  { label:'Latensi',            value:'< 10 ms' },
  { label:'Harga Bulanan',      value:'Rp 250.000' },
  { label:'Tipe Koneksi',       value:'Fiber Optik' },
  { label:'Masa Aktif',         value:'s/d 31 Okt 2024' },
]
const networkInfo = [
  { label:'Alamat IP',      value:'192.168.1.105' },
  { label:'Node Terdekat',  value:'ODP-RT03-RW01' },
  { label:'Status ODP',     value:'Online' },
  { label:'Uptime',         value:'14 hari 6 jam' },
]
const upgradePakets = [
  { name:'Business 100 Mbps', desc:'Koneksi stabil untuk warnet dan UMKM',          price:'Rp 450.000/bln' },
  { name:'Ultra 200 Mbps',    desc:'Performa tertinggi untuk gaming & 4K streaming', price:'Rp 750.000/bln' },
]
function submitUpgrade() {
  // ponytail: mock — swap real API + notify admin
  upgradeSubmitted.value = true
  setTimeout(() => { showUpgradeModal.value = false; upgradeSubmitted.value = false; selectedPaket.value = '' }, 2500)
}
</script>

