<template>
  <div class="flex w-full min-w-0 max-w-[1440px] flex-col gap-4 p-4 mx-auto sm:gap-6 sm:p-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2 text-text-muted font-label-md text-label-md">
          <span>Admin</span><span class="material-symbols-outlined text-sm">chevron_right</span>
          <span class="text-primary-container font-semibold">Manajemen Pelanggan</span>
        </div>
        <h1 class="font-headline-xl text-headline-xl-mobile text-text-primary tracking-tight sm:text-headline-xl">Data Pelanggan</h1>
        <p class="font-body-md text-body-md text-text-muted">Kelola data pelanggan, paket, status layanan, dan alamat pemasangan.</p>
      </div>
      <div class="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
        <AppButton variant="secondary" :full="true" class="sm:flex-none">
          <span class="material-symbols-outlined text-xl text-text-body">download</span><span>Unduh Data</span>
        </AppButton>
        <AppButton @click="showModal = true" :full="true" class="sm:flex-none">
          <span class="material-symbols-outlined text-xl">person_add</span><span>Tambah Pelanggan</span>
        </AppButton>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="p-5 rounded-xl bg-surface-base shadow-sm flex items-center justify-between">
        <div class="flex flex-col">
          <span class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">{{ s.label }}</span>
          <span class="font-currency-stat text-currency-stat text-text-primary mt-1">{{ s.value }}</span>
          <span class="font-body-sm text-body-sm mt-1" :class="s.subClass">{{ s.sub }}</span>
        </div>
        <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="s.iconBg">
          <span class="material-symbols-outlined text-2xl" :class="s.iconColor">{{ s.icon }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div class="relative w-full sm:max-w-xs">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted pointer-events-none">search</span>
        <input v-model="search" type="text" placeholder="Cari nama atau ID pelanggan..."
          class="w-full h-10 pl-9 pr-3 rounded-lg border border-border-default bg-surface-base font-body-md text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container" />
      </div>
      <AppSelect v-model="filterStatus" class="w-full sm:w-44">
        <option value="">Semua Status</option>
        <option value="aktif">Aktif</option>
        <option value="suspend">Suspend</option>
        <option value="isolir">Isolir</option>
      </AppSelect>
    </div>
    <AppDataTable :columns="columns" :rows="filteredRows" :search="search" :show-page-size="true" :page-size="10">
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-label-sm text-label-sm font-bold shrink-0">{{ row.initials }}</div>
          <div class="min-w-0">
            <p class="font-label-md text-label-md text-text-primary truncate">{{ row.name }}</p>
            <p class="font-body-sm text-body-sm text-text-muted truncate">{{ row.address }}</p>
          </div>
        </div>
      </template>
      <template #cell-status="{ row }">
        <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm capitalize', sCls[row.status]]">{{ row.status }}</span>
      </template>
      <template #cell-tagihan="{ row }">
        <span :class="row.tagihan > 0 ? 'text-status-danger-text font-semibold' : 'text-status-success-text'">
          {{ row.tagihan > 0 ? 'Rp ' + row.tagihan.toLocaleString('id-ID') : 'Lunas' }}
        </span>
      </template>
      <template #actions="{ row }">
        <button @click="openDetail(row)" class="p-1.5 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-primary transition-colors" title="Detail">
          <span class="material-symbols-outlined text-[18px]">visibility</span>
        </button>
        <button @click="openEdit(row)" class="p-1.5 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-primary transition-colors" title="Edit">
          <span class="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button @click="openDelete(row)" class="p-1.5 rounded-lg hover:bg-status-danger-bg text-text-muted hover:text-status-danger-text transition-colors" title="Hapus">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </template>
    </AppDataTable>
    <AppModal v-model="showModal" :title="editTarget ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'" max-width="lg">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AppInput v-model="form.name"    label="Nama Lengkap"      placeholder="Bpk./Ibu ..."  class="sm:col-span-2" />
        <AppInput v-model="form.phone"   label="No. Telepon"       placeholder="08xx..." />
        <AppSelect v-model="form.paket"  label="Paket Internet">
          <option value="">Pilih paket...</option>
          <option>Home Basic 20 Mbps</option>
          <option>Fiber Pro 50 Mbps</option>
          <option>Business 100 Mbps</option>
          <option>Ultra 200 Mbps</option>
        </AppSelect>
        <AppInput v-model="form.address" label="Alamat Pemasangan" placeholder="Jl. ..."      class="sm:col-span-2" />
        <AppSelect v-model="form.status" label="Status" class="sm:col-span-2">
          <option value="aktif">Aktif</option>
          <option value="suspend">Suspend</option>
          <option value="isolir">Isolir</option>
        </AppSelect>
      </div>
      <div class="flex gap-3 pt-1">
        <AppButton variant="outline" :full="true" @click="closeModal">Batal</AppButton>
        <AppButton :full="true" @click="submitForm">{{ editTarget ? 'Simpan Perubahan' : 'Tambah Pelanggan' }}</AppButton>
      </div>
    </AppModal>
    <AppModal v-model="showDetailModal" title="Detail Pelanggan" max-width="md">
      <div v-if="detailTarget" class="flex flex-col gap-3">
        <div class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
          <div class="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-bold text-xl shrink-0">{{ detailTarget.initials }}</div>
          <div>
            <p class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ detailTarget.name }}</p>
            <p class="font-body-sm text-body-sm text-text-muted">{{ detailTarget.id }}</p>
            <span :class="['inline-flex px-2 py-0.5 rounded-full font-label-sm capitalize mt-1', sCls[detailTarget.status]]">{{ detailTarget.status }}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
          <div v-for="d in detailFields" :key="d.label">
            <p class="font-label-sm text-label-sm text-text-muted">{{ d.label }}</p>
            <p class="font-body-md text-body-md text-text-primary">{{ d.value }}</p>
          </div>
        </div>
      </div>
      <div class="flex gap-3 pt-1">
        <AppButton variant="outline" :full="true" @click="showDetailModal = false">Tutup</AppButton>
        <AppButton :full="true" @click="openEdit(detailTarget); showDetailModal = false">Edit Data</AppButton>
      </div>
    </AppModal>
    <AppModal v-model="showDeleteModal" title="Hapus Pelanggan?" max-width="sm">
      <p class="font-body-md text-body-md text-text-body">Data pelanggan <strong>{{ deleteTarget?.name }}</strong> akan dihapus permanen.</p>
      <div class="flex gap-3">
        <AppButton variant="outline" :full="true" @click="showDeleteModal = false">Batal</AppButton>
        <AppButton variant="danger"  :full="true" @click="confirmDelete">Hapus</AppButton>
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
const showModal       = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const editTarget      = ref(null)
const detailTarget    = ref(null)
const deleteTarget    = ref(null)
const form = reactive({ name:'', phone:'', paket:'', address:'', status:'aktif' })

