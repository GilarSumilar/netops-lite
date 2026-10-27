<template>
  <div class="flex min-w-0 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="font-headline-lg text-headline-lg-mobile text-text-primary sm:text-headline-lg">Akun &amp; Role Staf</h1>
        <p class="font-body-sm text-body-sm text-text-body mt-0.5">Kelola akses admin dan teknisi.</p>
      </div>
      <AppButton @click="openCreate" :full="true" class="sm:w-auto">
        <span class="material-symbols-outlined text-lg">person_add</span>
        Tambah Akun
      </AppButton>
    </div>

    <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>

    <AppDataTable :columns="columns" :rows="accounts" :show-page-size="true">
      <template #cell-role="{ value }">
        <span class="inline-flex rounded-full bg-primary-fixed px-2.5 py-0.5 font-label-sm capitalize text-primary">{{ roleLabel[value] }}</span>
      </template>
      <template #cell-active="{ value }">
        <span :class="['inline-flex rounded-full px-2.5 py-0.5 font-label-sm', value ? 'bg-status-success-bg text-status-success-text' : 'bg-status-neutral-bg text-status-neutral-text']">
          {{ value ? 'Aktif' : 'Nonaktif' }}
        </span>
      </template>
      <template #actions="{ row }">
        <button @click="openEdit(row)" class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-container hover:text-text-primary" title="Edit akun">
          <span class="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button v-if="row.active" @click="deactivate(row)" class="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-status-danger-bg hover:text-status-danger-text" title="Nonaktifkan akun">
          <span class="material-symbols-outlined text-[18px]">person_off</span>
        </button>
      </template>
    </AppDataTable>

    <AppModal v-model="showModal" :title="editTarget ? 'Edit Akun Staf' : 'Tambah Akun Staf'">
      <div class="flex flex-col gap-3">
        <AppInput v-model="form.name" label="Nama" placeholder="Nama staf" />
        <AppInput v-model="form.email" label="Email" type="email" placeholder="staf@netops.id" />
        <AppSelect v-model="form.role" label="Role">
          <option value="admin">Admin</option>
          <option value="teknisi">Teknisi</option>
        </AppSelect>
        <label v-if="editTarget" class="flex items-center gap-2 font-body-md text-text-primary">
          <input v-model="form.active" type="checkbox" class="accent-primary-container" />
          Akun aktif
        </label>
        <AppInput v-model="form.password" :label="editTarget ? 'Kata Sandi Baru (opsional)' : 'Kata Sandi'" type="password" placeholder="Minimal 8 karakter" />
        <p v-if="formError" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ formError }}</p>
      </div>
      <div class="flex gap-3">
        <AppButton variant="outline" :full="true" @click="showModal = false">Batal</AppButton>
        <AppButton :full="true" @click="saveAccount">{{ editTarget ? 'Simpan Perubahan' : 'Buat Akun' }}</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppDataTable from '@/components/AppDataTable.vue'
import AppInput from '@/components/AppInput.vue'
import AppModal from '@/components/AppModal.vue'
import AppSelect from '@/components/AppSelect.vue'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const accounts = ref([])
const showModal = ref(false)
const editTarget = ref(null)
const errorMsg = ref('')
const formError = ref('')
const form = reactive({ name: '', email: '', role: 'teknisi', password: '', active: true })
const roleLabel = { admin: 'Admin', teknisi: 'Teknisi' }
const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'active', label: 'Status' },
]

onMounted(loadAccounts)

async function loadAccounts() {
  try {
    accounts.value = await api.accounts()
  } catch (error) {
    errorMsg.value = `Gagal memuat akun staf: ${error.message}`
  }
}

function resetForm() {
  editTarget.value = null
  formError.value = ''
  Object.assign(form, { name: '', email: '', role: 'teknisi', password: '', active: true })
}

function openCreate() {
  resetForm()
  showModal.value = true
}

function openEdit(account) {
  resetForm()
  editTarget.value = account
  Object.assign(form, { name: account.name, email: account.email, role: account.role, password: '', active: account.active })
  showModal.value = true
}

async function saveAccount() {
  if (form.name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    formError.value = 'Nama dan email valid wajib diisi.'
    return
  }
  if (!editTarget.value && form.password.length < 8) {
    formError.value = 'Kata sandi minimal 8 karakter.'
    return
  }
  if (form.password && form.password.length < 8) {
    formError.value = 'Kata sandi minimal 8 karakter.'
    return
  }
  try {
    formError.value = ''
    errorMsg.value = ''
    const payload = { name: form.name.trim(), email: form.email.trim(), role: form.role }
    const account = editTarget.value
      ? await api.updateAccount(editTarget.value.accountId, { ...payload, active: form.active, ...(form.password ? { password: form.password } : {}) })
      : await api.createAccount({ ...payload, password: form.password })
    if (editTarget.value) {
      Object.assign(editTarget.value, account)
      if (auth.user?.accountId === account.accountId) auth.user = account
    } else {
      accounts.value.push(account)
    }
    showModal.value = false
    resetForm()
  } catch (error) {
    formError.value = error.message
  }
}

async function deactivate(account) {
  if (!window.confirm(`Nonaktifkan akun ${account.name}?`)) return
  try {
    errorMsg.value = ''
    Object.assign(account, await api.deactivateAccount(account.accountId))
  } catch (error) {
    errorMsg.value = `Gagal menonaktifkan akun: ${error.message}`
  }
}
</script>
