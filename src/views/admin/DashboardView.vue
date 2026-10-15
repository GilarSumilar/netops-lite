<template>
  <div class="flex flex-col w-full p-4 md:p-6 gap-5 md:gap-6">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col">
        <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span><span class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">NOC Dashboard Overview</span></div>
        <h1 class="font-headline-lg text-headline-lg text-text-primary mt-1 tracking-tight">Ringkasan Operasional</h1>
        <p class="font-body-md text-body-md text-text-body mt-0.5 hidden sm:block">Pantau performa layanan, tagihan pelanggan, dan respon gangguan hari ini.</p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div class="relative flex-1 sm:flex-none">
          <select class="w-full sm:w-auto appearance-none bg-surface-base border border-border-default rounded-lg pl-3 pr-9 py-2 font-label-md text-label-md text-text-primary focus:outline-none focus:border-primary-container shadow-sm cursor-pointer hover:bg-surface-container-low transition-colors">
            <option selected>Bulan Ini (Oktober 2024)</option>
            <option>Bulan Lalu (September 2024)</option>
            <option>Triwulan 3 (Jul - Sep 2024)</option>
            <option>Tahun Berjalan 2024</option>
          </select>
          <span class="material-symbols-outlined text-lg text-text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
        </div>
        <div class="flex gap-2">
          <button type="button" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-base border border-border-default text-text-primary font-label-md hover:bg-surface-container-low shadow-sm transition-colors"><span class="material-symbols-outlined text-lg text-text-muted">download</span><span class="hidden sm:inline">Unduh Laporan</span></button>
          <button type="button" @click="showPaymentModal = true" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary shadow-sm transition-all"><span class="material-symbols-outlined text-lg">add</span><span>Catat Pembayaran</span></button>
        </div>
      </div>
    </div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <div v-for="stat in stats" :key="stat.label" class="bg-surface-base border border-border-subtle rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0"><span class="font-body-sm text-body-sm text-text-muted font-medium line-clamp-1">{{ stat.label }}</span><div class="mt-1.5 flex items-baseline gap-1.5 flex-wrap"><span class="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-text-primary tracking-tight">{{ stat.value }}</span><span v-if="stat.unit" class="font-body-sm text-body-sm text-text-muted">{{ stat.unit }}</span><span v-if="stat.badge" :class="['inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold', stat.badgeCls]">{{ stat.badge }}</span></div></div>
          <div :class="['w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0', stat.iconBg]"><span class="material-symbols-outlined text-xl md:text-2xl" :class="stat.iconColor">{{ stat.icon }}</span></div>
        </div>
        <div class="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between gap-2 font-label-sm text-label-sm"><span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold shrink-0', stat.trendCls]"><span class="material-symbols-outlined text-sm">{{ stat.trendIcon }}</span>{{ stat.trend }}</span><span class="text-text-muted text-right line-clamp-1 text-[11px] md:text-xs">{{ stat.trendDesc }}</span></div>
      </div>
    </div>
    <!-- Chart + Distribusi -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
      <div class="lg:col-span-8 bg-surface-base border border-border-subtle rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"><div><h2 class="font-headline-sm text-headline-sm text-text-primary">Pendapatan Bulanan</h2><p class="font-body-sm text-body-sm text-text-muted">Target vs realisasi tagihan terkumpul</p></div><div class="flex items-center gap-4 font-label-sm text-label-sm"><span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-border-default inline-block"></span>Target</span><span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-primary-container inline-block"></span>Realisasi</span></div></div>
        <div class="h-48 sm:h-56 flex items-end justify-between gap-1 sm:gap-3 px-1 sm:px-4 border-b border-border-subtle">
          <div v-for="bar in chartBars" :key="bar.label" class="relative flex-1 flex items-end justify-center gap-0.5 sm:gap-1 h-44 group">
            <div class="w-full max-w-[14px] sm:max-w-[20px] bg-border-default/60 rounded-t-sm" :style="{height: bar.target}"></div>
            <div class="w-full max-w-[14px] sm:max-w-[20px] bg-primary-container rounded-t-sm" :style="{height: bar.actual}"></div>
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-overlay text-text-primary font-label-sm text-[11px] px-2 py-1 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">{{ bar.tooltip }}</div>
          </div>
        </div>
        <div class="flex justify-between px-1 sm:px-4"><span v-for="bar in chartBars" :key="bar.label" class="flex-1 text-center font-label-sm text-[10px] sm:text-label-sm text-text-muted">{{ bar.label }}</span></div>
      </div>
      <div class="lg:col-span-4 bg-surface-base border border-border-subtle rounded-xl p-4 md:p-6 shadow-sm flex flex-col gap-4">
        <div><h2 class="font-headline-sm text-headline-sm text-text-primary">Distribusi Paket</h2><p class="font-body-sm text-body-sm text-text-muted">Komposisi paket aktif saat ini</p></div>
        <div class="flex flex-col gap-3"><div v-for="pkg in packages" :key="pkg.name" class="flex flex-col gap-1"><div class="flex items-center justify-between font-label-sm text-label-sm"><span class="text-text-primary font-medium truncate mr-2">{{ pkg.name }}</span><span class="text-text-muted shrink-0">{{ pkg.count }} ({{ pkg.pct }}%)</span></div><div class="h-2 w-full rounded-full bg-surface-container-low overflow-hidden"><div class="h-full rounded-full transition-all" :class="pkg.color" :style="{width: pkg.pct+'%'}"></div></div></div></div>
      </div>
    </div>
    <!-- Aktivitas Terkini -->
    <div class="bg-surface-base border border-border-subtle rounded-xl p-4 md:p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4"><h2 class="font-headline-sm text-headline-sm text-text-primary">Aktivitas Terkini</h2><RouterLink to="/admin/tagihan" class="font-label-md text-label-md text-primary-container hover:underline">Lihat Semua</RouterLink></div>
      <div class="flex flex-col divide-y divide-border-subtle">
        <div v-for="act in activities" :key="act.id" class="flex items-start gap-3 py-3"><div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', act.iconBg]"><span class="material-symbols-outlined text-[16px]" :class="act.iconColor">{{ act.icon }}</span></div><div class="flex-1 min-w-0"><p class="font-label-md text-label-md text-text-primary">{{ act.title }}</p><p class="font-body-sm text-body-sm text-text-muted line-clamp-2">{{ act.desc }}</p></div><span class="font-label-sm text-label-sm text-text-muted shrink-0 text-[11px] md:text-xs">{{ act.time }}</span></div>
      </div>
    </div>
    <!-- Modal Catat Pembayaran -->
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="showPaymentModal = false">
      <div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 p-6">
        <div class="flex items-center justify-between"><h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">Catat Pembayaran</h3><button @click="showPaymentModal = false" class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted"><span class="material-symbols-outlined text-xl">close</span></button></div>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">ID / Nama Pelanggan</label><input v-model="payForm.pelanggan" type="text" placeholder="CUST-001 atau nama..." class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Jumlah Pembayaran</label><input v-model="payForm.jumlah" type="text" placeholder="Rp 0" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Metode Pembayaran</label><select v-model="payForm.metode" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container transition-all"><option value="">Pilih metode...</option><option>Transfer Bank</option><option>Tunai</option><option>QRIS</option><option>Virtual Account</option></select></div>
        </div>
        <div class="flex gap-3"><button @click="showPaymentModal = false" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low transition-colors">Batal</button><button @click="submitPayment" class="flex-1 h-10 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all shadow-sm">Simpan</button></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const showPaymentModal = ref(false)
