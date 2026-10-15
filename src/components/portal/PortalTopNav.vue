<template>
  <header class="fixed top-0 inset-x-0 z-50 bg-surface-base/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
    <div class="max-w-7xl mx-auto px-gutter h-16 flex items-center justify-between gap-space-md">
      <!-- Logo -->
      <div class="flex items-center gap-space-sm">
        <div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[20px]">router</span>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <span class="font-headline-sm text-headline-sm text-text-primary tracking-tight font-bold">NetOps</span>
            <span class="font-label-md text-label-md text-primary font-bold">Lite</span>
          </div>
          <span class="font-label-sm text-label-sm text-text-muted">Portal Pelanggan</span>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="hidden md:flex items-center gap-1 bg-surface-container-low rounded-xl p-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ isActive, navigate }"
        >
          <a
            @click="navigate"
            :class="[
              'px-space-md py-space-xs transition-colors font-label-lg rounded-lg cursor-pointer',
              isActive
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            ]"
          >{{ item.label }}</a>
        </RouterLink>
      </nav>

      <!-- Right -->
      <div class="flex items-center gap-space-sm">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success-bg">
          <span class="w-1.5 h-1.5 rounded-full bg-status-success-text animate-pulse"></span>
          <span class="font-label-sm text-label-sm text-status-success-text font-semibold">Aktif</span>
        </div>
        <button aria-label="Notifikasi" class="relative w-10 h-10 flex items-center justify-center rounded-lg text-text-body hover:text-text-primary transition-colors" type="button">
          <span class="material-symbols-outlined text-[22px]">notifications</span>
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-danger-text ring-2 ring-surface-base"></span>
        </button>
        <!-- User dropdown trigger -->
        <div class="flex items-center gap-2 cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-label-md font-bold ring-2 ring-primary-fixed">
            {{ initials }}
          </div>
          <span class="hidden lg:block font-label-md text-label-md text-text-primary">{{ user?.name }}</span>
        </div>
        <button @click="handleLogout" type="button" class="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-3.5 py-2 font-label-md text-label-md font-medium text-[#DC2626] transition-colors hover:bg-[#FEE2E2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]/30">
          <span class="material-symbols-outlined text-[18px]">logout</span>
          Keluar
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const user = computed(() => auth.user)
const initials = computed(() => user.value?.initials || 'U')

const navItems = [
  { to: '/portal/beranda',   label: 'Beranda' },
  { to: '/portal/tagihan',   label: 'Tagihan Saya' },
  { to: '/portal/layanan',   label: 'Layanan Saya' },
  { to: '/portal/pengaduan', label: 'Pengaduan' },
  { to: '/portal/profil',    label: 'Profil Saya' },
]

function handleLogout() {
  auth.logout()
  router.push('/portal/login')
}
</script>
