<template>
  <div class="flex min-w-0 flex-col gap-4 p-4 sm:gap-6 sm:p-6">

    <!-- Page Header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2.5 h-2.5 rounded-full"
            :class="isConnected ? 'bg-status-success-text' : 'bg-status-danger-text'"></span>
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">
            {{ isConnected ? 'Router Terhubung' : 'Router Tidak Terhubung' }}
          </span>
        </div>
        <h1 class="font-headline-lg text-headline-lg-mobile text-text-primary sm:text-headline-lg">
          Manajemen Router
        </h1>
        <p class="font-body-md text-body-md text-text-body mt-0.5">
          Monitoring MikroTik, sesi aktif PPPoE/Hotspot, dan konfigurasi koneksi.
        </p>
      </div>
      <AppButton variant="secondary" size="sm" @click="refreshAll" :disabled="isAnyLoading">
        <span class="material-symbols-outlined text-[18px]"
          :class="{ 'animate-spin': isAnyLoading }">refresh</span>
        <span>Refresh</span>
      </AppButton>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 border-b border-border-subtle">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        :class="['flex items-center gap-2 px-4 py-2.5 font-label-lg text-label-lg border-b-2 transition-colors -mb-px',
          activeTab === tab.key
            ? 'border-primary-container text-primary-container'
            : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-default']">
        <span class="material-symbols-outlined text-[18px]">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- ═══════════════ TAB 1: MONITORING ═══════════════ -->
    <div v-if="activeTab === 'monitoring'" class="flex flex-col gap-6">

      <p v-if="routerStore.errorStatus" role="alert"
        class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">error</span>{{ routerStore.errorStatus }}
      </p>

      <!-- Skeleton -->
      <div v-if="routerStore.loadingStatus && !routerStore.status"
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n"
          class="bg-surface-base border border-border-subtle rounded-xl p-5 animate-pulse h-28"></div>
      </div>

      <!-- Stat Cards -->
      <div v-else-if="routerStore.status" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <!-- CPU Load -->
        <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <span class="font-body-sm text-body-sm text-text-muted">CPU Load</span>
            <div class="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px] text-primary-container">memory</span>
            </div>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="font-currency-stat text-currency-stat text-text-primary">{{ routerStore.status.cpuLoad }}</span>
            <span class="font-body-md text-body-md text-text-muted">%</span>
          </div>
          <div class="mt-3 h-1.5 rounded-full bg-surface-container-low overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700"
              :class="routerStore.status.cpuLoad > 80 ? 'bg-status-danger-text' : routerStore.status.cpuLoad > 60 ? 'bg-status-warning-text' : 'bg-status-success-text'"
              :style="{ width: routerStore.status.cpuLoad + '%' }"></div>
          </div>
          <p class="mt-1.5 font-body-sm text-body-sm text-text-muted">
            {{ routerStore.status.cpuCount }} Core · {{ routerStore.status.cpuFrequency }} MHz
          </p>
        </div>

        <!-- RAM -->
        <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <span class="font-body-sm text-body-sm text-text-muted">Memori (RAM)</span>
            <div class="w-9 h-9 rounded-lg bg-status-warning-bg flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px] text-status-warning-text">storage</span>
            </div>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="font-currency-stat text-currency-stat text-text-primary">{{ routerStore.ramPercent }}</span>
            <span class="font-body-md text-body-md text-text-muted">%</span>
          </div>
          <div class="mt-3 h-1.5 rounded-full bg-surface-container-low overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700"
              :class="routerStore.ramPercent > 85 ? 'bg-status-danger-text' : routerStore.ramPercent > 70 ? 'bg-status-warning-text' : 'bg-status-success-text'"
              :style="{ width: routerStore.ramPercent + '%' }"></div>
          </div>
          <p class="mt-1.5 font-body-sm text-body-sm text-text-muted">
            {{ routerStore.status.totalMemory - routerStore.status.freeMemory }} MB / {{ routerStore.status.totalMemory }} MB
          </p>
        </div>

        <!-- Uptime -->
        <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <span class="font-body-sm text-body-sm text-text-muted">Uptime</span>
            <div class="w-9 h-9 rounded-lg bg-status-success-bg flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px] text-status-success-text">schedule</span>
            </div>
          </div>
          <div class="font-headline-md text-headline-md text-text-primary break-all">
            {{ routerStore.status.uptime }}
          </div>
          <p class="mt-3 font-body-sm text-body-sm text-text-muted">
            RouterOS {{ routerStore.status.routerOsVersion }}
          </p>
        </div>

        <!-- Temperature -->
        <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between mb-3">
            <span class="font-body-sm text-body-sm text-text-muted">Suhu Perangkat</span>
            <div class="w-9 h-9 rounded-lg flex items-center justify-center"
              :class="routerStore.status.temperature > 65 ? 'bg-status-danger-bg' : 'bg-surface-container-low'">
              <span class="material-symbols-outlined text-[18px]"
                :class="routerStore.status.temperature > 65 ? 'text-status-danger-text' : 'text-text-muted'">thermostat</span>
            </div>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="font-currency-stat text-currency-stat text-text-primary">{{ routerStore.status.temperature }}</span>
            <span class="font-body-md text-body-md text-text-muted">°C</span>
          </div>
          <p class="mt-3 font-body-sm text-body-sm text-text-muted">{{ routerStore.status.boardName }}</p>
        </div>
      </div>

      <!-- Device Info -->
      <div v-if="routerStore.status" class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm">
        <h3 class="font-headline-sm text-headline-sm text-text-primary mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-primary-container">router</span>
          Informasi Perangkat
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="info in deviceInfo" :key="info.label">
            <p class="font-label-sm text-label-sm text-text-muted uppercase tracking-wide">{{ info.label }}</p>
            <p class="font-body-md text-body-md text-text-primary mt-0.5 font-medium">{{ info.value }}</p>
          </div>
        </div>
      </div>

      <!-- Live Traffic -->
      <div class="bg-surface-base border border-border-subtle rounded-xl p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-headline-sm text-headline-sm text-text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary-container">show_chart</span>
            Live Traffic Interface
          </h3>
          <div v-if="autoRefresh" class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-status-success-text animate-pulse"></span>
            <span class="font-label-sm text-label-sm text-status-success-text">Live</span>
          </div>
        </div>

        <p v-if="routerStore.errorTraffic" role="alert"
          class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text mb-4">
          {{ routerStore.errorTraffic }}
        </p>

        <div v-if="routerStore.loadingTraffic && !routerStore.traffic" class="space-y-3">
          <div v-for="n in 3" :key="n" class="h-20 bg-surface-container-low rounded-lg animate-pulse"></div>
        </div>

        <div v-else-if="routerStore.traffic" class="flex flex-col gap-3">
          <div v-for="iface in routerStore.traffic.interfaces" :key="iface.name"
            class="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-border-subtle hover:bg-surface-container-low transition-colors">
            <div class="flex items-center gap-3 sm:w-52 shrink-0">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                :class="iface.running ? 'bg-status-success-bg' : 'bg-status-neutral-bg'">
                <span class="material-symbols-outlined text-[16px]"
                  :class="iface.running ? 'text-status-success-text' : 'text-status-neutral-text'">
                  {{ iface.name.startsWith('pppoe') ? 'cable' : 'lan' }}
                </span>
              </div>
              <div class="min-w-0">
                <p class="font-label-md text-label-md text-text-primary font-bold truncate">{{ iface.name }}</p>
                <p class="font-body-sm text-body-sm text-text-muted truncate">{{ iface.comment }}</p>
              </div>
            </div>
            <div class="flex flex-1 gap-6">
              <div class="flex-1">
                <div class="flex items-center gap-1 mb-1">
                  <span class="material-symbols-outlined text-[13px] text-status-success-text">arrow_upward</span>
                  <span class="font-label-sm text-label-sm text-text-muted">TX Upload</span>
                </div>
                <p class="font-headline-sm text-headline-sm text-text-primary">{{ formatBps(iface.txBps) }}</p>
                <div class="mt-1.5 h-1 rounded-full bg-surface-container-low overflow-hidden">
                  <div class="h-full rounded-full bg-status-success-text transition-all duration-500"
                    :style="{ width: Math.min(100, (iface.txBps / 250_000_000) * 100) + '%' }"></div>
                </div>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-1 mb-1">
                  <span class="material-symbols-outlined text-[13px] text-primary-container">arrow_downward</span>
                  <span class="font-label-sm text-label-sm text-text-muted">RX Download</span>
                </div>
                <p class="font-headline-sm text-headline-sm text-text-primary">{{ formatBps(iface.rxBps) }}</p>
                <div class="mt-1.5 h-1 rounded-full bg-surface-container-low overflow-hidden">
                  <div class="h-full rounded-full bg-primary-container transition-all duration-500"
                    :style="{ width: Math.min(100, (iface.rxBps / 250_000_000) * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Auto-refresh toggle -->
        <div class="mt-4 flex items-center justify-between">
          <p class="font-body-sm text-body-sm text-text-muted">Diperbarui: {{ lastRefreshedLabel }}</p>
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <span class="font-label-md text-label-md text-text-body">Auto-refresh (5 dtk)</span>
            <button
              type="button"
              @click="toggleAutoRefresh"
              :class="['relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                autoRefresh ? 'bg-primary-container' : 'bg-border-default']"
              role="switch" :aria-checked="autoRefresh"
            >
              <span :class="['inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform',
                autoRefresh ? 'translate-x-[1.125rem]' : 'translate-x-0.5']"></span>
            </button>
          </label>
        </div>
      </div>
    </div>
    <!-- End Tab 1 -->

    <!-- ═══════════════ TAB 2: ACTIVE SESSIONS ═══════════════ -->
    <div v-if="activeTab === 'sessions'" class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px] text-primary-container">people</span>
          </div>
          <div>
            <p class="font-headline-sm text-headline-sm text-text-primary">Sesi Aktif PPPoE / Hotspot</p>
            <p class="font-body-sm text-body-sm text-text-muted">
              Total <span class="text-primary-container font-bold">{{ routerStore.sessions.length }}</span> sesi online
            </p>
          </div>
        </div>
        <AppButton variant="secondary" size="sm" @click="routerStore.fetchSessions()" :disabled="routerStore.loadingSessions">
          <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': routerStore.loadingSessions }">refresh</span>
          Refresh
        </AppButton>
      </div>

      <p v-if="routerStore.errorSessions" role="alert"
        class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">error</span>{{ routerStore.errorSessions }}
      </p>

      <!-- Skeleton -->
      <div v-if="routerStore.loadingSessions && !routerStore.sessions.length"
        class="bg-surface-base border border-border-subtle rounded-xl overflow-hidden">
        <div v-for="n in 5" :key="n" class="flex gap-4 px-4 py-3 border-b border-border-subtle last:border-0">
          <div v-for="m in 5" :key="m" class="h-4 rounded bg-surface-container-low flex-1 animate-pulse"></div>
        </div>
      </div>

      <!-- AppDataTable -->
      <AppDataTable
        v-else
        :columns="sessionColumns"
        :rows="routerStore.sessions"
        :searchable="true"
        search-placeholder="Cari username atau IP..."
        :search-keys="['name', 'address', 'callerId']"
        row-id-key="id"
      >
        <!-- Service badge slot -->
        <template #cell-service="{ value }">
          <span :class="[
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm',
            value === 'pppoe' ? 'bg-primary-container/10 text-primary-container' : 'bg-status-warning-bg text-status-warning-text',
          ]">
            <span class="material-symbols-outlined text-[12px]">{{ value === 'pppoe' ? 'cable' : 'wifi' }}</span>
            {{ value.toUpperCase() }}
          </span>
        </template>

        <!-- Caller ID slot -->
        <template #cell-callerId="{ value }">
          <span class="font-body-sm text-body-sm text-text-muted font-mono">{{ value }}</span>
        </template>

        <!-- Uptime slot -->
        <template #cell-uptime="{ value }">
          <span class="inline-flex items-center gap-1 font-body-sm text-body-sm text-status-success-text">
            <span class="w-1.5 h-1.5 rounded-full bg-status-success-text"></span>
            {{ value }}
          </span>
        </template>

        <!-- Actions: Kick slot -->
        <template #actions="{ row }">
          <AppButton
            v-if="auth.isAdmin"
            variant="danger"
            size="sm"
            @click="openKickModal(row)"
          >
            <span class="material-symbols-outlined text-[16px]">link_off</span>
            Kick
          </AppButton>
        </template>
      </AppDataTable>
    </div>
    <!-- End Tab 2 -->

    <!-- ═══════════════ TAB 3: SETTINGS ═══════════════ -->
    <div v-if="activeTab === 'settings'" class="max-w-2xl">
      <div class="bg-surface-base border border-border-subtle rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px] text-primary-container">settings_ethernet</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-headline-sm text-text-primary">Pengaturan Koneksi MikroTik</h3>
            <p class="font-body-sm text-body-sm text-text-muted">Kredensial MikroTik API (RouterOS API Port)</p>
          </div>
        </div>

        <p v-if="routerStore.errorSettings" role="alert"
          class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">error</span>{{ routerStore.errorSettings }}
        </p>
        <p v-if="routerStore.successSettings" role="status"
          class="rounded-lg bg-status-success-bg px-3 py-2 font-body-sm text-status-success-text flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">check_circle</span>{{ routerStore.successSettings }}
        </p>

        <form @submit.prevent="handleSaveSettings" class="flex flex-col gap-4" novalidate>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <AppInput
                v-model="settingsForm.host"
                id="router-host"
                label="IP Address Router"
                placeholder="192.168.88.1"
                :disabled="!auth.isAdmin || routerStore.loadingSettings"
              />
            </div>
            <AppInput
              v-model="settingsForm.port"
              id="router-port"
              label="API Port"
              placeholder="8728"
              :disabled="!auth.isAdmin || routerStore.loadingSettings"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppInput
              v-model="settingsForm.username"
              id="router-username"
              label="Username API"
              placeholder="admin"
              :disabled="!auth.isAdmin || routerStore.loadingSettings"
            />
            <AppInput
              v-model="settingsForm.password"
              id="router-password"
              label="Password API"
              type="password"
              placeholder="Kosong = tidak diubah"
              :disabled="!auth.isAdmin || routerStore.loadingSettings"
            />
          </div>

          <!-- SSL toggle -->
          <div class="flex items-center justify-between p-4 rounded-lg border border-border-subtle bg-surface-container-lowest">
            <div>
              <p class="font-label-md text-label-md text-text-primary">Gunakan SSL / API-SSL</p>
              <p class="font-body-sm text-body-sm text-text-muted">Port default SSL: 8729</p>
            </div>
            <button
              type="button"
              @click="settingsForm.useSSL = !settingsForm.useSSL"
              :disabled="!auth.isAdmin || routerStore.loadingSettings"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50',
                settingsForm.useSSL ? 'bg-primary-container' : 'bg-border-default',
              ]"
              role="switch"
              :aria-checked="settingsForm.useSSL"
            >
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                settingsForm.useSSL ? 'translate-x-6' : 'translate-x-1',
              ]"></span>
            </button>
          </div>

          <div class="flex gap-3 pt-1">
            <AppButton
              v-if="auth.isAdmin"
              type="submit"
              :disabled="routerStore.loadingSettings || !settingsForm.host"
            >
              <span class="material-symbols-outlined text-[18px]"
                :class="{ 'animate-spin': routerStore.loadingSettings }">
                {{ routerStore.loadingSettings ? 'refresh' : 'save' }}
              </span>
              {{ routerStore.loadingSettings ? 'Menyimpan...' : 'Simpan Pengaturan' }}
            </AppButton>
            <AppButton variant="secondary" type="button" @click="resetSettingsForm">
              <span class="material-symbols-outlined text-[18px]">restart_alt</span>
              Reset
            </AppButton>
          </div>
        </form>
      </div>
    </div>
    <!-- End Tab 3 -->

    <!-- ═══════════════ MODAL KICK PPPOE ═══════════════ -->
    <AppModal v-model="showKickModal" title="Konfirmasi Putus Sesi" max-width="sm">
      <div class="flex flex-col gap-5">
        <div class="flex items-start gap-4 p-4 bg-status-danger-bg rounded-xl">
          <div class="w-10 h-10 rounded-lg bg-status-danger-text/10 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px] text-status-danger-text">link_off</span>
          </div>
          <div>
            <p class="font-label-md text-label-md text-status-danger-text font-bold">Putus Paksa Sesi?</p>
            <p class="font-body-sm text-body-sm text-text-body mt-1">
              Sesi <span class="font-bold text-text-primary">{{ kickTarget?.name }}</span> akan
              segera diputus. Pelanggan harus reconnect kembali.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="p-3 bg-surface-container-low rounded-lg">
            <p class="font-label-sm text-label-sm text-text-muted mb-0.5">IP Address</p>
            <p class="font-body-md text-body-md text-text-primary font-mono">{{ kickTarget?.address }}</p>
          </div>
          <div class="p-3 bg-surface-container-low rounded-lg">
            <p class="font-label-sm text-label-sm text-text-muted mb-0.5">MAC / Caller ID</p>
            <p class="font-body-md text-body-md text-text-primary font-mono">{{ kickTarget?.callerId }}</p>
          </div>
          <div class="p-3 bg-surface-container-low rounded-lg col-span-2">
            <p class="font-label-sm text-label-sm text-text-muted mb-0.5">Uptime Sesi</p>
            <p class="font-body-md text-body-md text-text-primary">{{ kickTarget?.uptime }}</p>
          </div>
        </div>

        <p v-if="routerStore.errorKick" role="alert"
          class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">
          {{ routerStore.errorKick }}
        </p>

        <div class="flex gap-3">
          <AppButton
            variant="danger"
            :full="true"
            @click="confirmKick"
            :disabled="routerStore.loadingKick"
          >
            <span class="material-symbols-outlined text-[18px]" :class="{ 'animate-spin': routerStore.loadingKick }">
              {{ routerStore.loadingKick ? 'refresh' : 'link_off' }}
            </span>
            {{ routerStore.loadingKick ? 'Memutus...' : 'Ya, Putus Sesi' }}
          </AppButton>
          <AppButton variant="secondary" :full="true" @click="showKickModal = false" :disabled="routerStore.loadingKick">
            Batal
          </AppButton>
        </div>
      </div>
    </AppModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouterStore } from '@/stores/router'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/AppButton.vue'
