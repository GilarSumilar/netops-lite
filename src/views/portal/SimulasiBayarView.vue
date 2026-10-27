<template>
  <div class="max-w-lg mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
    <p v-if="portal.error" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ portal.error }}</p>
    <div v-if="portal.data && !portal.data.customer" class="rounded-xl border border-border-subtle bg-surface-base p-5">
      <p class="font-label-md text-text-primary">Akun belum berlangganan</p>
      <p class="mt-1 font-body-sm text-text-muted">Simulasi pembayaran tersedia setelah akun ditautkan ke data pelanggan.</p>
    </div>
    <div v-else-if="portal.data && !activeInvoice" class="rounded-xl border border-border-subtle bg-surface-base p-5">
      <p class="font-label-md text-text-primary">Tidak ada tagihan yang perlu dibayar</p>
      <RouterLink to="/portal/tagihan" class="mt-2 inline-block font-label-md text-primary-container hover:underline">Kembali ke tagihan</RouterLink>
    </div>
    <template v-if="portal.data?.customer && activeInvoice">
    <p class="rounded-lg bg-status-warning-bg px-3 py-2 font-body-sm text-status-warning-text">
      Ini hanya simulasi prototype. Jangan transfer uang; status tagihan tidak akan berubah.
    </p>
    <!-- Step indicator -->
    <div class="flex items-center gap-2">
      <template v-for="(s, i) in steps" :key="i">
        <div class="flex items-center gap-2">
          <div :class="['w-7 h-7 rounded-full flex items-center justify-center font-label-sm font-bold transition-all', step > i ? 'bg-status-success-text text-white' : step === i ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-text-muted']"><span v-if="step > i" class="material-symbols-outlined text-[14px]">check</span><span v-else>{{ i + 1 }}</span></div>
          <span :class="['font-label-sm text-label-sm', step === i ? 'text-text-primary font-semibold' : 'text-text-muted']">{{ s }}</span>
        </div>
        <div v-if="i < steps.length - 1" class="flex-1 h-px bg-border-subtle"></div>
      </template>
    </div>

    <!-- Step 0: Ringkasan & Pilih Metode -->
    <template v-if="step === 0">
      <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-3">
        <div class="flex items-center justify-between"><h3 class="font-headline-sm text-headline-sm text-text-primary">Detail Tagihan</h3><span class="px-2.5 py-1 rounded-full bg-status-warning-bg text-status-warning-text font-label-sm font-semibold">Belum Bayar</span></div>
        <div class="flex flex-col gap-2 divide-y divide-border-subtle">
          <div v-for="row in rows" :key="row.label" class="flex justify-between pt-2 first:pt-0"><span class="font-body-md text-body-md text-text-body">{{ row.label }}</span><span :class="['font-label-md text-label-md', row.bold ? 'font-bold text-primary-container' : 'text-text-primary']">{{ row.value }}</span></div>
        </div>
      </div>
      <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-3">
        <h3 class="font-headline-sm text-headline-sm text-text-primary">Pilih Metode Pembayaran</h3>
        <div class="flex flex-col gap-2">
          <div v-for="m in methods" :key="m.id" :class="['flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all', selectedMethod === m.id ? 'border-primary-container bg-primary-fixed/30' : 'border-border-default hover:border-border-strong']" @click="selectedMethod = m.id">
            <div :class="['w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0', selectedMethod === m.id ? 'border-primary-container' : 'border-border-default']">
              <div v-if="selectedMethod === m.id" class="w-2 h-2 rounded-full bg-primary-container"></div>
            </div>
            <span class="material-symbols-outlined text-[20px] text-text-body">{{ m.icon }}</span>
            <div class="flex-1"><p class="font-label-md text-label-md text-text-primary">{{ m.label }}</p><p class="font-body-sm text-body-sm text-text-muted">{{ m.desc }}</p></div>
          </div>
        </div>
      </div>
      <button @click="step = 1" :disabled="!selectedMethod" class="w-full h-12 rounded-xl bg-primary-container text-on-primary font-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"><span class="material-symbols-outlined text-[18px]">arrow_forward</span> Lanjutkan</button>
    </template>

    <!-- Step 1: Instruksi -->
    <template v-if="step === 1">
      <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-4">
        <div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary-container"><span class="material-symbols-outlined text-2xl">{{ activeMethod.icon }}</span></div><div><h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ activeMethod.label }}</h3><p class="font-body-sm text-body-sm text-text-muted">Ikuti instruksi berikut</p></div></div>
        <!-- Transfer Bank -->
        <template v-if="selectedMethod === 'transfer'" >
          <div class="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2"><p class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Rekening Tujuan</p><div class="flex items-center justify-between gap-3"><div><p class="font-headline-sm text-headline-sm text-text-primary font-bold tracking-widest">1234 5678 9012</p><p class="font-body-sm text-body-sm text-text-body">Bank BCA a.n. NetOps Lite</p></div><button @click="copy('1234567890012')" class="h-8 px-3 rounded-lg border border-border-default font-label-sm text-text-body hover:border-primary-container hover:text-primary-container flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">{{ copied ? 'check' : 'content_copy' }}</span>{{ copied ? 'Tersalin' : 'Salin' }}</button></div></div>
          <div class="bg-status-warning-bg/50 rounded-xl p-4"><p class="font-label-sm text-label-sm text-status-warning-text uppercase tracking-wider font-bold">Jumlah Simulasi</p><p class="font-headline-md text-headline-md text-text-primary font-bold mt-1">{{ activeInvoice.nominal }}</p><p class="font-body-sm text-body-sm text-text-body mt-1">Tidak ada instruksi transfer sungguhan di prototype.</p></div>
          <ol class="flex flex-col gap-2 pl-1"><li v-for="(s,i) in transferSteps" :key="i" class="flex items-start gap-3"><span class="w-5 h-5 rounded-full bg-primary-container text-on-primary font-label-sm flex items-center justify-center shrink-0 mt-0.5">{{ i+1 }}</span><span class="font-body-sm text-body-sm text-text-body">{{ s }}</span></li></ol>
        </template>
        <!-- QRIS -->
        <template v-if="selectedMethod === 'qris'" >
          <div class="flex flex-col items-center gap-3 py-2"><div class="w-48 h-48 bg-surface-container-low rounded-xl flex items-center justify-center border border-border-subtle"><span class="material-symbols-outlined text-[96px] text-text-muted">qr_code_2</span></div><p class="font-label-md text-label-md text-text-primary font-semibold">{{ activeInvoice.nominal }}</p><p class="font-body-sm text-text-muted text-center">QR hanya ilustrasi; belum terhubung ke payment gateway.</p></div>
          <div class="bg-surface-container-low rounded-xl p-4 flex items-center justify-between"><span class="font-label-md text-label-md text-text-body">Waktu tersisa</span><span class="font-headline-sm text-headline-sm text-status-warning-text font-bold">{{ qrTimer }}</span></div>
        </template>
        <!-- Tunai -->
        <template v-if="selectedMethod === 'tunai'" >
          <div class="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2"><p class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Kode Simulasi</p><div class="flex items-center justify-between"><p class="font-headline-sm text-headline-sm text-text-primary font-bold tracking-widest">{{ activeInvoice.id }}</p><button @click="copy(activeInvoice.id)" class="h-8 px-3 rounded-lg border border-border-default font-label-sm text-text-body hover:border-primary-container hover:text-primary-container flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">{{ copied ? 'check' : 'content_copy' }}</span>{{ copied ? 'Tersalin' : 'Salin' }}</button></div></div>
          <div class="flex flex-col gap-2 bg-surface-container-low rounded-xl p-4"><p class="font-label-md text-label-md text-text-primary font-semibold">Agen Terdekat:</p><div v-for="a in agents" :key="a.name" class="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0"><div><p class="font-label-md text-label-md text-text-primary">{{ a.name }}</p><p class="font-body-sm text-body-sm text-text-muted">{{ a.address }}</p></div><span class="font-label-sm text-label-sm text-text-muted">{{ a.hours }}</span></div></div>
        </template>
      </div>
      <div class="flex gap-3"><button @click="step = 0" class="flex-1 h-11 rounded-xl border border-border-default text-text-body font-label-lg hover:bg-surface-container-low transition-colors">Kembali</button><button @click="confirmPay" class="flex-1 h-11 rounded-xl bg-primary-container text-on-primary font-label-lg hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]" :class="{'animate-spin': paying}">{{ paying ? 'progress_activity' : 'check_circle' }}</span>{{ paying ? 'Memverifikasi...' : 'Konfirmasi Sudah Bayar' }}</button></div>
    </template>

    <!-- Step 2: Sukses -->
    <template v-if="step === 2">
      <div class="bg-status-warning-bg border border-status-warning-text/20 rounded-xl p-6 flex flex-col items-center gap-3 text-center"><span class="material-symbols-outlined text-status-warning-text text-[56px]">info</span><h3 class="font-headline-md text-headline-md text-text-primary font-bold">Simulasi Selesai</h3><p class="font-body-md text-body-md text-text-body">Ini bukan pembayaran sungguhan. Tagihan tetap {{ activeInvoice.status }} sampai admin mencatat pembayaran.</p></div>
      <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-1.5">
        <div v-for="row in rows" :key="row.label" class="flex justify-between py-1"><span class="font-body-sm text-body-sm text-text-muted">{{ row.label }}</span><span :class="['font-label-sm text-label-sm', row.bold ? 'text-primary-container font-bold' : 'text-text-primary']">{{ row.value }}</span></div>
        <div class="flex justify-between py-1 border-t border-border-subtle mt-1"><span class="font-body-sm text-body-sm text-text-muted">Metode</span><span class="font-label-sm text-label-sm text-text-primary">{{ activeMethod.label }}</span></div>
        <div class="flex justify-between py-1"><span class="font-body-sm text-body-sm text-text-muted">No. Referensi</span><span class="font-label-sm text-label-sm text-text-primary font-mono">{{ txRef }}</span></div>
      </div>
      <div class="flex gap-3"><RouterLink to="/portal/beranda" class="flex-1 h-11 rounded-xl border border-border-default text-text-body font-label-lg flex items-center justify-center hover:bg-surface-container-low transition-colors">Beranda</RouterLink><RouterLink to="/portal/tagihan" class="flex-1 h-11 rounded-xl bg-primary-container text-on-primary font-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm"><span class="material-symbols-outlined text-[18px]">receipt_long</span> Lihat Tagihan</RouterLink></div>
    </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePortalStore } from '@/stores/portal'
