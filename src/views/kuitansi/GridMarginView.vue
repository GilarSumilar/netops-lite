<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div class="w-full max-w-[794px] flex flex-col gap-4">
      <div class="bg-white rounded-xl border border-border-subtle p-4 shadow-sm flex items-center justify-between">
        <h1 class="font-headline-sm text-headline-sm text-text-primary font-bold">Grid &amp; Margin — Layout Kuitansi</h1>
        <RouterLink to="/portal/beranda" class="inline-flex items-center gap-1 h-9 px-4 rounded-lg border border-border-default text-text-body font-label-md hover:border-primary-container hover:text-primary-container transition-all">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> Kembali
        </RouterLink>
      </div>
      <div class="bg-white shadow-xl rounded-lg overflow-hidden relative" style="width:794px;min-height:500px;padding:48px">
        <!-- Grid overlay -->
        <div v-if="showGrid" class="absolute inset-0 pointer-events-none" style="background-image:repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(0,74,198,0.08) 24px),repeating-linear-gradient(90deg,transparent,transparent 23px,rgba(0,74,198,0.08) 24px)"></div>
        <!-- Margin guides -->
        <div v-if="showMargin" class="absolute inset-[48px] border-2 border-dashed border-primary/30 pointer-events-none rounded"></div>
        <div class="relative">
          <p class="font-headline-sm text-headline-sm text-text-primary font-bold mb-2">NetOps Lite — Kuitansi Resmi</p>
          <p class="font-body-sm text-body-sm text-text-body">Tampilan ini menunjukkan grid baseline (24px) dan batas margin cetak (48px) untuk layout kuitansi A4.</p>
          <div class="mt-4 flex flex-col gap-1 text-sm text-text-muted">
            <p>• Lebar kertas A4: 794px (96dpi)</p>
            <p>• Tinggi kertas A4: 1123px</p>
            <p>• Margin cetak: 48px (≈ 12.7mm)</p>
            <p>• Grid baseline: 24px</p>
          </div>
        </div>
      </div>
      <!-- Toggle controls -->
      <div class="flex gap-3">
        <button @click="showGrid=!showGrid" :class="['h-9 px-4 rounded-lg border font-label-md transition-all', showGrid ? 'bg-primary-container text-on-primary border-primary-container' : 'border-border-default text-text-body']">
          {{ showGrid ? 'Sembunyikan Grid' : 'Tampilkan Grid' }}
        </button>
        <button @click="showMargin=!showMargin" :class="['h-9 px-4 rounded-lg border font-label-md transition-all', showMargin ? 'bg-primary-container text-on-primary border-primary-container' : 'border-border-default text-text-body']">
          {{ showMargin ? 'Sembunyikan Margin' : 'Tampilkan Margin' }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const showGrid = ref(true), showMargin = ref(true)
</script>
