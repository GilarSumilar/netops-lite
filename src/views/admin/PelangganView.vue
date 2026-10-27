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
        <AppButton v-if="auth.isAdmin" @click="showModal = true" :full="true" class="sm:flex-none">
          <span class="material-symbols-outlined text-xl">person_add</span><span>Tambah Pelanggan</span>
        </AppButton>
      </div>
    </div>
    <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>
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
        <button v-if="auth.isAdmin" @click="openEdit(row)" class="p-1.5 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-primary transition-colors" title="Edit">
          <span class="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button v-if="auth.isAdmin" @click="openDelete(row)" class="p-1.5 rounded-lg hover:bg-status-danger-bg text-text-muted hover:text-status-danger-text transition-colors" title="Hapus">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </template>
    </AppDataTable>
    <AppModal v-model="showModal" :title="editTarget ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'" max-width="lg">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AppInput v-model="form.name"    label="Nama Lengkap"      placeholder="Bpk./Ibu ..."  class="sm:col-span-2" />
        <AppInput v-model="form.phone"   label="No. Telepon"       placeholder="08xx..." />
        <AppInput v-model="form.email"   label="Email Akun Portal"  placeholder="pelanggan@example.com" type="email" />
        <AppSelect v-model="form.paket"  label="Paket Internet">
          <option value="">Pilih paket...</option>
          <option v-for="paket in paketOptions" :key="paket.id" :value="paket.name">{{ paket.name }}</option>
        </AppSelect>
        <AppInput v-model="form.address" label="Alamat Pemasangan" placeholder="Jl. ..."      class="sm:col-span-2" />
        <AppSelect v-model="form.status" label="Status" class="sm:col-span-2">
          <option value="aktif">Aktif</option>
          <option value="suspend">Suspend</option>
          <option value="isolir">Isolir</option>
        </AppSelect>
      </div>
      <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>
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
        <AppButton v-if="auth.isAdmin" :full="true" @click="openEdit(detailTarget); showDetailModal = false">Edit Data</AppButton>
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
import { ref, computed, reactive, onMounted } from 'vue'
import AppButton    from '@/components/AppButton.vue'
import AppInput     from '@/components/AppInput.vue'
import AppSelect    from '@/components/AppSelect.vue'
import AppModal     from '@/components/AppModal.vue'
import AppDataTable from '@/components/AppDataTable.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const search          = ref('')
const filterStatus    = ref('')
const showModal       = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const editTarget      = ref(null)
const detailTarget    = ref(null)
const deleteTarget    = ref(null)
const errorMsg        = ref('')
const paketOptions    = ref([])
const form = reactive({ name:'', phone:'', email:'', paket:'', address:'', status:'aktif' })

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

const rows = ref([])
const stats = computed(() => {
  const active = rows.value.filter(row => row.status === 'aktif').length
  const isolated = rows.value.filter(row => row.status === 'isolir').length
  const inactive = rows.value.filter(row => row.status === 'suspend').length
  return [
    { label:'Total Pelanggan', value:rows.value.length, sub:'Data tersimpan', subClass:'text-status-success-text', icon:'groups', iconBg:'bg-surface-container', iconColor:'text-primary-container' },
    { label:'Layanan Aktif', value:active, sub:`${rows.value.length ? Math.round(active / rows.value.length * 100) : 0}% operasional`, subClass:'text-text-muted', icon:'wifi_tethering', iconBg:'bg-status-success-bg', iconColor:'text-status-success-text' },
    { label:'Status Isolir', value:isolated, sub:'Perlu tindak lanjut', subClass:'text-status-warning-text', icon:'phonelink_lock', iconBg:'bg-status-warning-bg', iconColor:'text-status-warning-text' },
    { label:'Suspend', value:inactive, sub:'Perlu tindak lanjut', subClass:'text-text-muted', icon:'wifi_off', iconBg:'bg-status-neutral-bg', iconColor:'text-status-neutral-text' },
  ]
})

onMounted(() => Promise.all([loadRows(), ...(auth.isAdmin ? [loadPakets()] : [])]))
async function loadRows() {
  try {
    rows.value = await api.list('pelanggan')
  } catch (error) {
    errorMsg.value = `Gagal memuat pelanggan: ${error.message}`
  }
}
async function loadPakets() {
  try {
    paketOptions.value = await api.list('paket')
  } catch (error) {
    errorMsg.value = `Gagal memuat pilihan paket: ${error.message}`
  }
}

const filteredRows = computed(() => {
  if (!filterStatus.value) return rows.value
  return rows.value.filter(p => p.status === filterStatus.value)
})

const detailFields = computed(() => detailTarget.value ? [
  { label:'ID Pelanggan', value: detailTarget.value.id },
  { label:'No. Telepon',  value: detailTarget.value.phone },
  { label:'Email Akun',   value: detailTarget.value.email || '-' },
  { label:'Paket',        value: detailTarget.value.paket },
  { label:'Alamat',       value: detailTarget.value.address },
] : [])

function openDetail(row) { detailTarget.value = row; showDetailModal.value = true }
function openEdit(row) {
  editTarget.value = row
  Object.assign(form, { name: row.name, phone: row.phone, email: row.email || '', paket: row.paket, address: row.address, status: row.status })
  showModal.value = true
}
function openDelete(row) { deleteTarget.value = row; showDeleteModal.value = true }
function closeModal() { showModal.value = false; editTarget.value = null; Object.assign(form, { name:'', phone:'', email:'', paket:'', address:'', status:'aktif' }) }
async function submitForm() {
  if (!form.name.trim() || !form.phone.trim() || !form.paket || !form.address.trim()) {
    errorMsg.value = 'Nama, telepon, paket, dan alamat wajib diisi.'
    return
  }
  const customer = {
    name: form.name.trim(),
    initials: form.name.trim().split(/\s+/).map(word => word[0]).slice(0, 2).join('').toUpperCase(),
    phone: form.phone.trim(),
    email: form.email.trim().toLowerCase(),
    paket: form.paket,
    address: form.address.trim(),
    status: form.status,
    tagihan: editTarget.value?.tagihan ?? 0,
  }
  try {
    errorMsg.value = ''
    if (editTarget.value) {
      const updated = await api.update('pelanggan', editTarget.value.id, customer)
      Object.assign(editTarget.value, updated)
    } else {
      rows.value.push(await api.create('pelanggan', customer))
    }
    closeModal()
  } catch (error) {
    errorMsg.value = `Gagal menyimpan pelanggan: ${error.message}`
  }
}
async function confirmDelete() {
  try {
    errorMsg.value = ''
    await api.remove('pelanggan', deleteTarget.value.id)
    rows.value = rows.value.filter(p => p.id !== deleteTarget.value.id)
    showDeleteModal.value = false
    deleteTarget.value = null
  } catch (error) {
    errorMsg.value = `Gagal menghapus pelanggan: ${error.message}`
  }
}
</script>