const portal = usePortalStore()
const step = ref(0)
const selectedMethod = ref('')
const paying = ref(false)
const copied = ref(false)
const txRef = ref('')
const steps = ['Ringkasan', 'Instruksi', 'Selesai']
const activeInvoice = computed(() => portal.data?.tagihan?.find(invoice => invoice.status !== 'lunas') || null)
const rows = computed(() => [
  { label:'Nama Pelanggan', value:portal.data?.customer?.name || '-', bold:false },
  { label:'Paket', value:portal.data?.customer?.paket || '-', bold:false },
  { label:'Periode', value:activeInvoice.value?.periode || '-', bold:false },
  { label:'Jumlah', value:activeInvoice.value?.nominal || '-', bold:true },
])
const methods = [
  { id:'transfer', label:'Transfer Bank', icon:'account_balance', desc:'BCA, BRI, Mandiri, BNI' },
  { id:'qris',     label:'QRIS',          icon:'qr_code_scanner', desc:'GoPay, OVO, DANA, ShopeePay' },
  { id:'tunai',    label:'Tunai ke Agen', icon:'payments',        desc:'Bayar di agen terdekat' },
]
const activeMethod = computed(() => methods.find(m => m.id === selectedMethod.value) || methods[0])
const transferSteps = [
  'Buka aplikasi mobile banking atau ATM Anda.',
  'Pilih menu Transfer Antar Bank.',
  'Masukkan nomor rekening dan jumlah transfer unik di atas.',
  'Konfirmasi dan simpan bukti transfer.',
  'Klik tombol Konfirmasi Sudah Bayar di bawah.',
]
const agents = [
  { name:'Warung Pak Budi',  address:'Jl. Melati No. 5, RT 02', hours:'07.00-21.00' },
  { name:'Minimart Anggrek', address:'Jl. Kenanga No. 12',      hours:'08.00-22.00' },
]
const qrSeconds = ref(900)
let timer = null
onMounted(() => {
  portal.load()
  timer = setInterval(() => { if (qrSeconds.value > 0) qrSeconds.value-- }, 1000)
})
onUnmounted(() => clearInterval(timer))
const qrTimer = computed(() => { const m = String(Math.floor(qrSeconds.value/60)).padStart(2,'0'); const s = String(qrSeconds.value%60).padStart(2,'0'); return m+':'+s })
function copy(text) { navigator.clipboard?.writeText(text); copied.value=true; setTimeout(()=>{ copied.value=false },2000) }
async function confirmPay() { paying.value=true; await new Promise(r=>setTimeout(r,800)); txRef.value='SIM-'+Math.floor(Math.random()*90000+10000); paying.value=false; step.value=2 }
</script>
