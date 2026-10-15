<template>
  <div class="flex min-w-0 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="font-headline-lg text-headline-lg-mobile text-text-primary sm:text-headline-lg">Tagihan &amp; Pembayaran</h2>
        <p class="font-body-sm text-body-sm text-text-body mt-0.5">Pantau status tagihan dan catat pembayaran pelanggan</p>
      </div>
      <AppButton @click="showCatatModal = true" :full="true" class="sm:w-auto">
        <span class="material-symbols-outlined text-lg">add</span><span>Catat Pembayaran</span>
      </AppButton>
    </div>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
      <div v-for="s in summary" :key="s.label" :class="['rounded-xl p-4 border flex flex-col gap-1', s.bg]">
        <span class="font-label-md text-label-md" :class="s.textMuted">{{ s.label }}</span>
        <span class="font-headline-md text-headline-md font-bold" :class="s.textMain">{{ s.value }}</span>
        <span class="font-label-sm text-label-sm" :class="s.textMuted">{{ s.sub }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div class="relative w-full sm:max-w-xs">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted pointer-events-none">search</span>
        <input v-model="search" type="text" placeholder="Cari ID tagihan atau nama..."
          class="w-full h-10 pl-9 pr-3 rounded-lg border border-border-default bg-surface-base font-body-md text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container" />
      </div>
      <AppSelect v-model="filterStatus" class="w-full sm:w-44">
        <option value="">Semua Status</option>
        <option value="lunas">Lunas</option>
        <option value="belum">Belum Dibayar</option>
        <option value="terlambat">Terlambat</option>
      </AppSelect>
    </div>
    <AppDataTable :columns="columns" :rows="filteredRows" :search="search" :page-size="10">
      <template #cell-id="{ value }">
        <span class="font-label-sm text-label-sm text-text-muted whitespace-nowrap">{{ value }}</span>
      </template>
      <template #cell-nama="{ value }">
        <span class="font-body-md text-body-md text-text-primary whitespace-nowrap">{{ value }}</span>
      </template>
      <template #cell-nominal="{ value }">
        <span class="font-label-md text-label-md text-text-primary font-semibold whitespace-nowrap">{{ value }}</span>
      </template>
      <template #cell-status="{ row }">
        <span :class="['inline-flex px-2.5 py-0.5 rounded-full font-label-sm whitespace-nowrap', sCls[row.status]]">{{ statusLabel[row.status] }}</span>
      </template>
      <template #actions="{ row }">
        <button @click="openDetail(row)" class="p-1.5 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-primary transition-colors" title="Detail">
          <span class="material-symbols-outlined text-[18px]">visibility</span>
        </button>
        <RouterLink :to="'/kuitansi/pratinjau-a4'"
          class="p-1.5 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-primary transition-colors" title="Kuitansi">
          <span class="material-symbols-outlined text-[18px]">receipt</span>
        </RouterLink>
        <button v-if="row.status !== 'lunas'" @click="openTandai(row)"
          class="p-1.5 rounded-lg hover:bg-status-success-bg text-text-muted hover:text-status-success-text transition-colors" title="Tandai Lunas">
          <span class="material-symbols-outlined text-[18px]">check_circle</span>
        </button>
      </template>
    </AppDataTable>
    <!-- Modal Catat Pembayaran -->
    <AppModal v-model="showCatatModal" title="Catat Pembayaran">
      <div class="flex flex-col gap-3">
        <AppInput v-model="catatForm.pelanggan" label="ID / Nama Pelanggan" placeholder="CUST-001 atau nama..." />
        <AppInput v-model="catatForm.jumlah"    label="Jumlah Pembayaran"   placeholder="Rp 0" />
        <AppSelect v-model="catatForm.metode"   label="Metode Pembayaran">
          <option value="">Pilih metode...</option>
          <option>Transfer Bank</option>
          <option>Tunai</option>
          <option>QRIS</option>
          <option>Virtual Account</option>
        </AppSelect>
      </div>
      <div class="flex gap-3 pt-1">
        <AppButton variant="outline" :full="true" @click="showCatatModal = false">Batal</AppButton>
        <AppButton :full="true" @click="submitCatat">Simpan</AppButton>
      </div>
    </AppModal>
    <!-- Modal Detail Tagihan -->
    <AppModal v-model="showDetailModal" title="Detail Tagihan" max-width="md">
      <div v-if="detailTarget" class="flex flex-col gap-4">
        <div class="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
          <div>
            <p class="font-label-sm text-label-sm text-text-muted">{{ detailTarget.id }}</p>
            <p class="font-headline-sm text-headline-sm text-text-primary font-bold mt-0.5">{{ detailTarget.nama }}</p>
            <p class="font-body-sm text-body-sm text-text-muted">{{ detailTarget.periode }}</p>
          </div>
          <span :class="['px-3 py-1 rounded-full font-label-sm', sCls[detailTarget.status]]">{{ statusLabel[detailTarget.status] }}</span>
        </div>
        <div class="flex flex-col divide-y divide-border-subtle">
          <div class="flex justify-between py-2.5">
            <span class="font-body-md text-body-md text-text-muted">Nominal</span>
            <span class="font-label-md text-label-md text-text-primary font-semibold">{{ detailTarget.nominal }}</span>
          </div>
          <div class="flex justify-between py-2.5">
            <span class="font-body-md text-body-md text-text-muted">Metode</span>
            <span class="font-label-md text-label-md text-text-primary">{{ detailTarget.metode }}</span>
          </div>
          <div class="flex justify-between py-2.5">
            <span class="font-body-md text-body-md text-text-muted">Tanggal Bayar</span>
            <span class="font-label-md text-label-md text-text-primary">{{ detailTarget.tglBayar || 'Belum dibayar' }}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-3 pt-1">
        <AppButton variant="outline" :full="true" @click="showDetailModal = false">Tutup</AppButton>
        <RouterLink to="/kuitansi/pratinjau-a4" class="flex-1">
          <AppButton variant="secondary" :full="true"><span class="material-symbols-outlined text-lg">receipt</span> Cetak Kuitansi</AppButton>
        </RouterLink>
      </div>
    </AppModal>
    <!-- Modal Tandai Lunas -->
    <AppModal v-model="showTandaiModal" title="Tandai Lunas" max-width="sm">
      <p class="font-body-md text-body-md text-text-body">
        Tagihan <strong>{{ tandaiTarget?.id }}</strong> milik <strong>{{ tandaiTarget?.nama }}</strong> akan ditandai lunas.
      </p>
      <AppSelect v-model="tandaiMetode" label="Metode Pembayaran">
        <option value="">Pilih metode...</option>
        <option>Transfer Bank</option>
        <option>Tunai</option>
        <option>QRIS</option>
        <option>Virtual Account</option>
      </AppSelect>
      <div class="flex gap-3">
        <AppButton variant="outline" :full="true" @click="showTandaiModal = false">Batal</AppButton>
        <AppButton :full="true" @click="confirmTandai"><span class="material-symbols-outlined text-lg">check_circle</span> Konfirmasi Lunas</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import AppButton    from '@/components/AppButton.vue'
import AppInput     from '@/components/AppInput.vue'
import AppSelect    from '@/components/AppSelect.vue'
import AppModal     from '@/components/AppModal.vue'
import AppDataTable from '@/components/AppDataTable.vue'

const search          = ref('')
const filterStatus    = ref('')
const showCatatModal  = ref(false)
const showDetailModal = ref(false)
const showTandaiModal = ref(false)
const detailTarget    = ref(null)
const tandaiTarget    = ref(null)
const tandaiMetode    = ref('')
const catatForm = reactive({ pelanggan:'', jumlah:'', metode:'' })

const columns = [
  { key:'id',      label:'ID Tagihan',  thClass:'w-36' },
  { key:'nama',    label:'Pelanggan' },
  { key:'periode', label:'Periode',     thClass:'w-36' },
  { key:'nominal', label:'Nominal',     thClass:'w-36' },
  { key:'status',  label:'Status',      thClass:'w-32' },
]

const sCls = {
  lunas:     'bg-status-success-bg text-status-success-text',
  belum:     'bg-status-warning-bg text-status-warning-text',
  terlambat: 'bg-status-danger-bg text-status-danger-text',
}
const statusLabel = { lunas:'Lunas', belum:'Belum Bayar', terlambat:'Terlambat' }

const summary = [
  { label:'Total Tagihan Bulan Ini', value:'Rp 192.5 Juta', sub:'1.284 tagihan diterbitkan', bg:'bg-surface-container-low border-border-subtle',          textMain:'text-text-primary',       textMuted:'text-text-muted' },
  { label:'Sudah Lunas',            value:'Rp 149.4 Juta', sub:'997 tagihan (77.6%)',         bg:'bg-status-success-bg border-status-success-text/20',  textMain:'text-status-success-text', textMuted:'text-status-success-text/70' },
  { label:'Belum Dibayar',          value:'Rp 43.1 Juta',  sub:'287 tagihan tertunggak',        bg:'bg-status-danger-bg border-status-danger-text/20',    textMain:'text-status-danger-text',  textMuted:'text-status-danger-text/70' },
]

const tagihans = ref([
  { id:'INV-2024-1001', nama:'Bpk. Agus Setiawan',    periode:'Oktober 2024',   nominal:'Rp 250.000', status:'lunas',     metode:'Transfer Bank',  tglBayar:'2 Okt 2024' },
  { id:'INV-2024-1002', nama:'Ibu Sari Dewi',          periode:'Oktober 2024',   nominal:'Rp 150.000', status:'belum',     metode:'-',              tglBayar:'' },
  { id:'INV-2024-1003', nama:'Ahmad Fauzi',            periode:'September 2024', nominal:'Rp 250.000', status:'terlambat', metode:'-',              tglBayar:'' },
  { id:'INV-2024-1004', nama:'Bpk. Hendra Kurniawan', periode:'Oktober 2024',   nominal:'Rp 450.000', status:'lunas',     metode:'QRIS',           tglBayar:'5 Okt 2024' },
  { id:'INV-2024-1005', nama:'Ibu Ratna Sari',         periode:'Agustus 2024',   nominal:'Rp 150.000', status:'terlambat', metode:'-',              tglBayar:'' },
  { id:'INV-2024-1006', nama:'Bpk. Doni Pratama',     periode:'Oktober 2024',   nominal:'Rp 750.000', status:'lunas',     metode:'Transfer Bank',  tglBayar:'1 Okt 2024' },
  { id:'INV-2024-1007', nama:'Ibu Lestari',            periode:'Oktober 2024',   nominal:'Rp 150.000', status:'belum',     metode:'-',              tglBayar:'' },
  { id:'INV-2024-1008', nama:'Bpk. Wahyu Saputra',    periode:'Oktober 2024',   nominal:'Rp 250.000', status:'terlambat', metode:'-',              tglBayar:'' },
  { id:'INV-2024-1009', nama:'Ibu Mega Wulandari',    periode:'Oktober 2024',   nominal:'Rp 450.000', status:'lunas',     metode:'Virtual Account', tglBayar:'3 Okt 2024' },
  { id:'INV-2024-1010', nama:'Ahmad Rizky',            periode:'September 2024', nominal:'Rp 150.000', status:'terlambat', metode:'-',              tglBayar:'' },
  { id:'INV-2024-1011', nama:'Bpk. Fajar Nugroho',    periode:'Oktober 2024',   nominal:'Rp 250.000', status:'lunas',     metode:'Tunai',          tglBayar:'4 Okt 2024' },
  { id:'INV-2024-1012', nama:'Ibu Yanti Kusuma',      periode:'Oktober 2024',   nominal:'Rp 750.000', status:'belum',     metode:'-',              tglBayar:'' },
])

const filteredRows = computed(() => {
  if (filterStatus.value) return tagihans.value.filter(t => t.status === filterStatus.value)
  return tagihans.value
})

function openDetail(row)  { detailTarget.value = row; showDetailModal.value = true }
function openTandai(row)  { tandaiTarget.value = row; tandaiMetode.value = ''; showTandaiModal.value = true }
function confirmTandai() {
  if (tandaiTarget.value) {
    tandaiTarget.value.status   = 'lunas'
    tandaiTarget.value.metode   = tandaiMetode.value || 'Tunai'
    tandaiTarget.value.tglBayar = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })
  }
  showTandaiModal.value = false
}
function submitCatat() {
  // ponytail: mock — swap real API
  showCatatModal.value = false
  catatForm.pelanggan = ''; catatForm.jumlah = ''; catatForm.metode = ''
}
</script>
