<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div class="w-full max-w-4xl flex flex-col gap-4">
      <div class="bg-white rounded-xl border border-border-subtle p-4 shadow-sm flex items-center justify-between">
        <h1 class="font-headline-sm text-headline-sm text-text-primary font-bold">Overlay Diff — Versi Kuitansi</h1>
        <RouterLink to="/portal/beranda" class="inline-flex items-center gap-1 h-9 px-4 rounded-lg border border-border-default text-text-body font-label-md hover:border-primary-container hover:text-primary-container transition-all">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> Kembali
        </RouterLink>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6">
        <p class="font-body-md text-body-md text-text-body mb-4">Perbandingan visual perubahan antar versi kuitansi. Hijau = tambahan, merah = hapusan.</p>
        <div class="font-mono text-sm flex flex-col gap-1">
          <div v-for="line in diffLines" :key="line.id"
            :class="['px-3 py-1 rounded', line.type === 'add' ? 'bg-status-success-bg text-status-success-text' : line.type === 'remove' ? 'bg-status-danger-bg text-status-danger-text' : 'bg-surface-container-low text-text-body']">
            {{ line.prefix }} {{ line.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const diffLines = [
  { id:1,  type:'same',   prefix:' ', text:'Nama: Bpk. Agus Setiawan' },
  { id:2,  type:'remove', prefix:'-', text:'Harga: Rp 200.000' },
  { id:3,  type:'add',    prefix:'+', text:'Harga: Rp 250.000' },
  { id:4,  type:'same',   prefix:' ', text:'Paket: Fiber Pro 50 Mbps' },
  { id:5,  type:'remove', prefix:'-', text:'Periode: September 2024' },
  { id:6,  type:'add',    prefix:'+', text:'Periode: Oktober 2024' },
  { id:7,  type:'same',   prefix:' ', text:'Status: LUNAS' },
]
</script>
