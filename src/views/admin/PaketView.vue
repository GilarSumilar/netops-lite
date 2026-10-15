<template>
  <div class="flex min-w-0 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div><h2 class="font-headline-lg text-headline-lg-mobile text-text-primary sm:text-headline-lg">Paket Internet</h2><p class="font-body-sm text-body-sm text-text-body mt-0.5">Kelola daftar paket layanan dan harga</p></div>
      <AppButton @click="showTambahModal = true" :full="true" class="sm:w-auto">
        <span class="material-symbols-outlined text-lg">add</span><span>Tambah Paket</span>
      </AppButton>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="p in pakets" :key="p.id" class="bg-surface-base rounded-xl border border-border-subtle p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between"><div><h3 class="font-headline-sm text-headline-sm text-text-primary">{{ p.name }}</h3><p class="font-body-sm text-body-sm text-text-muted mt-0.5">{{ p.desc }}</p></div>
        <span :class="['px-2 py-0.5 rounded-full font-label-sm text-label-sm', p.active ? 'bg-status-success-bg text-status-success-text' : 'bg-status-neutral-bg text-status-neutral-text']">{{ p.active ? 'Aktif' : 'Nonaktif' }}</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-[20px]">wifi</span><span class="font-headline-sm text-headline-sm text-primary font-bold">{{ p.speed }}</span></div>
        <div class="flex items-center justify-between pt-2 border-t border-border-subtle"><span class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ p.price }}</span><span class="font-label-sm text-label-sm text-text-muted">{{ p.subscribers }} pelanggan</span></div>
        <div class="flex gap-2">
          <AppButton variant="outline" size="sm" :full="true" @click="openEdit(p)">Edit</AppButton>
          <AppButton variant="outline" size="sm" @click="deletePaket(p.id)"><span class="material-symbols-outlined text-[16px]">delete</span></AppButton>
        </div>
      </div>
    </div>
    <AppModal v-model="showTambahModal" :title="editTarget ? 'Edit Paket' : 'Tambah Paket Baru'">
      <div class="flex flex-col gap-3">
        <AppInput v-model="paketForm.name" label="Nama Paket" placeholder="Fiber Pro 50 Mbps" />
        <AppInput v-model="paketForm.desc" label="Deskripsi" placeholder="Cocok untuk..." />
        <AppInput v-model="paketForm.speed" label="Kecepatan" placeholder="50 Mbps" />
        <AppInput v-model="paketForm.price" label="Harga/Bulan" placeholder="Rp 250.000" />
      </div>
      <div class="flex gap-3">
        <AppButton variant="outline" :full="true" @click="closePaketModal">Batal</AppButton>
        <AppButton :full="true" @click="submitPaket">Simpan</AppButton>
      </div>
    </AppModal>
    <AppModal v-model="showDeleteModal" title="Hapus Paket?" max-width="sm">
      <p class="font-body-md text-body-md text-text-body">Paket <strong>{{ deleteTarget?.name }}</strong> akan dihapus permanen.</p>
      <div class="flex gap-3">
        <AppButton variant="outline" :full="true" @click="showDeleteModal = false">Batal</AppButton>
        <AppButton variant="danger" :full="true" @click="confirmDelete">Hapus</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppInput  from '@/components/AppInput.vue'
import AppModal  from '@/components/AppModal.vue'

const showTambahModal = ref(false)
const showDeleteModal = ref(false)
const editTarget = ref(null)
const deleteTarget = ref(null)
const paketForm = reactive({ name:'', desc:'', speed:'', price:'' })
const pakets = ref([
  { id:1, name:'Home Basic 20 Mbps', desc:'Cocok untuk browsing dan streaming SD',     speed:'20 Mbps',  price:'Rp 150.000/bln', subscribers:423, active:true },
  { id:2, name:'Fiber Pro 50 Mbps',  desc:'Ideal untuk keluarga aktif streaming HD',   speed:'50 Mbps',  price:'Rp 250.000/bln', subscribers:612, active:true },
  { id:3, name:'Business 100 Mbps',  desc:'Koneksi stabil untuk warnet dan UMKM',      speed:'100 Mbps', price:'Rp 450.000/bln', subscribers:187, active:true },
  { id:4, name:'Ultra 200 Mbps',     desc:'Performa tertinggi untuk gaming streaming', speed:'200 Mbps', price:'Rp 750.000/bln', subscribers:62,  active:true },
  { id:5, name:'Starter 10 Mbps',    desc:'Paket hemat untuk penggunaan ringan',       speed:'10 Mbps',  price:'Rp 99.000/bln',  subscribers:0,   active:false },
])
function openEdit(p) { editTarget.value = p; paketForm.name=p.name; paketForm.desc=p.desc; paketForm.speed=p.speed; paketForm.price=p.price; showTambahModal.value=true }
function closePaketModal() { showTambahModal.value=false; editTarget.value=null; paketForm.name=''; paketForm.desc=''; paketForm.speed=''; paketForm.price='' }
function submitPaket() {
  if (editTarget.value) { Object.assign(editTarget.value, { name:paketForm.name, desc:paketForm.desc, speed:paketForm.speed, price:paketForm.price }) }
  else { pakets.value.push({ id:Date.now(), name:paketForm.name, desc:paketForm.desc, speed:paketForm.speed, price:paketForm.price, subscribers:0, active:true }) }
  closePaketModal()
}
function deletePaket(id) { deleteTarget.value = pakets.value.find(p => p.id === id); showDeleteModal.value = true }
function confirmDelete() { pakets.value = pakets.value.filter(p => p.id !== deleteTarget.value.id); showDeleteModal.value = false; deleteTarget.value = null }
</script>
