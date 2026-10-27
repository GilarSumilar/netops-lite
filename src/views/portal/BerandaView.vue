<template>
  <div class="flex w-full flex-col">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
      <p v-if="portal.error" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">
        Gagal memuat data akun: {{ portal.error }}
      </p>
      <div v-if="portal.loading && !portal.data" class="rounded-xl bg-surface-base p-6 font-body-md text-text-muted">Memuat data akun...</div>
      <template v-else-if="portal.data?.customer">
        <section class="relative overflow-hidden rounded-xl bg-surface-base p-6 shadow-sm md:p-8">
          <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex max-w-2xl flex-col gap-3">
              <span :class="['w-fit rounded-full px-3 py-1 font-label-sm', customerStatusClass]">
                {{ customerStatusLabel }}
              </span>
              <h1 class="font-headline-lg text-text-primary">Halo, {{ portal.data.customer.name }}</h1>
              <p class="font-body-md text-text-body">
                ID Pelanggan: <strong>{{ portal.data.customer.id }}</strong>
                <span class="mx-1">•</span>
                Paket: <strong>{{ portal.data.customer.paket || 'Belum dipilih' }}</strong>
              </p>
              <p class="font-body-sm text-text-muted">{{ portal.data.customer.address }}</p>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row">
              <RouterLink to="/portal/tagihan" class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-label-lg text-on-primary">
                <span class="material-symbols-outlined">receipt_long</span> Lihat Tagihan
              </RouterLink>
              <RouterLink to="/portal/pengaduan" class="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-low px-5 py-2.5 font-label-lg text-text-primary">
                <span class="material-symbols-outlined">support_agent</span> Buat Pengaduan
              </RouterLink>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div v-for="card in cards" :key="card.label" class="flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface-base p-4 shadow-sm">
            <span class="font-label-sm text-text-muted">{{ card.label }}</span>
            <strong class="font-headline-sm text-text-primary">{{ card.value }}</strong>
          </div>
        </section>

        <section class="rounded-xl border border-border-subtle bg-surface-base p-5 shadow-sm">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-headline-sm text-text-primary">Pengaduan Terakhir</h2>
            <RouterLink to="/portal/pengaduan" class="font-label-md text-primary-container hover:underline">Lihat semua</RouterLink>
          </div>
          <div v-if="latestTicket" class="flex flex-col gap-1">
            <p class="font-label-md text-text-primary">{{ latestTicket.judul }}</p>
            <p class="font-body-sm text-text-muted">{{ latestTicket.id }} · {{ latestTicket.waktu }}</p>
            <span class="w-fit rounded-full bg-status-warning-bg px-2.5 py-0.5 font-label-sm text-status-warning-text">{{ ticketStatus[latestTicket.status] || latestTicket.status }}</span>
          </div>
          <p v-else class="font-body-sm text-text-muted">Belum ada pengaduan aktif.</p>
        </section>
      </template>

      <section v-else-if="portal.data" class="rounded-xl border border-border-subtle bg-surface-base p-6 shadow-sm">
        <span class="mb-3 inline-flex rounded-full bg-status-warning-bg px-3 py-1 font-label-sm text-status-warning-text">Belum berlangganan</span>
        <h1 class="font-headline-lg text-text-primary">Akun Anda belum ditautkan ke pelanggan</h1>
        <p class="mt-2 max-w-2xl font-body-md text-text-body">
          Email akun ini belum cocok dengan email pada data pelanggan. Hubungi admin ISP untuk menautkan akun, atau lengkapi data pelanggan Anda terlebih dahulu.
        </p>
        <p class="mt-2 font-body-sm text-text-muted">Email akun: {{ portal.data.user.email }}</p>
        <RouterLink to="/portal/profil" class="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-label-lg text-on-primary">
          <span class="material-symbols-outlined">person</span> Lengkapi Profil
        </RouterLink>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePortalStore } from '@/stores/portal'

const portal = usePortalStore()
const ticketStatus = { baru: 'Baru', proses: 'Dalam Proses', selesai: 'Selesai' }
const customerStatusLabel = computed(() => ({
  aktif: 'Langganan Aktif',
  suspend: 'Layanan Suspend',
  isolir: 'Layanan Isolir',
}[portal.data?.customer?.status] || 'Status tidak diketahui'))
const customerStatusClass = computed(() => ({
  aktif: 'bg-status-success-bg text-status-success-text',
  suspend: 'bg-status-warning-bg text-status-warning-text',
  isolir: 'bg-status-danger-bg text-status-danger-text',
}[portal.data?.customer?.status] || 'bg-status-neutral-bg text-status-neutral-text'))
const cards = computed(() => {
  const customer = portal.data?.customer
  const unpaid = (portal.data?.tagihan || []).filter(invoice => invoice.status !== 'lunas')
  const amount = unpaid.reduce((sum, invoice) => sum + (Number(String(invoice.nominal).replace(/\D/g, '')) || 0), 0)
  return [
    { label: 'Paket Internet', value: portal.data?.paket?.speed || customer?.paket || '-' },
    { label: 'Status Layanan', value: customer?.status || '-' },
    { label: 'Tagihan Belum Lunas', value: `Rp ${amount.toLocaleString('id-ID')}` },
    { label: 'Tiket Aktif', value: (portal.data?.pengaduan || []).filter(ticket => ticket.status !== 'selesai').length },
  ]
})
const latestTicket = computed(() => portal.data?.pengaduan?.find(ticket => ticket.status !== 'selesai'))

onMounted(() => portal.load())
</script>
