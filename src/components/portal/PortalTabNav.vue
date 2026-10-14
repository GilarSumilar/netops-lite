<template>
  <nav class="fixed bottom-0 inset-x-0 z-50 bg-surface-base/95 backdrop-blur-xl border-t border-border-subtle pb-safe">
    <div class="flex items-center justify-around h-16 px-2">
      <RouterLink
        v-for="item in tabItems"
        :key="item.to"
        :to="item.to"
        custom
        v-slot="{ isActive, navigate }"
      >
        <button
          @click="navigate"
          :class="[
            'flex flex-col items-center justify-center min-w-[56px] h-12 gap-0.5 transition-colors',
            isActive ? 'text-primary-container font-semibold' : 'text-status-neutral-text hover:text-text-primary'
          ]"
        >
          <span class="material-symbols-outlined text-[24px]">{{ item.icon }}</span>
          <span class="font-label-sm text-label-sm">{{ item.label }}</span>
        </button>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
const tabItems = [
  { to: '/portal/beranda',   icon: 'home',          label: 'Beranda' },
  { to: '/portal/tagihan',   icon: 'receipt_long',  label: 'Tagihan' },
  { to: '/portal/layanan',   icon: 'wifi',          label: 'Layanan' },
  { to: '/portal/pengaduan', icon: 'support_agent', label: 'Bantuan' },
  { to: '/portal/profil',    icon: 'person',        label: 'Profil' },
]
</script>