import AppInput from '@/components/AppInput.vue'
import AppModal from '@/components/AppModal.vue'
import AppDataTable from '@/components/AppDataTable.vue'

const routerStore = useRouterStore()
const auth        = useAuthStore()

// ── Tab State ────────────────────────────────────────────────────────
const activeTab = ref('monitoring')
const tabs = [
  { key: 'monitoring', label: 'Monitoring',         icon: 'speed' },
  { key: 'sessions',   label: 'Active Sessions',    icon: 'people' },
  { key: 'settings',   label: 'Pengaturan Router',  icon: 'settings_ethernet' },
]

// ── Computed ─────────────────────────────────────────────────────────
const isConnected = computed(() => Boolean(routerStore.status?.connected))
const isAnyLoading = computed(() =>
  routerStore.loadingStatus || routerStore.loadingTraffic || routerStore.loadingSessions,
)

const deviceInfo = computed(() => {
  const s = routerStore.status
  if (!s) return []
  return [
    { label: 'Model',          value: s.model || '-' },
    { label: 'Board Name',     value: s.boardName || '-' },
    { label: 'Serial Number',  value: s.serialNumber || '-' },
    { label: 'RouterOS Ver.',  value: s.routerOsVersion || '-' },
    { label: 'CPU Cores',      value: `${s.cpuCount} Cores @ ${s.cpuFrequency} MHz` },
    { label: 'Total RAM',      value: `${s.totalMemory} MB` },
    { label: 'Free RAM',       value: `${s.freeMemory} MB` },
    { label: 'Free HDD',       value: `${s.freeHddSpace} MB / ${s.totalHddSpace} MB` },
  ]
})

