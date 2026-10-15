<template>
  <div class="max-w-2xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
    <h2 class="font-headline-lg text-headline-lg text-text-primary">Profil Saya</h2>
    <!-- Avatar + name -->
    <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex items-center gap-4">
      <div class="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-headline-md font-bold ring-4 ring-primary-fixed shrink-0">
        {{ user?.initials }}
      </div>
      <div>
        <h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ user?.name }}</h3>
        <p class="font-body-sm text-body-sm text-text-muted">{{ user?.id }}</p>
        <span class="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text font-label-sm font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-status-success-text"></span> Pelanggan Aktif
        </span>
      </div>
    </div>
    <!-- Info fields -->
    <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-0 divide-y divide-border-subtle">
      <div v-for="f in fields" :key="f.label" class="flex items-center justify-between py-3">
        <div class="flex items-center gap-2.5">
          <span class="material-symbols-outlined text-[18px] text-text-muted">{{ f.icon }}</span>
          <span class="font-body-md text-body-md text-text-body">{{ f.label }}</span>
        </div>
        <span class="font-label-md text-label-md text-text-primary font-semibold text-right max-w-[60%]">{{ f.value }}</span>
      </div>
    </div>
    <!-- Actions -->
    <div class="flex flex-col gap-2">
      <button @click="showEditModal = true" class="h-11 rounded-lg border border-border-default font-label-lg text-text-body hover:border-primary-container hover:text-primary-container flex items-center justify-center gap-2 transition-all">
        <span class="material-symbols-outlined text-[18px]">edit</span> Edit Profil
      </button>
      <button @click="showPasswordModal = true" class="h-11 rounded-lg border border-border-default font-label-lg text-text-body hover:border-border-default flex items-center justify-center gap-2 transition-all">
        <span class="material-symbols-outlined text-[18px]">lock</span> Ganti Kata Sandi
      </button>
      <button @click="handleLogout" type="button" class="h-11 rounded-full bg-[#FEF2F2] px-4 font-label-lg font-medium text-[#DC2626] flex items-center justify-center gap-2 hover:bg-[#FEE2E2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]/30 transition-colors">
        <span class="material-symbols-outlined text-[18px]">logout</span> Keluar
      </button>
    </div>
    <!-- Modal Edit Profil -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="showEditModal = false">
      <div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4 p-6">
        <div class="flex items-center justify-between">
          <h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">Edit Profil</h3>
          <button @click="showEditModal = false" class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted transition-colors"><span class="material-symbols-outlined text-xl">close</span></button>
        </div>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Nama Lengkap</label><input v-model="editForm.name" type="text" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">No. Telepon</label><input v-model="editForm.phone" type="text" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Email</label><input v-model="editForm.email" type="email" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Alamat</label><input v-model="editForm.address" type="text" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
        </div>
        <p v-if="editSubmitted" class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg">Profil berhasil diperbarui.</p>
        <div class="flex gap-3"><button @click="showEditModal = false" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low transition-colors">Batal</button><button @click="submitEdit" class="flex-1 h-10 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all shadow-sm">Simpan</button></div>
      </div>
    </div>
    <!-- Modal Ganti Kata Sandi -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" @click.self="showPasswordModal = false">
      <div class="bg-surface-base rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4 p-6">
        <div class="flex items-center justify-between">
          <h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">Ganti Kata Sandi</h3>
          <button @click="showPasswordModal = false" class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted transition-colors"><span class="material-symbols-outlined text-xl">close</span></button>
        </div>
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Kata Sandi Lama</label><input v-model="passForm.lama" type="password" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Kata Sandi Baru</label><input v-model="passForm.baru" type="password" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
          <div class="flex flex-col gap-1.5"><label class="font-label-md text-label-md text-text-primary">Konfirmasi Kata Sandi Baru</label><input v-model="passForm.konfirmasi" type="password" class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" /></div>
        </div>
        <p v-if="passSubmitted" class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg">Kata sandi berhasil diubah.</p>
        <p v-if="passForm.baru && passForm.konfirmasi && passForm.baru !== passForm.konfirmasi" class="font-body-sm text-body-sm text-status-danger-text bg-status-danger-bg px-3 py-2 rounded-lg">Konfirmasi kata sandi tidak cocok.</p>
        <div class="flex gap-3"><button @click="showPasswordModal = false" class="flex-1 h-10 rounded-lg border border-border-default text-text-body font-label-md hover:bg-surface-container-low transition-colors">Batal</button><button @click="submitPassword" class="flex-1 h-10 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all shadow-sm">Simpan</button></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore(), router = useRouter()
const user = computed(() => auth.user)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const editForm = reactive({ name: '', phone: '', email: '', address: '' })
const passForm = reactive({ lama: '', baru: '', konfirmasi: '' })
const editSubmitted = ref(false)
const passSubmitted = ref(false)
const fields = [
  { label:'Nama Lengkap',    icon:'person',         value:'Bpk. Agus Setiawan' },
  { label:'ID Pelanggan',    icon:'badge',          value:'CUST-2024-035' },
  { label:'Paket Aktif',     icon:'wifi',           value:'Fiber Pro 50 Mbps' },
  { label:'Alamat',          icon:'home',           value:'Jl. Melati No. 12, RT 03/RW 01' },
  { label:'No. Telepon',     icon:'phone',          value:'+62 812-3456-7890' },
  { label:'Email',           icon:'alternate_email',value:'agus.setiawan@email.com' },
  { label:'Bergabung Sejak', icon:'calendar_month', value:'15 Januari 2023' },
]
function handleLogout() { auth.logout(); router.push('/portal/login') }
function openEdit() {
  editForm.name = user.value?.name || ''; editForm.phone = '+62 812-3456-7890'
  editForm.email = 'agus.setiawan@email.com'; editForm.address = 'Jl. Melati No. 12, RT 03/RW 01'
  showEditModal.value = true
}
function submitEdit() {
  // ponytail: mock — swap real API + update auth store
  editSubmitted.value = true
  setTimeout(() => { showEditModal.value = false; editSubmitted.value = false }, 1500)
}
function submitPassword() {
  if (!passForm.lama || passForm.baru !== passForm.konfirmasi) return
  // ponytail: mock — swap real API
  passSubmitted.value = true
  setTimeout(() => { showPasswordModal.value = false; passSubmitted.value = false; passForm.lama=''; passForm.baru=''; passForm.konfirmasi='' }, 1500)
}
</script>
