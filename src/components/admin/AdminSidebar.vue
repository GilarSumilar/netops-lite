<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-[60] flex w-64 flex-col justify-between border-r border-border-subtle bg-surface-base shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-transform duration-200 md:translate-x-0',
    open ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="flex flex-col">
      <!-- Logo -->
      <div class="h-16 px-space-md flex items-center gap-space-sm border-b border-border-subtle">
        <div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[20px]">router</span>
        </div>
        <div class="flex flex-col">
          <span class="font-headline-sm text-headline-sm text-text-primary tracking-tight font-bold">NetOps Lite</span>
          <span class="font-label-sm text-label-sm text-text-muted">ISP &amp; RT-RW Management</span>
        </div>
      </div>

      <!-- Nav label -->
      <div class="px-space-md pt-space-md pb-space-xs">
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">Menu Utama</span>
      </div>

      <!-- Nav items -->
      <nav class="flex flex-col gap-space-xs px-space-sm">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ isActive, navigate }"
        >
          <a
            @click="navigateAndClose(navigate)"
            :class="[
              'flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg font-label-lg text-label-lg transition-colors cursor-pointer',
              isActive
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-text-body hover:bg-surface-container-low hover:text-text-primary'
            ]"
          >
            <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </RouterLink>
      </nav>

      <!-- Divider + secondary nav -->
      <div class="mt-space-md px-space-md pb-space-xs">
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">Sistem</span>
      </div>
      <nav class="flex flex-col gap-space-xs px-space-sm">
        <a class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg font-label-lg text-label-lg text-text-body hover:bg-surface-container-low hover:text-text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-xl">settings</span>
          <span>Pengaturan Akun</span>
        </a>
        <a
          @click="handleLogout"
          class="flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg font-label-lg text-label-lg text-text-body hover:bg-status-danger-bg hover:text-status-danger-text transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-xl text-status-danger-text">logout</span>
          <span>Keluar</span>
        </a>
      </nav>
    </div>

    <!-- User profile footer -->
    <div class="p-space-md border-t border-border-subtle bg-surface-container-lowest flex items-center justify-between">
      <div class="flex items-center gap-space-sm min-w-0">
        <div class="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-label-md text-label-md font-bold shrink-0">
          {{ userInitials }}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="font-label-md text-label-md text-text-primary truncate font-bold">{{ user?.name }}</span>
          <span class="font-label-sm text-label-sm text-text-muted truncate">{{ user?.title }}</span>
        </div>
      </div>
      <span class="material-symbols-outlined text-text-muted hover:text-text-primary cursor-pointer text-lg">more_vert</span>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['close'])

const auth = useAuthStore()
const router = useRouter()
const user = computed(() => auth.user)
const userInitials = computed(() => {
  if (!user.value?.name) return 'A'
  return user.value.name.split(' ').map(w => w[0]).slice(0, 2).join('')
})

function navigateAndClose(navigate) {
  navigate()
  emit('close')
}

const navItems = [
  { to: '/admin/dashboard', icon: 'dashboard',      label: 'Dashboard' },
  { to: '/admin/pelanggan', icon: 'group',           label: 'Pelanggan' },
  { to: '/admin/paket',     icon: 'wifi',            label: 'Paket Internet' },
  { to: '/admin/tagihan',   icon: 'receipt_long',    label: 'Tagihan & Pembayaran' },
  { to: '/admin/pengaduan', icon: 'support_agent',   label: 'Pengaduan & Gangguan' },
]

function handleLogout() {
  auth.logout()
  router.push('/admin/login')
}
</script>
