<template>
  <div class="flex flex-col w-full">
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6 w-full flex flex-col gap-6">
      <!-- Update plan-be.md: F7 marked Hero / Welcome -->
      <div class="relative overflow-hidden rounded-xl bg-surface-base shadow-sm p-6 md:p-8">
        <div class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div class="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-surface-container-high/40 blur-2xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex flex-col gap-2 max-w-2xl">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-status-success-bg text-status-success-text font-label-sm text-label-sm"><span class="w-1.5 h-1.5 rounded-full bg-status-success-text animate-ping"></span>Layanan Aktif &amp; Terhubung</span>
              <span class="text-text-muted font-body-sm text-body-sm">•</span>
              <span class="font-body-sm text-body-sm text-text-body">Signal RX: -21.4 dBm (Optimal)</span>
            </div>
            <p class="font-body-md text-body-md text-text-body">ID Pelanggan: <span class="font-label-md text-label-md text-text-primary">CUST-2024-035</span> • Terkoneksi ke node <span class="font-label-md text-label-md text-text-primary">ODP-CP-03</span> (Cempaka Putih RT 04 / RW 02)</p>
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low text-text-body font-label-sm text-label-sm"><span class="material-symbols-outlined text-[16px] text-primary-container">dns</span>IP Dinamis: 180.252.88.42</div>
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low text-text-body font-label-sm text-label-sm"><span class="material-symbols-outlined text-[16px] text-primary-container">router</span>Router ONT: ZTE F609 (Dual-Band)</div>
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low text-text-body font-label-sm text-label-sm"><span class="material-symbols-outlined text-[16px] text-primary-container">speed</span>Paket Standard 20 Mbps Simetris</div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto">
            <RouterLink to="/portal/tagihan" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-sm transition-all active:scale-95 group"><span class="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">credit_card</span><span>Bayar Tagihan Sekarang</span></RouterLink>
            <div class="flex items-center gap-3">
              <RouterLink to="/portal/layanan" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary font-label-lg text-label-lg shadow-sm transition-colors"><span class="material-symbols-outlined text-primary-container text-[20px]">tune</span><span>Layanan Saya</span></RouterLink>
              <RouterLink to="/portal/pengaduan" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary font-label-lg text-label-lg shadow-sm transition-colors"><span class="material-symbols-outlined text-status-warning-text text-[20px]">report_problem</span><span>Buat Pengaduan</span></RouterLink>
            </div>
          </div>
        </div>
      </div>
      <!-- Update plan-be.md: F7 marked Live Ticket Banner -->
      <div class="relative overflow-hidden rounded-xl bg-status-warning-bg/40 p-4 md:p-6 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-status-warning-bg flex items-center justify-center text-status-warning-text shrink-0 shadow-sm mt-0.5"><span class="material-symbols-outlined text-[24px]">engineering</span></div>
            <div class="flex flex-col">
              <div class="flex items-center gap-2 flex-wrap"><span class="font-label-sm text-label-sm px-3 py-0.5 rounded-full bg-status-warning-bg text-status-warning-text font-semibold uppercase tracking-wider">Tiket Sedang Ditangani</span><span class="font-label-md text-label-md text-text-primary">#TKT-1082</span><span class="text-text-muted font-body-sm text-body-sm">•</span><span class="font-label-sm text-label-sm text-text-body">Internet Lambat saat Malam</span></div>
              <p class="font-body-md text-body-md text-text-primary mt-1">Teknisi <strong class="font-semibold">Dani Pratama</strong> sedang dalam perjalanan menuju ODP Cempaka Putih 03 untuk pengecekan redaman kabel FO.</p>
              <div class="flex items-center gap-2 text-text-muted font-body-sm text-body-sm mt-1"><span class="material-symbols-outlined text-[16px] text-status-warning-text">update</span><span>Update terakhir: 15:42 WIB • Estimasi selesai: <strong class="text-text-primary font-medium">± 45 menit lagi</strong></span></div>
            </div>
          </div>
          <RouterLink to="/portal/pengaduan" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-base hover:bg-surface-container text-text-primary font-label-md text-label-md shadow-sm transition-colors shrink-0"><span>Lihat Kronologi Tiket</span><span class="material-symbols-outlined text-[16px]">arrow_forward</span></RouterLink>
        </div>
      </div>
      <!-- Update plan-be.md: F7 marked Status cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div v-for="c in cards" :key="c.label" class="bg-surface-base rounded-xl border border-border-subtle p-4 flex flex-col gap-2 shadow-sm">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', c.iconBg]"><span class="material-symbols-outlined text-[18px]" :class="c.iconColor">{{ c.icon }}</span></div>
          <span class="font-label-sm text-label-sm text-text-muted">{{ c.label }}</span>
          <span class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ c.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const userName = computed(() => auth.user?.name || 'Pelanggan')
const cards = [
  { label:'Kecepatan Paket',   value:'20 Mbps',        icon:'speed',         iconBg:'bg-primary-fixed',      iconColor:'text-primary-container' },
  { label:'Status Koneksi',    value:'Online',          icon:'wifi',          iconBg:'bg-status-success-bg',  iconColor:'text-status-success-text' },
  { label:'Tagihan Bulan Ini', value:'Rp 200.000',     icon:'receipt_long',  iconBg:'bg-status-warning-bg',  iconColor:'text-status-warning-text' },
  { label:'Sisa Kuota',        value:'Tidak Terbatas',  icon:'data_usage',    iconBg:'bg-surface-container',  iconColor:'text-text-body' },
  { label:'Masa Aktif',        value:'s/d 31 Okt',     icon:'calendar_month',iconBg:'bg-surface-container',  iconColor:'text-text-body' },
  { label:'ID Pelanggan',      value:'CUST-035',        icon:'badge',         iconBg:'bg-surface-container',  iconColor:'text-text-body' },
]
</script>
