<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="relative w-full max-w-[460px]">
      <div class="absolute -top-12 -left-10 w-48 h-48 rounded-full bg-primary-fixed-dim/30 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-14 -right-8 w-52 h-52 rounded-full bg-tertiary-fixed-dim/25 blur-3xl pointer-events-none"></div>
      <div class="relative bg-surface-container-lowest rounded-xl shadow-[0_10px_30px_-5px_rgba(37,99,235,0.07)] p-6 sm:p-8 flex flex-col gap-5">

        <!-- Header -->
        <div class="flex flex-col items-center text-center gap-1">
          <div class="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center shadow-sm mb-1">
            <span class="material-symbols-outlined text-on-primary text-[26px]">router</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="font-headline-md text-headline-md text-on-surface tracking-tight">NetOps</span>
            <span class="font-headline-md text-headline-md text-primary font-bold">Lite</span>
          </div>
          <h1 class="font-headline-sm text-headline-sm text-text-primary font-bold tracking-tight mt-1">Daftar Akun Pelanggan</h1>
          <p class="font-body-sm text-body-sm text-secondary max-w-xs">Buat akun baru untuk memantau tagihan dan status koneksi internet Anda</p>
        </div>

        <!-- Success state -->
        <div v-if="successMsg" class="flex flex-col items-center gap-3 py-6 px-4 rounded-lg bg-status-success-bg border border-status-success-text/20">
          <span class="material-symbols-outlined text-status-success-text text-[40px]">check_circle</span>
          <p class="font-label-md text-label-md text-status-success-text text-center font-semibold">{{ successMsg }}</p>
          <p class="font-body-sm text-body-sm text-text-body text-center">Anda akan diarahkan ke halaman masuk…</p>
        </div>

        <!-- Form -->
        <form v-if="!successMsg" class="flex flex-col gap-4" @submit.prevent="handleSubmit" novalidate>

          <!-- Nama Lengkap -->
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-text-primary" for="reg-name">Nama Lengkap</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">person</span>
              <input v-model.trim="form.name" id="reg-name" type="text" autocomplete="name"
                placeholder="Contoh: Budi Santoso" :class="inputClass(errors.name)" @blur="validateName" />
            </div>
            <p v-if="errors.name" class="font-body-sm text-body-sm text-status-danger-text flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">error</span>{{ errors.name }}
            </p>
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-text-primary" for="reg-email">Email</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">alternate_email</span>
              <input v-model.trim="form.email" id="reg-email" type="email" autocomplete="email"
                placeholder="email@domain.com" :class="inputClass(errors.email)" @blur="validateEmail" />
            </div>
            <p v-if="errors.email" class="font-body-sm text-body-sm text-status-danger-text flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">error</span>{{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-text-primary" for="reg-password">Kata Sandi</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">lock</span>
              <input v-model="form.password" id="reg-password" :type="showPass ? 'text' : 'password'"
                autocomplete="new-password" placeholder="Minimal 8 karakter"
                :class="inputClass(errors.password)" @blur="validatePassword" />
              <button type="button" @click="showPass = !showPass"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text-primary" aria-label="Toggle kata sandi">
                <span class="material-symbols-outlined text-[18px]">{{ showPass ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <!-- Strength indicator -->
            <div v-if="form.password" class="flex gap-1 mt-0.5">
              <div v-for="i in 4" :key="i" :class="['h-1 flex-1 rounded-full transition-all duration-300', strengthBarClass(i)]"></div>
            </div>
            <p v-if="form.password && !errors.password" class="font-body-sm text-body-sm" :class="strengthLabelClass">
              Kekuatan sandi: <span class="font-semibold">{{ strengthLabel }}</span>
            </p>
            <p v-if="errors.password" class="font-body-sm text-body-sm text-status-danger-text flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">error</span>{{ errors.password }}
            </p>
          </div>

          <!-- Konfirmasi Password -->
          <div class="flex flex-col gap-1.5">
            <label class="font-label-md text-label-md text-text-primary" for="reg-confirm">Konfirmasi Kata Sandi</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none">lock_reset</span>
              <input v-model="form.confirmPassword" id="reg-confirm" :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password" placeholder="Ulangi kata sandi"
                :class="inputClass(errors.confirmPassword)" @blur="validateConfirmPassword" />
              <button type="button" @click="showConfirm = !showConfirm"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-text-primary" aria-label="Toggle konfirmasi">
                <span class="material-symbols-outlined text-[18px]">{{ showConfirm ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="font-body-sm text-body-sm text-status-danger-text flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">error</span>{{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Global Error -->
          <p v-if="globalError" role="alert"
            class="font-body-sm text-body-sm text-status-danger-text bg-status-danger-bg px-3 py-2 rounded-lg flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]">warning</span>{{ globalError }}
          </p>

          <!-- Submit -->
          <button type="submit" :disabled="loading"
            class="h-11 rounded-lg bg-primary-container text-on-primary font-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm disabled:opacity-70 mt-1">
            <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': loading }">
              {{ loading ? 'progress_activity' : 'person_add' }}
            </span>
            <span>{{ loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang' }}</span>
          </button>
        </form>

        <!-- Footer -->
        <div v-if="!successMsg" class="flex flex-col items-center">
          <p class="font-body-sm text-body-sm text-text-muted text-center">
            Sudah punya akun?
            <RouterLink to="/portal/login" class="text-primary-container hover:underline font-semibold">Masuk di sini</RouterLink>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const auth   = useAuthStore()
const router = useRouter()
const { showSuccess, showError } = useToast()

// ── Form & Error State ───────────────────────────────────
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const errors = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const loading     = ref(false)
const globalError = ref('')
const successMsg  = ref('')
const showPass    = ref(false)
const showConfirm = ref(false)

// ── Input class helper ───────────────────────────────────
function inputClass(hasError) {
  const base = 'w-full h-10 pl-10 pr-10 rounded-lg bg-surface-container-lowest border font-body-md text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all'
  return hasError
    ? `${base} border-status-danger-text focus:ring-status-danger-text/20 focus:border-status-danger-text`
    : `${base} border-border-default focus:ring-primary-container/20 focus:border-primary-container`
}

// ── Password Strength ────────────────────────────────────
const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8)                        score++
  if (p.length >= 12)                       score++
  if (/[A-Z]/.test(p) && /[0-9]/.test(p))  score++
  if (/[^A-Za-z0-9]/.test(p))              score++
  return score
})

const strengthLabel = computed(() =>
  ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][passwordStrength.value] ?? 'Lemah'
)

const strengthLabelClass = computed(() => ({
  'text-status-danger-text':  passwordStrength.value === 1,
  'text-status-warning-text': passwordStrength.value === 2,
  'text-status-success-text': passwordStrength.value >= 3,
}))

function strengthBarClass(index) {
  const s = passwordStrength.value
  if (index > s) return 'bg-border-default'
  if (s === 1)   return 'bg-status-danger-text'
  if (s === 2)   return 'bg-status-warning-text'
  return 'bg-status-success-text'
}

// ── Validators ───────────────────────────────────────────
function validateName() {
  errors.name = form.name.length < 2 ? 'Nama lengkap minimal 2 karakter.' : ''
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email)                       errors.email = 'Email tidak boleh kosong.'
  else if (!emailRegex.test(form.email)) errors.email = 'Format email tidak valid.'
  else                                   errors.email = ''
}

function validatePassword() {
  if (!form.password)                errors.password = 'Kata sandi tidak boleh kosong.'
  else if (form.password.length < 8) errors.password = 'Kata sandi minimal 8 karakter.'
  else                               errors.password = ''
  if (form.confirmPassword) validateConfirmPassword()
}

function validateConfirmPassword() {
  if (!form.confirmPassword)
    errors.confirmPassword = 'Konfirmasi kata sandi tidak boleh kosong.'
  else if (form.confirmPassword !== form.password)
    errors.confirmPassword = 'Konfirmasi kata sandi tidak cocok.'
  else
    errors.confirmPassword = ''
}

function validateAll() {
  validateName(); validateEmail(); validatePassword(); validateConfirmPassword()
  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

// ── Submit ───────────────────────────────────────────────
async function handleSubmit() {
  globalError.value = ''
  if (!validateAll()) return

  loading.value = true
  try {
    await auth.registerCustomer({ name: form.name, email: form.email, password: form.password })

    successMsg.value = `Pendaftaran berhasil! Selamat datang, ${form.name}.`
    showSuccess(`Akun berhasil dibuat untuk ${form.email}`)

    setTimeout(() => router.push('/portal/login'), 2500)
  } catch (err) {
    globalError.value = err.message || 'Terjadi kesalahan. Silakan coba lagi.'
    showError(globalError.value)
  } finally {
    loading.value = false
  }
}
</script>
