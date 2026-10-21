<template>
  <footer class="bg-surface-base border-t border-border-subtle mt-auto">
    <div class="max-w-7xl mx-auto px-gutter py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Brand -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-on-primary text-[20px]">router</span>
          </div>
          <div>
            <div class="flex items-center gap-1">
              <span class="font-headline-sm text-headline-sm text-text-primary font-bold">NetOps</span>
              <span class="font-label-md text-label-md text-primary font-bold">Lite</span>
            </div>
            <span class="font-label-sm text-label-sm text-text-muted">ISP & RT-RW Management</span>
          </div>
        </div>
        <p class="font-body-sm text-body-sm text-text-muted max-w-xs">Layanan internet fiber optik berkualitas untuk rumah dan bisnis Anda.</p>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success-bg w-fit">
          <span class="w-1.5 h-1.5 rounded-full bg-status-success-text animate-pulse"></span>
          <span class="font-label-sm text-label-sm text-status-success-text font-semibold">Semua Sistem Normal</span>
        </div>
      </div>

      <!-- Links -->
      <div class="flex flex-col gap-3">
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">Navigasi</span>
        <nav class="flex flex-col gap-2">
          <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
            class="font-body-md text-body-md text-text-body hover:text-primary-container transition-colors w-fit">
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>

      <!-- Kontak -->
      <div class="flex flex-col gap-3">
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">Hubungi Kami</span>
        <div class="flex flex-col gap-2">
          <div v-for="c in contacts" :key="c.label" class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-lg text-text-muted shrink-0">{{ c.icon }}</span>
            <span class="font-body-sm text-body-sm text-text-body">{{ c.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-border-subtle">
      <div class="max-w-7xl mx-auto px-gutter py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span class="font-body-sm text-body-sm text-text-muted">© 2024 NetOps Lite. Semua hak dilindungi.</span>
        <span class="font-body-sm text-body-sm text-text-muted">Versi 1.0.0</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const navItems = [
  { to: '/portal/beranda',   label: 'Beranda' },
  { to: '/portal/tagihan',   label: 'Tagihan Saya' },
  { to: '/portal/layanan',   label: 'Layanan Saya' },
  { to: '/portal/pengaduan', label: 'Pengaduan & Bantuan' },
  { to: '/portal/profil',    label: 'Profil Saya' },
]
const contacts = [
  { icon: 'phone',         value: '+62 812-3456-7890' },
  { icon: 'email',         value: 'support@netopslite.id' },
  { icon: 'schedule',      value: 'Senin – Sabtu, 08.00 – 17.00' },
  { icon: 'location_on',   value: 'Jl. Merdeka No. 1, Kota Anda' },
]
</script>
