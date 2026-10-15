<template>
  <div class="p-4 md:p-6 flex flex-col gap-5">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div><h2 class="font-headline-lg text-headline-lg text-text-primary">Paket Internet</h2><p class="font-body-sm text-body-sm text-text-body mt-0.5">Kelola daftar paket layanan dan harga</p></div>
      <button @click="showTambahModal = true" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary-container text-on-primary font-label-lg hover:bg-primary transition-all shadow-sm"><span class="material-symbols-outlined text-lg">add</span><span>Tambah Paket</span></button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="p in pakets" :key="p.id" class="bg-surface-base rounded-xl border border-border-subtle p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between"><div><h3 class="font-headline-sm text-headline-sm text-text-primary">{{ p.name }}</h3><p class="font-body-sm text-body-sm text-text-muted mt-0.5">{{ p.desc }}</p></div>
        <span :class="['px-2 py-0.5 rounded-full font-label-sm text-label-sm', p.active ? 'bg-status-success-bg text-status-success-text' : 'bg-status-neutral-bg text-status-neutral-text']">{{ p.active ? 'Aktif' : 'Nonaktif' }}</span></div>
        <div class="flex items-center gap-2"><span class="material-symbols-outlined text-primary text-[20px]">wifi</span><span class="font-headline-sm text-headline-sm text-primary font-bold">{{ p.speed }}</span></div>
        <div class="flex items-center justify-between pt-2 border-t border-border-subtle"><span class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ p.price }}</span><span class="font-label-sm text-label-sm text-text-muted">{{ p.subscribers }} pelanggan</span></div>
        <div class="flex gap-2">
          <button @click="openEdit(p)" class="flex-1 h-8 rounded-lg border border-border-default font-label-md text-label-md text-text-body hover:border-primary-container hover:text-primary-container transition-colors">Edit</button>
          <button @click="deletePaket(p.id)" class="h-8 px-3 rounded-lg border border-border-default font-label-md text-label-md text-text-muted hover:bg-status-danger-bg hover:text-status-danger-text hover:border-status-danger-text/20 transition-colors"><span class="material-symbols-outlined text-[16px]">delete</span></button>
        </div>
      </div>
    </div>
    <!-- Modal Tambah/Edit -->
    <div v-if="showTambahModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="closePaketModal">
      <div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4 p-6">
        <div class="flex items-center justify-between"><h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ editTarget ? 'Edit Paket' : 'Tambah Paket Baru' }}</h3><button @click="closePaketModal" class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted"><span class="material-symbols-outlined text-xl">close</span></button></div>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Nama Paket</label><input v-model="paketForm.name" type="text" placeholder="Fiber Pro 50 Mbps" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Deskripsi</label><input v-model="paketForm.desc" type="text" placeholder="Cocok untuk..." class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="grid grid-cols-2 gap-3"><div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Kecepatan</label><input v-model="paketForm.speed" type="text" placeholder="50 Mbps" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container" /></div><div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Harga/Bulan</label><input v-model="paketForm.price" type="text" placeholder="Rp 250.000" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container" /></div></div>
        </div>
        <div class="flex gap-3"><button @click="closePaketModal" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low transition-colors">Batal</button><button @click="submitPaket" class="flex-1 h-10 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all shadow-sm">Simpan</button></div>
      </div>
    </div>
    <!-- Konfirmasi Delete -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="deleteTarget = null">
      <div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-4 p-6">
        <h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">Hapus Paket?</h3>
        <p class="font-body-md text-body-md text-text-body">Paket <strong>{{ deleteTarget.name }}</strong> akan dihapus permanen.</p>
        <div class="flex gap-3"><button @click="deleteTarget = null" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low">Batal</button><button @click="confirmDelete" class="flex-1 h-10 rounded-lg bg-status-danger-text text-on-error font-label-md hover:opacity-90 shadow-sm">Hapus</button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const showTambahModal = ref(false)
const editTarget = ref(null)
const deleteTarget = ref(null)
const paketForm = reactive({ name:'', desc:'', speed:'', price:'' })
const pakets = ref([
  { id:1, name:'Home Basic 20 Mbps', desc:'Cocok untuk browsing dan streaming SD',        speed:'20 Mbps',  price:'Rp 150.000/bln', subscribers:423, active:true },
  { id:2, name:'Fiber Pro 50 Mbps',  desc:'Ideal untuk keluarga aktif streaming HD',      speed:'50 Mbps',  price:'Rp 250.000/bln', subscribers:612, active:true },
  { id:3, name:'Business 100 Mbps',  desc:'Koneksi stabil untuk warnet dan UMKM',         speed:'100 Mbps', price:'Rp 450.000/bln', subscribers:187, active:true },
  { id:4, name:'Ultra 200 Mbps',     desc:'Performa tertinggi untuk gaming streaming',    speed:'200 Mbps', price:'Rp 750.000/bln', subscribers:62,  active:true },
  { id:5, name:'Starter 10 Mbps',    desc:'Paket hemat untuk penggunaan ringan',          speed:'10 Mbps',  price:'Rp 99.000/bln',  subscribers:0,   active:false },
])
function openEdit(p) { editTarget.value = p; paketForm.name=p.name; paketForm.desc=p.desc; paketForm.speed=p.speed; paketForm.price=p.price; showTambahModal.value=true }
function closePaketModal() { showTambahModal.value=false; editTarget.value=null; paketForm.name=''; paketForm.desc=''; paketForm.speed=''; paketForm.price='' }
function submitPaket() {
  if (editTarget.value) { Object.assign(editTarget.value, { name:paketForm.name, desc:paketForm.desc, speed:paketForm.speed, price:paketForm.price }) }
  else { pakets.value.push({ id:Date.now(), name:paketForm.name, desc:paketForm.desc, speed:paketForm.speed, price:paketForm.price, subscribers:0, active:true }) }
  closePaketModal()
}
function deletePaket(id) { deleteTarget.value = pakets.value.find(p => p.id === id) }
function confirmDelete() { pakets.value = pakets.value.filter(p => p.id !== deleteTarget.value.id); deleteTarget.value = null }
</script>
