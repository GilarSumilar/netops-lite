<template>
  <div class="p-6 flex flex-col gap-5">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 class="font-headline-lg text-headline-lg text-text-primary">Tagihan &amp; Pembayaran</h2>
        <p class="font-body-sm text-body-sm text-text-body mt-0.5">Pantau status tagihan dan catat pembayaran pelanggan</p>
      </div>
      <button @click="showCatatModal = true" class="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary-container text-on-primary font-label-lg hover:bg-primary transition-all shadow-sm">
        <span class="material-symbols-outlined text-lg">add</span><span>Catat Pembayaran</span>
      </button>
    </div>
    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-4">
      <div v-for="s in summary" :key="s.label" :class="['rounded-xl p-4 border flex flex-col gap-1', s.bg]">
        <span class="font-label-md text-label-md" :class="s.textMuted">{{ s.label }}</span>
        <span class="font-headline-md text-headline-md font-bold" :class="s.textMain">{{ s.value }}</span>
        <span class="font-label-sm text-label-sm" :class="s.textMuted">{{ s.sub }}</span>
      </div>
    </div>
    <!-- Table -->
    <div class="bg-surface-base rounded-xl border border-border-subtle overflow-x-auto">
      <table class="w-full">
        <thead><tr class="border-b border-border-subtle bg-surface-container-low">
          <th v-for="h in headers" :key="h" class="text-left px-4 py-3 font-label-md text-label-md text-text-muted">{{ h }}</th>
        </tr></thead>
        <tbody class="divide-y divide-border-subtle">
          <tr v-for="t in tagihans" :key="t.id" class="hover:bg-surface-container-low transition-colors">
            <td class="px-4 py-3 font-label-sm text-label-sm text-text-muted">{{ t.id }}</td>
            <td class="px-4 py-3 font-body-md text-body-md text-text-primary">{{ t.nama }}</td>
            <td class="px-4 py-3 font-body-md text-body-md text-text-primary">{{ t.periode }}</td>
            <td class="px-4 py-3 font-label-md text-label-md text-text-primary font-semibold">{{ t.nominal }}</td>
            <td class="px-4 py-3"><span :class="['inline-flex px-2 py-0.5 rounded-full font-label-sm', sCls[t.status]]">{{ t.status }}</span></td>
            <td class="px-4 py-3 flex gap-1">
              <button class="p-1.5 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-primary" title="Kuitansi"><span class="material-symbols-outlined text-[18px]">receipt</span></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Modal Catat Pembayaran -->
    <div v-if="showCatatModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="showCatatModal = false">
      <div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 p-6">
        <div class="flex items-center justify-between">
          <h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">Catat Pembayaran</h3>
          <button @click="showCatatModal = false" class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted transition-colors"><span class="material-symbols-outlined text-xl">close</span></button>
        </div>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">ID / Nama Pelanggan</label><input v-model="catatForm.pelanggan" type="text" placeholder="CUST-001 atau nama..." class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Jumlah Pembayaran</label><input v-model="catatForm.jumlah" type="text" placeholder="Rp 0" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Metode Pembayaran</label><select v-model="catatForm.metode" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container"><option value="">Pilih metode...</option><option>Transfer Bank</option><option>Tunai</option><option>QRIS</option><option>Virtual Account</option></select></div>
        </div>
        <div class="flex gap-3 pt-1">
          <button @click="showCatatModal = false" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low transition-colors">Batal</button>
          <button @click="submitCatat" class="flex-1 h-10 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all shadow-sm">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const showCatatModal = ref(false)
const catatForm = reactive({ pelanggan: '', jumlah: '', metode: '' })
function submitCatat() {
  // ponytail: mock — swap real API
  showCatatModal.value = false
  catatForm.pelanggan = ''; catatForm.jumlah = ''; catatForm.metode = ''
}
const headers = ['ID Tagihan','Pelanggan','Periode','Nominal','Status','Aksi']
const sCls = { lunas:'bg-status-success-bg text-status-success-text', belum:'bg-status-warning-bg text-status-warning-text', terlambat:'bg-status-danger-bg text-status-danger-text' }
const summary = [
  { label:'Total Tagihan Bulan Ini', value:'Rp 192.5 Juta', sub:'1.284 tagihan diterbitkan', bg:'bg-surface-container-low border-border-subtle', textMain:'text-text-primary', textMuted:'text-text-muted' },
  { label:'Sudah Lunas', value:'Rp 149.4 Juta', sub:'997 tagihan (77.6%)', bg:'bg-status-success-bg border-status-success-text/20', textMain:'text-status-success-text', textMuted:'text-status-success-text/70' },
  { label:'Belum Dibayar', value:'Rp 43.1 Juta', sub:'287 tagihan tertunggak', bg:'bg-status-danger-bg border-status-danger-text/20', textMain:'text-status-danger-text', textMuted:'text-status-danger-text/70' },
]
const tagihans = [
  { id:'INV-2024-1001', nama:'Bpk. Agus Setiawan',    periode:'Oktober 2024',   nominal:'Rp 250.000', status:'lunas' },
  { id:'INV-2024-1002', nama:'Ibu Sari Dewi',          periode:'Oktober 2024',   nominal:'Rp 150.000', status:'belum' },
  { id:'INV-2024-1003', nama:'Ahmad Fauzi',            periode:'September 2024', nominal:'Rp 250.000', status:'terlambat' },
  { id:'INV-2024-1004', nama:'Bpk. Hendra Kurniawan', periode:'Oktober 2024',   nominal:'Rp 450.000', status:'lunas' },
  { id:'INV-2024-1005', nama:'Ibu Ratna Sari',         periode:'Agustus 2024',   nominal:'Rp 150.000', status:'terlambat' },
]
</script>