const payForm = reactive({ pelanggan:'', jumlah:'', metode:'' })
function submitPayment() { showPaymentModal.value=false; payForm.pelanggan=''; payForm.jumlah=''; payForm.metode='' }
const stats = [
  { label:'Total Pelanggan', value:'128', unit:'Subscribers', icon:'group', iconBg:'bg-primary-fixed/40', iconColor:'text-primary-container', trend:'+6.2%', trendIcon:'trending_up', trendCls:'bg-status-success-bg text-status-success-text', trendDesc:'+8 pelanggan baru bln ini' },
  { label:'Pelanggan Aktif', value:'122', badge:'95.3%', badgeCls:'bg-status-success-bg text-status-success-text', icon:'wifi', iconBg:'bg-status-success-bg/70', iconColor:'text-status-success-text', trend:'+1.1%', trendIcon:'trending_up', trendCls:'bg-status-success-bg text-status-success-text', trendDesc:'Dari 120 bulan lalu' },
  { label:'Tagihan Lunas', value:'Rp 28,6 jt', icon:'payments', iconBg:'bg-tertiary/20', iconColor:'text-tertiary', trend:'92%', trendIcon:'percent', trendCls:'bg-primary-fixed text-primary-container', trendDesc:'Dari target Rp 31,1 jt' },
  { label:'Tiket Aktif', value:'7', unit:'Tiket', icon:'support_agent', iconBg:'bg-status-warning-bg', iconColor:'text-status-warning-text', trend:'-3', trendIcon:'trending_down', trendCls:'bg-status-success-bg text-status-success-text', trendDesc:'Dari 10 minggu lalu' },
]
const chartBars = [
  { label:'Mei', target:'75%', actual:'70%', tooltip:'Rp 22.000.000' },
  { label:'Jun', target:'80%', actual:'77%', tooltip:'Rp 24.000.000' },
  { label:'Jul', target:'84%', actual:'81%', tooltip:'Rp 25.500.000' },
  { label:'Agu', target:'88%', actual:'85%', tooltip:'Rp 26.800.000' },
  { label:'Sep', target:'90%', actual:'87%', tooltip:'Rp 27.200.000' },
  { label:'Okt', target:'96%', actual:'92%', tooltip:'Rp 28.650.000 (berjalan)' },
]
const packages = [
  { name:'Fiber Pro 50 Mbps',  count:54, pct:42, color:'bg-primary-container' },
  { name:'Standard 20 Mbps',   count:41, pct:32, color:'bg-tertiary' },
  { name:'Business 100 Mbps',  count:19, pct:15, color:'bg-status-success-text' },
  { name:'Home Basic 10 Mbps', count:14, pct:11, color:'bg-border-default' },
]
const activities = [
  { id:1, title:'Pembayaran Diterima',      desc:'Bpk. Agus Setiawan - Rp 250.000 via Transfer Bank',   time:'5 mnt lalu',  icon:'check_circle',  iconBg:'bg-status-success-bg', iconColor:'text-status-success-text' },
  { id:2, title:'Tiket Pengaduan Baru',     desc:'Ibu Sari Dewi - Koneksi lambat di Griya Asri Blok C', time:'23 mnt lalu', icon:'support_agent', iconBg:'bg-status-warning-bg', iconColor:'text-status-warning-text' },
  { id:3, title:'Pelanggan Baru Terdaftar', desc:'Ahmad Fauzi - Paket Fiber Pro 50 Mbps',               time:'1 jam lalu',  icon:'person_add',    iconBg:'bg-primary-fixed',     iconColor:'text-primary-container' },
  { id:4, title:'Gangguan Teratasi',        desc:'Node RT-07/RW-03 kembali online',                     time:'2 jam lalu',  icon:'router',        iconBg:'bg-status-success-bg', iconColor:'text-status-success-text' },
]
</script>
