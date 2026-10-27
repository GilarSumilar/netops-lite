<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-[60] flex w-64 flex-col justify-between border-r border-border-subtle bg-surface-base shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-transform duration-200 md:translate-x-0',
    open ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="flex flex-col">
      <!-- Logo + close button mobile -->
      <div class="h-16 px-space-md flex items-center gap-space-sm border-b border-border-subtle">
        <div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[20px]">router</span>
        </div>
        <div class="flex flex-col flex-1 min-w-0">
          <span class="font-headline-sm text-headline-sm text-text-primary tracking-tight font-bold">NetOps Lite</span>
          <span class="font-label-sm text-label-sm text-text-muted">ISP &amp; RT-RW Management</span>
        </div>
        <button
          class="lg:hidden p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted transition-colors shrink-0"
          @click="sidebarOpen = false"
          aria-label="Tutup menu"
        >
          <span class="material-symbols-outlined text-xl">close</span>
        </button>
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
        <RouterLink v-if="auth.isAdmin" to="/admin/akun" custom v-slot="{ isActive, navigate }">
          <a @click="navigateAndClose(navigate)"
            :class="['flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg font-label-lg text-label-lg transition-colors cursor-pointer',
              isActive ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-text-body hover:bg-surface-container-low hover:text-text-primary']">
            <span class="material-symbols-outlined text-xl">manage_accounts</span>
            <span>Akun &amp; Role</span>
          </a>
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin/pengaturan" custom v-slot="{ isActive, navigate }">
          <a @click="navigateAndClose(navigate)"
            :class="['flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg font-label-lg text-label-lg transition-colors cursor-pointer',
              isActive ? 'bg-primary-container text-on-primary font-bold shadow-sm' : 'text-text-body hover:bg-surface-container-low hover:text-text-primary']">
            <span class="material-symbols-outlined text-xl">settings</span>
            <span>Pengaturan</span>
          </a>
        </RouterLink>
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
    <div class="p-space-md border-t border-border-subtle bg-surface-container-lowest">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-space-sm min-w-0">
          <div class="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-label-md text-label-md font-bold shrink-0">
            {{ userInitials }}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-label-md text-label-md text-text-primary truncate font-bold">{{ user?.name }}</span>
            <span class="font-label-sm text-label-sm text-text-muted truncate">{{ roleLabel[user?.role] }}</span>
          </div>
        </div>
        <div class="relative" v-click-outside="() => showUserMenu = false">
          <button @click="showUserMenu = !showUserMenu"
            class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted hover:text-text-primary transition-colors"
            aria-label="Menu akun">
            <span class="material-symbols-outlined text-lg">more_vert</span>
          </button>
          <div v-if="showUserMenu" class="absolute bottom-10 right-0 w-48 bg-surface-base border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden py-1">
            <RouterLink to="/admin/pengaturan" @click="showUserMenu = false"
              class="flex items-center gap-2.5 px-4 py-2.5 font-label-md text-label-md text-text-body hover:bg-surface-container-low cursor-pointer transition-colors">
              <span class="material-symbols-outlined text-lg text-text-muted">settings</span> Pengaturan Akun
            </RouterLink>
            <div class="h-px bg-border-subtle mx-2 my-1"></div>
            <a @click="handleLogout" class="flex items-center gap-2.5 px-4 py-2.5 font-label-md text-label-md text-status-danger-text hover:bg-status-danger-bg cursor-pointer transition-colors">
              <span class="material-symbols-outlined text-lg">logout</span> Keluar
            </a>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const auth = useAuthStore()
const router = useRouter()
const user = computed(() => auth.user)
const userInitials = computed(() => {
  if (!user.value?.name) return 'A'
  return user.value.name.split(' ').map(w => w[0]).slice(0, 2).join('')
})
const showUserMenu = ref(false)

function navigateAndClose(navigate) { navigate(); emit('close') }

async function handleLogout() {
  try {
    await auth.logout()
  } catch (error) {
    window.alert(`Sesi lokal ditutup, tetapi sesi server gagal diakhiri: ${error.message}`)
  } finally {
    router.push('/admin/login')
  }
}

const roleLabel = { admin: 'Admin', teknisi: 'Teknisi' }
const navItems = computed(() => [
  { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/pelanggan', icon: 'group', label: 'Pelanggan', roles: ['admin', 'teknisi'] },
  { to: '/admin/paket', icon: 'wifi', label: 'Paket Internet', roles: ['admin'] },
  { to: '/admin/tagihan', icon: 'receipt_long', label: 'Tagihan & Pembayaran', roles: ['admin'] },
  { to: '/admin/pengaduan', icon: 'support_agent', label: 'Pengaduan & Gangguan', roles: ['admin', 'teknisi'] },
  { to: '/admin/router', icon: 'router', label: 'Router MikroTik', roles: ['admin', 'teknisi'] },
].filter(item => !item.roles || item.roles.includes(auth.user?.role)))

const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) { document.removeEventListener('click', el._handler) },
}
</script>