const columns = [
  { key:'id',      label:'ID',              thClass:'w-28' },
  { key:'name',    label:'Nama Pelanggan' },
  { key:'paket',   label:'Paket' },
  { key:'status',  label:'Status',          thClass:'w-28' },
  { key:'tagihan', label:'Tagihan',         thClass:'w-36' },
]

const sCls = {
  aktif:   'bg-status-success-bg text-status-success-text',
  suspend: 'bg-status-warning-bg text-status-warning-text',
  isolir:  'bg-status-danger-bg text-status-danger-text',
}

const stats = [
  { label:'Total Pelanggan',  value:'128', sub:'+6 bulan ini',        subClass:'text-status-success-text', icon:'groups',        iconBg:'bg-surface-container',  iconColor:'text-primary-container' },
  { label:'Layanan Aktif',    value:'122', sub:'95.3% operasional', subClass:'text-text-muted',           icon:'wifi_tethering',iconBg:'bg-status-success-bg',  iconColor:'text-status-success-text' },
  { label:'Status Isolir',    value:'4',   sub:'Menunggak > 5 hr',   subClass:'text-status-warning-text',  icon:'phonelink_lock',iconBg:'bg-status-warning-bg',  iconColor:'text-status-warning-text' },
  { label:'Nonaktif / Putus', value:'2',   sub:'Perlu tindak lanjut',subClass:'text-text-muted',           icon:'wifi_off',       iconBg:'bg-status-neutral-bg',  iconColor:'text-status-neutral-text' },
]

