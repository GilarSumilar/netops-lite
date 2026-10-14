<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
    <h2 class="font-headline-lg text-headline-lg text-text-primary">Tagihan Saya</h2>
    <!-- Summary -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-status-warning-bg border border-status-warning-text/20 rounded-xl p-4">
        <p class="font-label-sm text-label-sm text-status-warning-text/70">Tagihan Aktif</p>
        <p class="font-headline-md text-headline-md text-status-warning-text font-bold mt-1">Rp 250.000</p>
        <p class="font-label-sm text-label-sm text-status-warning-text/70 mt-0.5">Jatuh tempo 25 Okt 2024</p>
      </div>
      <div class="bg-status-success-bg border border-status-success-text/20 rounded-xl p-4">
        <p class="font-label-sm text-label-sm text-status-success-text/70">Total Dibayar</p>
        <p class="font-headline-md text-headline-md text-status-success-text font-bold mt-1">Rp 3.000.000</p>
        <p class="font-label-sm text-label-sm text-status-success-text/70 mt-0.5">12 bulan terakhir</p>
      </div>
    </div>
    <!-- Tagihan aktif -->
    <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="font-headline-sm text-headline-sm text-text-primary">Tagihan Oktober 2024</h3>
        <span class="px-2.5 py-1 rounded-full bg-status-warning-bg text-status-warning-text font-label-sm text-label-sm font-semibold">Belum Bayar</span>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between font-body-md text-body-md">
          <span class="text-text-body">Fiber Pro 50 Mbps</span><span class="text-text-primary font-semibold">Rp 250.000</span>
        </div>
        <div class="flex justify-between font-body-md text-body-md">
          <span class="text-text-body">Periode</span><span class="text-text-primary">1 – 31 Oktober 2024</span>
        </div>
        <div class="h-px bg-border-subtle my-1"></div>
        <div class="flex justify-between font-label-lg text-label-lg font-bold">
          <span class="text-text-primary">Total</span><span class="text-primary-container">Rp 250.000</span>
        </div>
      </div>
      <RouterLink to="/portal/simulasi-bayar" class="h-11 rounded-lg bg-primary-container text-on-primary font-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm">
        <span class="material-symbols-outlined text-[18px]">payment</span> Bayar Sekarang
      </RouterLink>
    </div>
    <!-- Histori -->
    <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm">
      <h3 class="font-headline-sm text-headline-sm text-text-primary mb-3">Histori Pembayaran</h3>
      <div class="flex flex-col divide-y divide-border-subtle">
        <div v-for="h in histori" :key="h.id" class="flex items-center justify-between py-3">
          <div>
            <p class="font-label-md text-label-md text-text-primary">{{ h.periode }}</p>
            <p class="font-body-sm text-body-sm text-text-muted">{{ h.tanggal }} • {{ h.metode }}</p>
          </div>
          <div class="text-right">
            <p class="font-label-md text-label-md text-text-primary font-semibold">{{ h.nominal }}</p>
            <span class="px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text font-label-sm text-label-sm">Lunas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const histori = [
  { id:1, periode:'September 2024', tanggal:'2 Sep 2024',  metode:'Transfer Bank', nominal:'Rp 250.000' },
  { id:2, periode:'Agustus 2024',   tanggal:'1 Agt 2024',  metode:'QRIS',          nominal:'Rp 250.000' },
  { id:3, periode:'Juli 2024',      tanggal:'3 Jul 2024',  metode:'Transfer Bank', nominal:'Rp 250.000' },
  { id:4, periode:'Juni 2024',      tanggal:'1 Jun 2024',  metode:'Tunai',         nominal:'Rp 250.000' },
]
</script>
