<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-6 md:px-6">
    <h1 class="font-headline-lg text-text-primary">Tagihan Saya</h1>
    <p v-if="portal.error" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ portal.error }}</p>
    <div v-if="portal.data && !portal.data.customer" class="rounded-xl border border-border-subtle bg-surface-base p-5">
      <p class="font-label-md text-text-primary">Akun belum memiliki langganan</p>
      <p class="mt-1 font-body-sm text-text-muted">Tagihan akan muncul setelah email akun ditautkan ke data pelanggan oleh admin.</p>
    </div>
    <template v-else-if="portal.data">
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border border-status-warning-text/20 bg-status-warning-bg p-4">
          <p class="font-label-sm text-status-warning-text/70">Belum Dibayar</p>
          <p class="mt-1 font-headline-md font-bold text-status-warning-text">{{ currency(unpaidTotal) }}</p>
          <p class="mt-0.5 font-label-sm text-status-warning-text/70">{{ unpaid.length }} tagihan</p>
        </div>
        <div class="rounded-xl border border-status-success-text/20 bg-status-success-bg p-4">
          <p class="font-label-sm text-status-success-text/70">Total Lunas</p>
          <p class="mt-1 font-headline-md font-bold text-status-success-text">{{ currency(paidTotal) }}</p>
          <p class="mt-0.5 font-label-sm text-status-success-text/70">{{ paid.length }} pembayaran</p>
        </div>
      </div>
      <div class="rounded-xl border border-border-subtle bg-surface-base p-5 shadow-sm">
        <h2 class="mb-3 font-headline-sm text-text-primary">Riwayat Tagihan</h2>
        <div v-if="portal.data.tagihan.length" class="divide-y divide-border-subtle">
          <div v-for="invoice in portal.data.tagihan" :key="invoice.id" class="flex items-center justify-between gap-3 py-3">
            <div>
              <p class="font-label-md text-text-primary">{{ invoice.periode }}</p>
              <p class="font-body-sm text-text-muted">{{ invoice.id }} · {{ invoice.tglBayar || 'Belum dibayar' }}</p>
            </div>
            <div class="text-right">
              <p class="font-label-md font-semibold text-text-primary">{{ invoice.nominal }}</p>
              <span :class="['rounded-full px-2 py-0.5 font-label-sm', statusClass[invoice.status] || 'bg-status-neutral-bg text-status-neutral-text']">{{ statusLabel[invoice.status] || invoice.status }}</span>
            </div>
          </div>
        </div>
        <p v-else class="font-body-sm text-text-muted">Belum ada tagihan.</p>
        <p class="mt-4 rounded-lg bg-surface-container-low px-3 py-2 font-body-sm text-text-muted">
          Pembayaran online belum terhubung. Status pembayaran pada halaman ini mengikuti catatan admin.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePortalStore } from '@/stores/portal'

const portal = usePortalStore()
const paid = computed(() => portal.data?.tagihan?.filter(invoice => invoice.status === 'lunas') || [])
const unpaid = computed(() => portal.data?.tagihan?.filter(invoice => invoice.status !== 'lunas') || [])
const total = rows => rows.reduce((sum, row) => sum + (Number(String(row.nominal).replace(/\D/g, '')) || 0), 0)
const paidTotal = computed(() => total(paid.value))
const unpaidTotal = computed(() => total(unpaid.value))
const currency = amount => `Rp ${amount.toLocaleString('id-ID')}`
const statusLabel = { lunas: 'Lunas', belum: 'Belum Bayar', terlambat: 'Terlambat' }
const statusClass = {
  lunas: 'bg-status-success-bg text-status-success-text',
  belum: 'bg-status-warning-bg text-status-warning-text',
  terlambat: 'bg-status-danger-bg text-status-danger-text',
}

onMounted(() => portal.load())
</script>
