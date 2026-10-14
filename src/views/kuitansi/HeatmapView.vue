<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div class="w-full max-w-[794px] flex flex-col gap-4">
      <div class="bg-white rounded-xl border border-border-subtle p-4 shadow-sm flex items-center justify-between">
        <h1 class="font-headline-sm text-headline-sm text-text-primary font-bold">Heatmap — Zona Perhatian Kuitansi</h1>
        <RouterLink to="/portal/beranda" class="inline-flex items-center gap-1 h-9 px-4 rounded-lg border border-border-default text-text-body font-label-md hover:border-primary-container hover:text-primary-container transition-all">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> Kembali
        </RouterLink>
      </div>
      <div class="bg-white shadow-xl rounded-lg overflow-hidden relative" style="width:794px;min-height:500px;padding:48px">
        <div class="relative flex flex-col gap-4">
          <p class="font-body-sm text-body-sm text-text-muted mb-2">Zona merah = perhatian tinggi pembaca, biru = rendah.</p>
          <div v-for="zone in zones" :key="zone.label"
            :class="['rounded-lg p-4 relative overflow-hidden', zone.bg]">
            <div :class="['absolute inset-0 opacity-20', zone.heat]"></div>
            <div class="relative">
              <p :class="['font-label-md text-label-md font-semibold', zone.textColor]">{{ zone.label }}</p>
              <p :class="['font-body-sm text-body-sm mt-0.5', zone.textColor + '/70']">{{ zone.desc }}</p>
            </div>
            <span :class="['absolute top-2 right-2 px-2 py-0.5 rounded-full font-label-sm text-label-sm', zone.badge]">{{ zone.level }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const zones = [
  { label:'Header (Logo + Judul)',      desc:'Area pertama yang dilihat — identitas ISP',       level:'Tinggi',  bg:'bg-status-danger-bg',  heat:'bg-status-danger-text',  textColor:'text-status-danger-text',  badge:'bg-status-danger-text text-on-error' },
  { label:'Total Pembayaran',           desc:'Angka terbesar — fokus utama pelanggan',           level:'Tinggi',  bg:'bg-status-danger-bg',  heat:'bg-status-danger-text',  textColor:'text-status-danger-text',  badge:'bg-status-danger-text text-on-error' },
  { label:'Status LUNAS / Belum Bayar', desc:'Konfirmasi status — dicari langsung',              level:'Tinggi',  bg:'bg-status-warning-bg', heat:'bg-status-warning-text', textColor:'text-status-warning-text', badge:'bg-status-warning-text text-white' },
  { label:'Detail Item Layanan',        desc:'Dibaca setelah konfirmasi total',                  level:'Sedang',  bg:'bg-surface-container-low', heat:'bg-primary',         textColor:'text-text-primary',        badge:'bg-primary-fixed text-primary' },
  { label:'Footer / Tanda Tangan',      desc:'Legalitas — dibaca terakhir atau diabaikan',       level:'Rendah',  bg:'bg-surface-container-low', heat:'bg-text-muted',      textColor:'text-text-body',           badge:'bg-status-neutral-bg text-status-neutral-text' },
]
</script>
