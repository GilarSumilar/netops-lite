<template>
  <div class="flex flex-col w-full p-6 gap-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">NOC Dashboard Overview</span>
        </div>
        <h1 class="font-headline-lg text-headline-lg text-text-primary mt-1 tracking-tight">Ringkasan Operasional</h1>
        <p class="font-body-md text-body-md text-text-body mt-0.5">Pantau performa layanan, tagihan pelanggan, dan respon gangguan hari ini.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <select class="appearance-none bg-surface-base border border-border-default rounded-lg pl-3 pr-9 py-2 font-label-md text-label-md text-text-primary focus:outline-none focus:border-primary-container shadow-sm cursor-pointer hover:bg-surface-container-low transition-colors">
            <option selected>Bulan Ini (Oktober 2024)</option>
            <option>Bulan Lalu (September 2024)</option>
            <option>Triwulan 3 (Jul - Sep 2024)</option>
            <option>Tahun Berjalan 2024</option>
          </select>
          <span class="material-symbols-outlined text-lg text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
        </div>
        <button type="button" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-base border border-border-default text-text-primary font-label-md text-label-md hover:bg-surface-container-low shadow-sm transition-colors"><span class="material-symbols-outlined text-lg text-text-muted">download</span><span>Unduh Laporan</span></button>
        <button type="button" @click="showPaymentModal = true" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary shadow-sm transition-all"><span class="material-symbols-outlined text-lg">add</span><span>Catat Pembayaran</span></button>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between"><div><span class="font-body-sm text-body-sm text-text-muted font-medium">Total Pelanggan</span><div class="mt-2 flex items-baseline gap-2"><span class="font-currency-stat text-currency-stat text-text-primary tracking-tight">128</span><span class="font-body-sm text-body-sm text-text-muted">Subscribers</span></div></div><div class="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary-container"><span class="material-symbols-outlined text-2xl">group</span></div></div><div class="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between font-label-sm text-label-sm"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text font-bold"><span class="material-symbols-outlined text-sm">trending_up</span>+6.2%</span><span class="text-text-muted">+8 pelanggan baru bln ini</span></div></div>
      <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between"><div><span class="font-body-sm text-body-sm text-text-muted font-medium">Pelanggan Aktif</span><div class="mt-2 flex items-baseline gap-2"><span class="font-currency-stat text-currency-stat text-text-primary tracking-tight">122</span><span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-status-success-bg text-status-success-text">95.3%</span></div></div><div class="w-10 h-10 rounded-xl bg-status-success-bg/70 flex items-center justify-center text-status-success-text"><span class="material-symbols-outlined text-2xl">wifi_tethering</span></div></div><div class="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between font-label-sm text-label-sm"><span class="text-text-muted">Status Isolir / Nonaktif:</span><span class="font-label-md text-label-md text-status-danger-text bg-status-danger-bg px-2 py-0.5 rounded-full">6 Pelanggan</span></div></div>
      <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between"><div><span class="font-body-sm text-body-sm text-text-muted font-medium">Tagihan Belum Dibayar</span><div class="mt-2"><span class="font-currency-stat text-currency-stat text-text-primary tracking-tight">Rp 3.450.000</span></div></div><div class="w-10 h-10 rounded-xl bg-status-warning-bg/70 flex items-center justify-center text-status-warning-text"><span class="material-symbols-outlined text-2xl">pending_actions</span></div></div><div class="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between font-label-sm text-label-sm"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning-text font-bold"><span class="w-1.5 h-1.5 rounded-full bg-status-warning-text"></span>14 Pelanggan</span><span class="text-text-muted">Menunggu konfirmasi</span></div></div>
      <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"><div class="flex items-start justify-between"><div><span class="font-body-sm text-body-sm text-text-muted font-medium">Pendapatan Bulan Ini</span><div class="mt-2"><span class="font-currency-stat text-currency-stat text-text-primary tracking-tight">Rp 28.650.000</span></div></div><div class="w-10 h-10 rounded-xl bg-tertiary-fixed/60 flex items-center justify-center text-tertiary"><span class="material-symbols-outlined text-2xl">account_balance_wallet</span></div></div><div class="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between font-label-sm text-label-sm"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text font-bold"><span class="material-symbols-outlined text-sm">north_east</span>+12.4%</span><span class="text-text-muted">92% dari target Rp 31Jt</span></div></div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div class="lg:col-span-8 bg-surface-base border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h2 class="font-headline-sm text-headline-sm text-text-primary">Tren Pendapatan &amp; Pembayaran</h2><p class="font-body-sm text-body-sm text-text-muted">Realisasi penagihan periode Mei - Oktober 2024</p></div><div class="flex items-center gap-4 font-label-sm text-label-sm"><div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-primary-container"></span><span class="text-text-body">Realisasi Terbayar</span></div><div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-border-default"></span><span class="text-text-muted">Target Penagihan</span></div></div></div>
        <div class="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-4 border-b border-border-subtle">
          <div v-for="bar in chartBars" :key="bar.label" class="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
            <div class="relative w-full flex items-end justify-center gap-1 h-44"><div class="w-3 sm:w-5 bg-border-default/70 rounded-t transition-all group-hover:bg-border-default" :style="{height: bar.target}"></div><div class="w-3.5 sm:w-6 bg-primary-container/85 rounded-t transition-all group-hover:bg-primary" :style="{height: bar.actual}"></div><div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-inverse-surface text-inverse-on-surface text-[11px] font-label-sm py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-md z-10">{{ bar.tooltip }}</div></div>
            <span class="font-label-sm text-label-sm text-text-muted group-hover:text-text-primary">{{ bar.label }}</span>
          </div>
        </div>
      </div>
      <div class="lg:col-span-4 bg-surface-base border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col gap-4"><div><h2 class="font-headline-sm text-headline-sm text-text-primary">Distribusi Paket</h2><p class="font-body-sm text-body-sm text-text-muted">Komposisi paket aktif saat ini</p></div><div class="flex flex-col gap-3"><div v-for="pkg in packages" :key="pkg.name" class="flex flex-col gap-1"><div class="flex items-center justify-between font-label-sm text-label-sm"><span class="text-text-primary font-medium">{{ pkg.name }}</span><span class="text-text-muted">{{ pkg.count }} pel. ({{ pkg.pct }}%)</span></div><div class="h-2 w-full rounded-full bg-surface-container-low overflow-hidden"><div class="h-full rounded-full" :class="pkg.color" :style="{width: pkg.pct+'%'}"></div></div></div></div></div>
    </div>
    <div class="bg-surface-base border border-border-subtle rounded-xl p-6 shadow-sm"><div class="flex items-center justify-between mb-4"><h2 class="font-headline-sm text-headline-sm text-text-primary">Aktivitas Terkini</h2><RouterLink to="/admin/tagihan" class="font-label-md text-label-md text-primary-container hover:underline">Lihat Semua</RouterLink></div><div class="flex flex-col divide-y divide-border-subtle"><div v-for="act in activities" :key="act.id" class="flex items-start gap-3 py-3"><div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0', act.iconBg]"><span class="material-symbols-outlined text-[16px]" :class="act.iconColor">{{ act.icon }}</span></div><div class="flex-1 min-w-0"><p class="font-label-md text-label-md text-text-primary">{{ act.title }}</p><p class="font-body-sm text-body-sm text-text-muted">{{ act.desc }}</p></div><span class="font-label-sm text-label-sm text-text-muted shrink-0">{{ act.time }}</span></div></div></div>
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="showPaymentModal = false"><div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 p-6"><div class="flex items-center justify-between"><h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">Catat Pembayaran</h3><button @click="showPaymentModal = false" class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted transition-colors"><span class="material-symbols-outlined text-xl">close</span></button></div><div class="flex flex-col gap-3"><div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">ID / Nama Pelanggan</label><input v-model="payForm.pelanggan" type="text" placeholder="CUST-001 atau nama..." class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" /></div><div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Jumlah Pembayaran</label><input v-model="payForm.jumlah" type="text" placeholder="Rp 0" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" /></div><div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Metode Pembayaran</label><select v-model="payForm.metode" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container transition-all"><option value="">Pilih metode...</option><option>Transfer Bank</option><option>Tunai</option><option>QRIS</option><option>Virtual Account</option></select></div></div><div class="flex gap-3 pt-1"><button @click="showPaymentModal = false" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low transition-colors">Batal</button><button @click="submitPayment" class="flex-1 h-10 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all shadow-sm">Simpan</button></div></div></div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const showPaymentModal = ref(false)
const payForm = reactive({ pelanggan: '', jumlah: '', metode: '' })
function submitPayment() { showPaymentModal.value = false; payForm.pelanggan = ''; payForm.jumlah = ''; payForm.metode = '' }
const chartBars = [
  { label:'Mei', target:'75%', actual:'70%', tooltip:'Rp 22.000.000' },
  { label:'Jun', target:'80%', actual:'77%', tooltip:'Rp 24.000.000' },
  { label:'Jul', target:'84%', actual:'81%', tooltip:'Rp 25.500.000' },
  { label:'Agu', target:'88%', actual:'85%', tooltip:'Rp 26.800.000' },
  { label:'Sep', target:'90%', actual:'87%', tooltip:'Rp 27.200.000' },
  { label:'Okt', target:'96%', actual:'92%', tooltip:'Rp 28.650.000 (berjalan)' },
]
const packages = [
  { name:'Fiber Pro 50 Mbps', count:54, pct:42, color:'bg-primary-container' },
  { name:'Standard 20 Mbps', count:41, pct:32, color:'bg-tertiary' },
  { name:'Business 100 Mbps', count:19, pct:15, color:'bg-status-success-text' },
  { name:'Home Basic 10 Mbps', count:14, pct:11, color:'bg-border-default' },
]
const activities = [
  { id:1, title:'Pembayaran Diterima', desc:'Bpk. Agus Setiawan - Rp 250.000 via Transfer Bank', time:'5 mnt lalu', icon:'check_circle', iconBg:'bg-status-success-bg', iconColor:'text-status-success-text' },
  { id:2, title:'Tiket Pengaduan Baru', desc:'Ibu Sari Dewi - Koneksi lambat di Griya Asri Blok C', time:'23 mnt lalu', icon:'support_agent', iconBg:'bg-status-warning-bg', iconColor:'text-status-warning-text' },
  { id:3, title:'Pelanggan Baru Terdaftar', desc:'Ahmad Fauzi - Paket Fiber Pro 50 Mbps', time:'1 jam lalu', icon:'person_add', iconBg:'bg-primary-fixed', iconColor:'text-primary-container' },
  { id:4, title:'Gangguan Teratasi', desc:'Node RT-07/RW-03 kembali online', time:'2 jam lalu', icon:'router', iconBg:'bg-status-success-bg', iconColor:'text-status-success-text' },
]
</script>