const rows = ref([
  { id:'CUST-001', name:'Bpk. Agus Setiawan',   initials:'AS', address:'Jl. Melati No. 12',       paket:'Fiber Pro 50 Mbps',  status:'aktif',   tagihan:0,      phone:'+62 812-0001-0001' },
  { id:'CUST-002', name:'Ibu Sari Dewi',         initials:'SD', address:'Griya Asri Blok C-07',    paket:'Home Basic 20 Mbps', status:'aktif',   tagihan:150000, phone:'+62 812-0002-0002' },
  { id:'CUST-003', name:'Ahmad Fauzi',           initials:'AF', address:'Perum Anggrek Mas B-15',  paket:'Fiber Pro 50 Mbps',  status:'suspend', tagihan:300000, phone:'+62 812-0003-0003' },
  { id:'CUST-004', name:'Bpk. Hendra Kurniawan', initials:'HK', address:'Jl. Kenanga Indah No. 8', paket:'Business 100 Mbps',  status:'aktif',   tagihan:0,      phone:'+62 812-0004-0004' },
  { id:'CUST-005', name:'Ibu Ratna Sari',        initials:'RS', address:'Taman Bunga Blok A No.3', paket:'Home Basic 20 Mbps', status:'isolir',  tagihan:450000, phone:'+62 812-0005-0005' },
  { id:'CUST-006', name:'Bpk. Doni Pratama',     initials:'DP', address:'Jl. Mawar No. 5',         paket:'Ultra 200 Mbps',     status:'aktif',   tagihan:0,      phone:'+62 812-0006-0006' },
  { id:'CUST-007', name:'Ibu Lestari',           initials:'IL', address:'Perum Cendana No. 11',    paket:'Home Basic 20 Mbps', status:'aktif',   tagihan:75000,  phone:'+62 812-0007-0007' },
  { id:'CUST-008', name:'Bpk. Wahyu Saputra',    initials:'WS', address:'Jl. Flamboyan No. 3',     paket:'Fiber Pro 50 Mbps',  status:'suspend', tagihan:500000, phone:'+62 812-0008-0008' },
  { id:'CUST-009', name:'Ibu Mega Wulandari',    initials:'MW', address:'Griya Indah Blok D-02',   paket:'Business 100 Mbps',  status:'aktif',   tagihan:0,      phone:'+62 812-0009-0009' },
  { id:'CUST-010', name:'Ahmad Rizky',           initials:'AR', address:'Jl. Anggrek No. 7',       paket:'Home Basic 20 Mbps', status:'isolir',  tagihan:300000, phone:'+62 812-0010-0010' },
  { id:'CUST-011', name:'Bpk. Fajar Nugroho',    initials:'FN', address:'Perum Sejahtera A-5',     paket:'Fiber Pro 50 Mbps',  status:'aktif',   tagihan:0,      phone:'+62 812-0011-0011' },
  { id:'CUST-012', name:'Ibu Yanti Kusuma',      initials:'YK', address:'Jl. Dahlia No. 9',        paket:'Ultra 200 Mbps',     status:'aktif',   tagihan:0,      phone:'+62 812-0012-0012' },
])

const filteredRows = computed(() => {
  if (!filterStatus.value) return rows.value
  return rows.value.filter(p => p.status === filterStatus.value)
})

const detailFields = computed(() => detailTarget.value ? [
  { label:'ID Pelanggan', value: detailTarget.value.id },
  { label:'No. Telepon',  value: detailTarget.value.phone },
  { label:'Paket',        value: detailTarget.value.paket },
  { label:'Alamat',       value: detailTarget.value.address },
] : [])

function openDetail(row) { detailTarget.value = row; showDetailModal.value = true }
function openEdit(row) {
  editTarget.value = row
  Object.assign(form, { name: row.name, phone: row.phone, paket: row.paket, address: row.address, status: row.status })
  showModal.value = true
}
function openDelete(row) { deleteTarget.value = row; showDeleteModal.value = true }
function closeModal() { showModal.value = false; editTarget.value = null; Object.assign(form, { name:'', phone:'', paket:'', address:'', status:'aktif' }) }
function submitForm() {
  if (editTarget.value) {
    Object.assign(editTarget.value, { name: form.name, phone: form.phone, paket: form.paket, address: form.address, status: form.status })
  } else {
    const initials = form.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()
    rows.value.push({ id:'CUST-' + String(rows.value.length + 1).padStart(3,'0'), name: form.name, initials, phone: form.phone, paket: form.paket, address: form.address, status: form.status, tagihan: 0 })
  }
  closeModal()
}
function confirmDelete() {
  rows.value = rows.value.filter(p => p.id !== deleteTarget.value.id)
  showDeleteModal.value = false; deleteTarget.value = null
}
</script>
