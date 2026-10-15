<template>
  <div class="flex w-full min-w-0 max-w-[1440px] flex-col gap-4 p-4 mx-auto sm:gap-6 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2 text-text-muted font-label-md text-label-md">
          <span>Admin</span><span class="material-symbols-outlined text-sm">chevron_right</span>
          <span class="text-primary-container font-semibold">Manajemen Pelanggan</span>
        </div>
        <h1 class="font-headline-xl text-headline-xl-mobile text-text-primary tracking-tight sm:text-headline-xl">Data Pelanggan</h1>
        <p class="font-body-md text-body-md text-text-muted">Kelola data pelanggan, informasi paket, status layanan internet, dan alamat pemasangan.</p>
      </div>
      <div class="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
        <button type="button" class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-surface-base px-3 text-text-primary font-label-lg text-label-lg shadow-sm transition-colors hover:bg-surface-container-low sm:flex-none sm:px-4">
          <span class="material-symbols-outlined text-xl text-text-body">download</span><span>Unduh Data</span>
        </button>
        <button type="button" @click="showModal = true" class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary-container px-3 text-on-primary font-label-lg text-label-lg shadow-sm transition-all hover:bg-primary sm:flex-none sm:px-4">
          <span class="material-symbols-outlined text-xl">person_add</span><span>Tambah Pelanggan</span>
        </button>
      </div>
    </div>
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-xl bg-surface-base shadow-sm flex items-center justify-between">
        <div class="flex flex-col"><span class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Total Pelanggan</span><span class="font-currency-stat text-currency-stat text-text-primary mt-1">128</span><span class="font-body-sm text-body-sm text-status-success-text flex items-center gap-1 mt-1"><span class="material-symbols-outlined text-sm">trending_up</span>+6 bulan ini</span></div>
        <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary-container"><span class="material-symbols-outlined text-2xl">groups</span></div>
      </div>
      <div class="p-5 rounded-xl bg-surface-base shadow-sm flex items-center justify-between">
        <div class="flex flex-col"><span class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Layanan Aktif</span><span class="font-currency-stat text-currency-stat text-text-primary mt-1">122</span><span class="font-body-sm text-body-sm text-text-muted mt-1">95.3% operasional</span></div>
        <div class="w-12 h-12 rounded-full bg-status-success-bg flex items-center justify-center text-status-success-text"><span class="material-symbols-outlined text-2xl">wifi_tethering</span></div>
      </div>
      <div class="p-5 rounded-xl bg-surface-base shadow-sm flex items-center justify-between">
        <div class="flex flex-col"><span class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Status Isolir</span><span class="font-currency-stat text-currency-stat text-text-primary mt-1">4</span><span class="font-body-sm text-body-sm text-status-warning-text flex items-center gap-1 mt-1"><span class="material-symbols-outlined text-sm">warning</span>Menunggak &gt; 5 hr</span></div>
        <div class="w-12 h-12 rounded-full bg-status-warning-bg flex items-center justify-center text-status-warning-text"><span class="material-symbols-outlined text-2xl">phonelink_lock</span></div>
      </div>
      <div class="p-5 rounded-xl bg-surface-base shadow-sm flex items-center justify-between">
        <div class="flex flex-col"><span class="font-label-sm text-label-sm text-text-muted uppercase tracking-wider">Nonaktif / Putus</span><span class="font-currency-stat text-currency-stat text-text-primary mt-1">2</span><span class="font-body-sm text-body-sm text-text-muted mt-1">1 migrasi fiber</span></div>
        <div class="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-status-neutral-text"><span class="material-symbols-outlined text-2xl">person_off</span></div>
      </div>
    </div>
    <!-- Table -->
    <div class="bg-surface-base rounded-xl shadow-sm flex flex-col overflow-hidden">
      <div class="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-3xl">
          <div class="relative flex-1"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none">search</span><input v-model="search" type="text" placeholder="Cari nama, ID, atau alamat..." class="w-full h-10 pl-10 pr-3.5 rounded-lg border border-border-default bg-surface-base font-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container" /></div>
          <select v-model="filterStatus" class="h-10 px-3 rounded-lg border border-border-default bg-surface-base font-body-sm text-text-primary focus:outline-none"><option value="">Semua Status</option><option value="aktif">Aktif</option><option value="suspend">Suspend</option><option value="isolir">Isolir</option></select>
        </div>
      </div>
      <div class="overflow-x-auto"><table class="w-full min-w-[720px]"><thead><tr class="border-b border-border-subtle bg-surface-container-low"><th v-for="h in headers" :key="h" class="text-left px-4 py-3 font-label-md text-label-md text-text-muted">{{ h }}</th></tr></thead>
      <tbody class="divide-y divide-border-subtle">
        <tr v-for="p in filtered" :key="p.id" class="hover:bg-surface-container-low transition-colors">
          <td class="px-3 md:px-4 py-2.5 md:py-3 font-label-sm text-label-sm text-text-muted whitespace-nowrap">{{ p.id }}</td>
          <td class="px-3 md:px-4 py-2.5 md:py-3"><div class="flex items-center gap-2.5"><div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-label-sm font-bold shrink-0">{{ p.initials }}</div><div class="min-w-0"><p class="font-label-md text-label-md text-text-primary whitespace-nowrap">{{ p.name }}</p><p class="font-body-sm text-body-sm text-text-muted truncate max-w-[160px] md:max-w-none">{{ p.address }}</p></div></div></td>
          <td class="px-3 md:px-4 py-2.5 md:py-3 font-body-md text-body-md text-text-primary whitespace-nowrap">{{ p.paket }}</td>
          <td class="px-3 md:px-4 py-2.5 md:py-3"><span :class="['inline-flex px-2 py-0.5 rounded-full font-label-sm whitespace-nowrap', sCls[p.status]]">{{ p.status }}</span></td>
          <td class="px-3 md:px-4 py-2.5 md:py-3 font-body-md whitespace-nowrap" :class="p.tagihan > 0 ? 'text-status-danger-text' : 'text-status-success-text'">{{ p.tagihan > 0 ? 'Rp ' + p.tagihan.toLocaleString('id-ID') : 'Lunas' }}</td>
          <td class="px-3 md:px-4 py-2.5 md:py-3"><div class="flex gap-1"><button class="p-1.5 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-primary" title="Detail"><span class="material-symbols-outlined text-[18px]">visibility</span></button><button class="p-1.5 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-primary" title="Edit"><span class="material-symbols-outlined text-[18px]">edit</span></button></div></td>
        </tr>
        <tr v-if="!filtered.length"><td colspan="6" class="px-4 py-8 text-center font-body-md text-body-md text-text-muted">Tidak ada data ditemukan</td></tr>
      </tbody></table></div>
    </div>
    <!-- Modal Tambah Pelanggan -->
    <div v-if="showModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="showModal = false">
      <div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto flex flex-col gap-5 p-4 sm:p-6">
        <div class="flex items-center justify-between"><h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">Tambah Pelanggan Baru</h3><button @click="showModal = false" class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted transition-colors"><span class="material-symbols-outlined text-xl">close</span></button></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5 sm:col-span-2"><label class="font-label-md text-label-md text-text-primary">Nama Lengkap</label><input v-model="newPel.name" type="text" placeholder="Bpk./Ibu ..." class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">No. Telepon</label><input v-model="newPel.phone" type="text" placeholder="08xx..." class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Paket Internet</label><select v-model="newPel.paket" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container"><option value="">Pilih paket...</option><option>Home Basic 10 Mbps</option><option>Standard 20 Mbps</option><option>Fiber Pro 50 Mbps</option><option>Business 100 Mbps</option></select></div>
          <div class="flex flex-col gap-1.5 sm:col-span-2"><label class="font-label-md text-label-md text-text-primary">Alamat Pemasangan</label><input v-model="newPel.address" type="text" placeholder="Jl. ..." class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
        </div>
        <div class="flex gap-3 pt-1"><button @click="showModal = false" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low transition-colors">Batal</button><button @click="submitNew" class="flex-1 h-10 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all shadow-sm">Simpan Pelanggan</button></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