// ── Columns for AppDataTable ──────────────────────────────────────────
const sessionColumns = [
  { key: 'name',     label: 'Username / Interface' },
  { key: 'service',  label: 'Service' },
  { key: 'address',  label: 'IP Address' },
  { key: 'callerId', label: 'Caller ID / MAC' },
  { key: 'uptime',   label: 'Uptime' },
]

// ── Auto Refresh ─────────────────────────────────────────────────────
const autoRefresh = ref(false)
let timer = null
const lastRefreshed = ref(new Date())

const lastRefreshedLabel = computed(() =>
  lastRefreshed.value.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
)

function toggleAutoRefresh() {
  autoRefresh.value = !autoRefresh.value
  if (autoRefresh.value) {
    timer = setInterval(() => {
      routerStore.fetchStatus()
      routerStore.fetchTraffic()
      lastRefreshed.value = new Date()
    }, 5000)
  } else {
    clearInterval(timer)
    timer = null
  }
}

// ── Formatters ───────────────────────────────────────────────────────
function formatBps(bps = 0) {
  if (bps >= 1_000_000_000) return `${(bps / 1_000_000_000).toFixed(2)} Gbps`
  if (bps >= 1_000_000)     return `${(bps / 1_000_000).toFixed(2)} Mbps`
  if (bps >= 1_000)         return `${(bps / 1_000).toFixed(2)} Kbps`
  return `${bps} bps`
}

