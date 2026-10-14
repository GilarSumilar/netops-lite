<template>
  <header class="fixed top-0 inset-x-0 z-50 bg-surface-base/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
    <div class="h-16 px-gutter-mobile flex items-center justify-between gap-space-sm">
      <div class="flex items-center gap-space-sm min-w-0">
        <div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[20px]">router</span>
        </div>
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-space-xs">
            <span class="font-headline-sm text-headline-sm text-text-primary tracking-tight truncate">NetOps</span>
            <span class="font-label-md text-label-md text-primary font-bold">Lite</span>
          </div>
          <span class="font-label-sm text-label-sm text-text-muted truncate">{{ pageTitle }}</span>
        </div>
      </div>
      <div class="flex items-center gap-space-sm shrink-0">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success-bg">
          <span class="w-1.5 h-1.5 rounded-full bg-status-success-text animate-pulse"></span>
          <span class="font-label-sm text-label-sm text-status-success-text font-semibold">Aktif</span>
        </div>
        <button aria-label="Notifikasi" class="relative w-11 h-11 flex items-center justify-center rounded-lg text-text-body hover:text-text-primary transition-colors" type="button">
          <span class="material-symbols-outlined text-[22px]">notifications</span>
          <span class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-status-danger-text ring-2 ring-surface-base"></span>
        </button>
        <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-label-md font-bold ring-2 ring-primary-fixed">
          {{ initials }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const initials = computed(() => auth.user?.initials || 'U')
const pageTitle = computed(() => {
  const map = {
    'portal-beranda':   'Beranda',
    'portal-tagihan':   'Tagihan Saya',
    'portal-layanan':   'Layanan Saya',
    'portal-pengaduan': 'Pengaduan & Bantuan',
    'portal-profil':    'Profil Saya',
    'portal-simulasi':  'Simulasi Pembayaran',
  }
  return map[route.name] || 'Portal Pelanggan'
})
</script>
