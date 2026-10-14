<template>
  <header class="fixed top-0 left-64 right-0 h-16 bg-surface-base/90 backdrop-blur-md border-b border-border-subtle z-40 px-space-lg flex items-center justify-between">
    <!-- Search -->
    <div class="flex items-center gap-space-md flex-1 max-w-xl">
      <div class="relative w-full">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none">search</span>
        <input
          v-model="search"
          class="w-full h-10 pl-10 pr-space-md rounded-lg border border-border-default bg-surface-base font-body-sm text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
          placeholder="Cari pelanggan, tagihan, atau tiket..."
          type="text"
        />
      </div>
      <div class="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-success-bg text-status-success-text font-label-sm text-label-sm whitespace-nowrap shrink-0 border border-status-success-text/20">
        <span class="w-2 h-2 rounded-full bg-status-success-text animate-pulse"></span>
        <span>Network Stable (99.8%)</span>
      </div>
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-space-md">
      <div class="hidden md:flex flex-col text-right">
        <span class="font-label-sm text-label-sm text-text-muted">Hari ini</span>
        <span class="font-label-md text-label-md text-text-primary font-bold">{{ today }}</span>
      </div>
      <div class="h-6 w-px bg-border-subtle hidden md:block"></div>
      <button class="relative p-2 rounded-lg text-text-body hover:bg-surface-container-low hover:text-text-primary transition-colors" type="button" aria-label="Notifikasi">
        <span class="material-symbols-outlined text-2xl">notifications</span>
        <span class="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-status-danger-text text-on-error font-label-sm text-[10px] font-bold">3</span>
      </button>
      <button class="inline-flex items-center gap-1.5 h-10 px-space-md rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-sm" type="button">
        <span class="material-symbols-outlined text-lg">add</span>
        <span>Catat Pembayaran</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { formatDate } from '@/composables/useUtils.js'

const search = ref('')
const today = formatDate(new Date())
</script>