// ── Actions ──────────────────────────────────────────────────────────
async function refreshAll() {
  await Promise.allSettled([
    routerStore.fetchStatus(),
    routerStore.fetchTraffic(),
    routerStore.fetchSessions(),
  ])
  lastRefreshed.value = new Date()
}

// Kick modal state
const showKickModal = ref(false)
const kickTarget    = ref(null)

function openKickModal(row) {
  kickTarget.value    = row
  showKickModal.value = true
  routerStore.errorKick = ''
}

async function confirmKick() {
  if (!kickTarget.value) return
  try {
    await routerStore.kickUser({
      sessionId: kickTarget.value.id,
      username:  kickTarget.value.name,
    })
    showKickModal.value = false
    kickTarget.value    = null
  } catch {
    // Error is set in store
  }
}

// ── Settings Form ────────────────────────────────────────────────────
const settingsForm = ref({
  host:     '',
  port:     '8728',
  username: 'admin',
  password: '',
  useSSL:   false,
})

function populateSettings() {
  settingsForm.value = {
    host:     routerStore.settings?.host     || '',
    port:     routerStore.settings?.port     || '8728',
    username: routerStore.settings?.username || 'admin',
    password: '',
    useSSL:   Boolean(routerStore.settings?.useSSL),
  }
}

function resetSettingsForm() {
  populateSettings()
  routerStore.clearErrors()
}

async function handleSaveSettings() {
  await routerStore.saveSettings(settingsForm.value)
}

// ── Lifecycle ────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.allSettled([
    routerStore.fetchStatus(),
    routerStore.fetchTraffic(),
    routerStore.fetchSessions(),
    routerStore.fetchSettings(),
  ])
  populateSettings()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>