const search = ref(''), filterStatus = ref(''), showModal = ref(false)
const newPel = reactive({ name:'', phone:'', paket:'', address:'' })
const headers = ['ID','Nama Pelanggan','Paket','Status','Tagihan','Aksi']
const sCls = { aktif:'bg-status-success-bg text-status-success-text', suspend:'bg-status-warning-bg text-status-warning-text', isolir:'bg-status-danger-bg text-status-danger-text' }
const rows = [
  { id:'CUST-001', name:'Bpk. Agus Setiawan',   initials:'AS', address:'Jl. Melati No. 12',       paket:'Fiber Pro 50 Mbps',  status:'aktif',   tagihan:0 },
  { id:'CUST-002', name:'Ibu Sari Dewi',         initials:'SD', address:'Griya Asri Blok C-07',    paket:'Home Basic 20 Mbps', status:'aktif',   tagihan:150000 },
  { id:'CUST-003', name:'Ahmad Fauzi',           initials:'AF', address:'Perum Anggrek Mas B-15',  paket:'Fiber Pro 50 Mbps',  status:'suspend', tagihan:300000 },
  { id:'CUST-004', name:'Bpk. Hendra Kurniawan', initials:'HK', address:'Jl. Kenanga Indah No. 8', paket:'Business 100 Mbps',  status:'aktif',   tagihan:0 },
  { id:'CUST-005', name:'Ibu Ratna Sari',        initials:'RS', address:'Taman Bunga Blok A No.3', paket:'Home Basic 20 Mbps', status:'isolir',  tagihan:450000 },
]
const filtered = computed(() => rows.filter(p =>
  (!search.value || p.name.toLowerCase().includes(search.value.toLowerCase()) || p.id.includes(search.value))
  && (!filterStatus.value || p.status === filterStatus.value)
))
function submitNew() {
  // ponytail: mock — swap real API + add to rows
  showModal.value = false
  newPel.name=''; newPel.phone=''; newPel.paket=''; newPel.address=''
}
</script>
