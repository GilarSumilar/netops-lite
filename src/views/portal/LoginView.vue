<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="relative w-full max-w-[420px]">
      <div class="absolute -top-12 -left-10 w-44 h-44 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-14 -right-8 w-48 h-48 rounded-full bg-tertiary-fixed-dim/25 blur-3xl pointer-events-none"></div>
      <div class="relative bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_-5px_rgba(37,99,235,0.07)] p-6 sm:p-8 flex flex-col gap-5">
        <div class="flex flex-col items-center text-center gap-1">
          <div class="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center shadow-sm mb-1">
            <span class="material-symbols-outlined text-on-primary text-[26px]">router</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="font-headline-md text-headline-md text-on-surface tracking-tight">NetOps</span>
            <span class="font-headline-md text-headline-md text-primary font-bold">Lite</span>
          </div>
          <h1 class="font-headline-sm text-headline-sm text-text-primary font-bold tracking-tight mt-1">Portal Pelanggan</h1>
          <p class="font-body-sm text-body-sm text-secondary max-w-xs">Pantau tagihan, layanan, dan status koneksi internet Anda</p>
        </div>
        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-text-primary" for="portal-id">ID Pelanggan / Email</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">badge</span>
              <input v-model="form.identifier" id="portal-id" type="text" autocomplete="username"
                placeholder="CUST-001 atau email@domain.com" required
                class="w-full h-10 pl-10 pr-3.5 rounded-lg bg-surface-container-lowest border border-border-default text-text-primary font-body-md placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-text-primary" for="portal-pass">Kata Sandi</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">lock</span>
              <input v-model="form.password" id="portal-pass" :type="showPass ? 'text' : 'password'"
                autocomplete="current-password" placeholder="••••••••" required
                class="w-full h-10 pl-10 pr-10 rounded-lg bg-surface-container-lowest border border-border-default text-text-primary font-body-md placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all" />
              <button type="button" @click="showPass=!showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text-primary" aria-label="Toggle sandi">
                <span class="material-symbols-outlined text-[18px]">{{ showPass ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>
          <p v-if="errorMsg" role="alert" class="font-body-sm text-body-sm text-status-danger-text bg-status-danger-bg px-3 py-2 rounded-lg">{{ errorMsg }}</p>
          <button type="submit" :disabled="loading"
            class="h-11 rounded-lg bg-primary-container text-on-primary font-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm disabled:opacity-70">
            <span class="material-symbols-outlined text-[18px]" :class="{'animate-spin':loading}">{{ loading ? 'progress_activity' : 'login' }}</span>
            <span>{{ loading ? 'Memverifikasi...' : 'Masuk ke Portal' }}</span>
          </button>
        </form>
        <div class="flex flex-col items-center gap-2">
          <button @click="fillDemo" type="button"
            :class="['flex items-center gap-1.5 px-4 py-2 rounded-lg border font-label-md transition-all', demoFilled ? 'border-status-success-text/40 text-status-success-text bg-status-success-bg' : 'border-border-default text-text-body']">
            <span class="material-symbols-outlined text-[16px]">{{ demoFilled ? 'check_circle' : 'touch_app' }}</span>
            <span>{{ demoFilled ? 'Siap masuk' : 'Demo Pelanggan' }}</span>
          </button>
          <p class="font-body-sm text-body-sm text-text-muted text-center">
            Belum punya akun? <RouterLink to="/portal/register" class="text-primary-container hover:underline font-semibold">Daftar sekarang</RouterLink>
          </p>
          <p class="font-body-sm text-body-sm text-text-muted text-center">
            Masalah akses? <a class="text-primary-container hover:underline cursor-pointer">Hubungi ISP</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore(), router = useRouter()
const form = reactive({ identifier: '', password: '' })
const loading = ref(false), errorMsg = ref(''), showPass = ref(false), demoFilled = ref(false)
function fillDemo() {
  form.identifier = 'agus@example.com'; form.password = 'pelanggan123'
  demoFilled.value = true; setTimeout(() => { demoFilled.value = false }, 2500)
}
async function handleSubmit() {
  if (!form.identifier || !form.password) return
  errorMsg.value = ''; loading.value = true
  try {
    await auth.loginCustomer({ identifier: form.identifier, password: form.password })
    router.push(typeof router.currentRoute.value.query.redirect === 'string'
      ? router.currentRoute.value.query.redirect
      : '/portal/beranda')
  } catch (error) {
    errorMsg.value = error.message
  } finally {
    loading.value = false
  }
}
</script>
