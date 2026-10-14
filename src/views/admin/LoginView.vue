
<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="relative w-full max-w-[460px]">
      <div class="absolute -top-14 -left-12 w-48 h-48 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-16 -right-10 w-52 h-52 rounded-full bg-tertiary-fixed-dim/25 blur-3xl pointer-events-none"></div>
      <div class="relative bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_-5px_rgba(37,99,235,0.07)] p-6 sm:p-8 flex flex-col gap-6">
        <div class="flex flex-col items-center text-center gap-1">
          <div class="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container shadow-sm mb-2">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: &apos;FILL&apos; 1">hub</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="font-headline-md text-headline-md text-on-surface tracking-tight">NetOps Lite</span>
            <span class="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-primary-container font-semibold uppercase">Core</span>
          </div>
          <h1 class="font-headline-sm text-headline-sm text-text-primary font-bold tracking-tight mt-2">Masuk ke Admin Portal</h1>
          <p class="font-body-sm text-body-sm text-secondary max-w-xs">Kelola operasional jaringan, pelanggan, paket, dan tagihan ISP</p>
        </div>
        <div class="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low">
          <span class="material-symbols-outlined text-primary-container text-[18px] mt-0.5 shrink-0">verified_user</span>
          <div>
            <p class="font-label-sm text-label-sm text-text-primary font-semibold">Hak Akses Terproteksi</p>
            <p class="font-body-sm text-body-sm text-secondary text-[11px] leading-tight mt-0.5">Pastikan Anda memiliki izin akses <b>Super Admin</b> atau <b>NOC Operator</b> aktif.</p>
          </div>
        </div>
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-text-primary" for="admin-email">Email Admin</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">alternate_email</span>
              <input v-model="form.email" id="admin-email" type="email" autocomplete="username"
                placeholder="admin@netops.id" required
                class="w-full h-10 pl-10 pr-3.5 rounded-lg bg-surface-container-lowest border border-border-default text-text-primary font-body-md placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label class="font-label-md text-label-md text-text-primary" for="admin-password">Kata Sandi</label>
            </div>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">lock</span>
              <input v-model="form.password" id="admin-password" :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password" placeholder="••••••••" required
                class="w-full h-10 pl-10 pr-10 rounded-lg bg-surface-container-lowest border border-border-default text-text-primary font-body-md placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text-primary">
                <span class="material-symbols-outlined text-[18px]">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>
          <p v-if="errorMsg" role="alert" class="font-body-sm text-body-sm text-status-danger-text bg-status-danger-bg px-3 py-2 rounded-lg">{{ errorMsg }}</p>
          <button type="submit" :disabled="loading"
            class="h-11 rounded-lg bg-primary-container text-on-primary font-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm disabled:opacity-70">
            <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': loading }">{{ loading ? 'progress_activity' : 'login' }}</span>
            <span>{{ loading ? 'Memverifikasi...' : 'Masuk ke Admin Portal' }}</span>
          </button>
        </form>
        <div class="flex flex-col items-center gap-2">
          <button @click="fillDemo" type="button"
            :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg border font-label-md transition-all', demoFilled ? 'border-status-success-text/40 text-status-success-text bg-status-success-bg' : 'border-border-default text-text-body']">
            <span class="material-symbols-outlined text-[16px]">{{ demoFilled ? 'check_circle' : 'touch_app' }}</span>
            <span>{{ demoFilled ? 'Kredensial Siap' : 'Demo Otomatis' }}</span>
          </button>
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-status-success-bg text-status-success-text font-label-sm font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-status-success-text animate-pulse"></span>
            <span>Enkripsi TLS 1.3 Aktif</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth   = useAuthStore()
const router = useRouter()
const form         = reactive({ email: '', password: '' })
const loading      = ref(false)
const errorMsg     = ref('')
const showPassword = ref(false)
const demoFilled   = ref(false)

function fillDemo() {
  form.email    = 'budi.santoso@netops.id'
  form.password = 'NetOpsNOC#2025Secure'
  demoFilled.value = true
  setTimeout(() => { demoFilled.value = false }, 2500)
}

async function handleSubmit() {
  if (!form.email || !form.password) return
  errorMsg.value = ''
  loading.value  = true
  await new Promise(r => setTimeout(r, 1200)) // ponytail: mock — swap real API
  loading.value  = false
  auth.loginAdmin({ email: form.email })
  router.push('/admin/dashboard')
}
</script>
