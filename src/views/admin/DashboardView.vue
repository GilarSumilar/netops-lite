<template>
  <div class="flex w-full min-w-0 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
          <span class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold">NOC Dashboard Overview</span>
        </div>
        <h1 class="mt-1 font-headline-lg text-headline-lg-mobile tracking-tight text-text-primary sm:text-headline-lg">Ringkasan Operasional</h1>
        <p class="font-body-md text-body-md text-text-body mt-0.5">Pantau performa layanan, tagihan pelanggan, dan respon gangguan hari ini.</p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <AppSelect v-model="periodeFilter" class="flex-1 sm:flex-none sm:w-auto">
          <option value="bulan-ini">Bulan Ini (Oktober 2024)</option>
          <option value="bulan-lalu">Bulan Lalu (September 2024)</option>
          <option value="triwulan-3">Triwulan 3 (Jul - Sep 2024)</option>
          <option value="tahun-ini">Tahun Berjalan 2024</option>
        </AppSelect>
        <div class="flex gap-2">
          <AppButton variant="secondary" class="flex-1 sm:flex-none">
            <span class="material-symbols-outlined text-lg text-text-muted">download</span><span class="hidden sm:inline">Unduh Laporan</span>
          </AppButton>
          <AppButton @click="showPaymentModal = true" class="flex-1 sm:flex-none">
            <span class="material-symbols-outlined text-lg">add</span><span>Catat Pembayaran</span>
          </AppButton>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow sm:p-5">
        <div class="flex items-start justify-between">
          <div>
            <span class="font-body-sm text-body-sm text-text-muted font-medium">{{ s.label }}</span>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="font-currency-stat text-currency-stat text-text-primary tracking-tight">{{ s.value }}</span>
              <span v-if="s.unit" class="font-body-sm text-body-sm text-text-muted">{{ s.unit }}</span>
              <span v-if="s.badge" :class="['inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold', s.badgeCls]">{{ s.badge }}</span>
            </div>
          </div>
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', s.iconBg]">
            <span class="material-symbols-outlined text-2xl" :class="s.iconColor">{{ s.icon }}</span>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between font-label-sm text-label-sm">
          <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold', s.trendCls]">
            <span class="material-symbols-outlined text-sm">{{ s.trendIcon }}</span>{{ s.trend }}
          </span>
          <span class="text-text-muted">{{ s.trendDesc }}</span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div class="lg:col-span-8 bg-surface-base border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-4 sm:p-6">
        <div><h2 class="font-headline-sm text-headline-sm text-text-primary">Pendapatan Bulanan</h2><p class="font-body-sm text-body-sm text-text-muted">Target vs realisasi tagihan terbayar</p></div>
        <div class="flex items-end gap-1.5 h-36">
          <div v-for="b in chartBars" :key="b.label" class="flex-1 flex flex-col items-center gap-1">
            <div class="w-full flex flex-col justify-end gap-0.5 h-28 relative group">
              <div class="w-full rounded-sm bg-border-subtle" :style="{height: b.target}"></div>
              <div class="w-full rounded-sm bg-primary-container absolute bottom-0" :style="{height: b.actual}"></div>
              <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-overlay text-on-surface text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{{ b.tooltip }}</div>
            </div>
            <span class="font-label-sm text-label-sm text-text-muted text-[10px]">{{ b.label }}</span>
          </div>
        </div>
        <div class="flex items-center gap-4 font-label-sm text-label-sm text-text-muted">
          <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded-sm bg-border-subtle inline-block"></span>Target</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded-sm bg-primary-container inline-block"></span>Realisasi</span>
        </div>
      </div>
      <div class="lg:col-span-4 bg-surface-base border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-4 sm:p-6">
        <div><h2 class="font-headline-sm text-headline-sm text-text-primary">Distribusi Paket</h2><p class="font-body-sm text-body-sm text-text-muted">Komposisi paket aktif saat ini</p></div>
        <div class="flex flex-col gap-3">
          <div v-for="pkg in packages" :key="pkg.name" class="flex flex-col gap-1">
            <div class="flex items-center justify-between font-label-sm text-label-sm">
              <span class="text-text-primary font-medium">{{ pkg.name }}</span>
              <span class="text-text-muted">{{ pkg.count }} pel. ({{ pkg.pct }}%)</span>
            </div>
            <div class="h-2 w-full rounded-full bg-surface-container-low overflow-hidden">
              <div class="h-full rounded-full" :class="pkg.color" :style="{width: pkg.pct+'%'}"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-sm sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-headline-sm text-headline-sm text-text-primary">Aktivitas Terkini</h2>
        <RouterLink to="/admin/tagihan" class="font-label-md text-label-md text-primary-container hover:underline">Lihat Semua</RouterLink>
      </div>
      <div class="flex flex-col divide-y divide-border-subtle">
        <div v-for="act in activities" :key="act.id" class="flex items-start gap-3 py-3">
          <div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', act.iconBg]">
            <span class="material-symbols-outlined text-[16px]" :class="act.iconColor">{{ act.icon }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-label-md text-label-md text-text-primary">{{ act.title }}</p>
            <p class="font-body-sm text-body-sm text-text-muted line-clamp-2">{{ act.desc }}</p>
          </div>
          <span class="font-label-sm text-label-sm text-text-muted shrink-0 text-[11px] md:text-xs">{{ act.time }}</span>
        </div>
      </div>
    </div>
    <AppModal v-model="showPaymentModal" title="Catat Pembayaran">
      <div class="flex flex-col gap-3">
        <AppInput v-model="payForm.pelanggan" label="ID / Nama Pelanggan" placeholder="CUST-001 atau nama..." />
        <AppInput v-model="payForm.jumlah" label="Jumlah Pembayaran" placeholder="Rp 0" />
        <AppSelect v-model="payForm.metode" label="Metode Pembayaran">
          <option value="">Pilih metode...</option>
          <option>Transfer Bank</option>
          <option>Tunai</option>
          <option>QRIS</option>
          <option>Virtual Account</option>
        </AppSelect>
      </div>
      <div class="flex gap-3 pt-1">
        <AppButton variant="outline" :full="true" @click="showPaymentModal = false">Batal</AppButton>
        <AppButton :full="true" @click="submitPayment">Simpan</AppButton>
      </div>
    </AppModal>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppInput  from '@/components/AppInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppModal  from '@/components/AppModal.vue'
const periodeFilter = ref('bulan-ini')
const showPaymentModal = ref(false)
const payForm = reactive({ pelanggan:'', jumlah:'', metode:'' })
function submitPayment() { showPaymentModal.value=false; payForm.pelanggan=''; payForm.jumlah=''; payForm.metode='' }
const stats = [
  { label:'Total Pelanggan', value:'128', unit:'Subscribers', icon:'group', iconBg:'bg-primary-fixed/40', iconColor:'text-primary-container', trend:'+6.2%', trendIcon:'trending_up', trendCls:'bg-status-success-bg text-status-success-text', trendDesc:'+8 pelanggan baru bln ini' },
  { label:'Pelanggan Aktif', value:'122', badge:'95.3%', badgeCls:'bg-status-success-bg text-status-success-text', icon:'wifi_tethering', iconBg:'bg-status-success-bg/70', iconColor:'text-status-success-text', trend:'+1.1%', trendIcon:'trending_up', trendCls:'bg-status-success-bg text-status-success-text', trendDesc:'Dari 120 bulan lalu' },
  { label:'Tagihan Lunas', value:'Rp 28,6 jt', icon:'payments', iconBg:'bg-tertiary/20', iconColor:'text-tertiary', trend:'92%', trendIcon:'percent', trendCls:'bg-primary-fixed text-primary-container', trendDesc:'Dari target Rp 31,1 jt' },
  { label:'Tiket Aktif', value:'7', unit:'Tiket', icon:'support_agent', iconBg:'bg-status-warning-bg', iconColor:'text-status-warning-text', trend:'-3', trendIcon:'trending_down', trendCls:'bg-status-success-bg text-status-success-text', trendDesc:'Dari 10 minggu lalu' },
]
const chartBars = [
  { label:'Mei', target:'75%', actual:'70%', tooltip:'Rp 22.000.000' },
  { label:'Jun', target:'80%', actual:'77%', tooltip:'Rp 24.000.000' },
  { label:'Jul', target:'84%', actual:'81%', tooltip:'Rp 25.500.000' },
  { label:'Agu', target:'88%', actual:'85%', tooltip:'Rp 26.800.000' },
  { label:'Sep', target:'90%', actual:'87%', tooltip:'Rp 27.200.000' },
  { label:'Okt', target:'96%', actual:'92%', tooltip:'Rp 28.650.000 (berjalan)' },
]
const packages = [
  { name:'Fiber Pro 50 Mbps',  count:54, pct:42, color:'bg-primary-container' },
  { name:'Standard 20 Mbps',   count:41, pct:32, color:'bg-tertiary' },
  { name:'Business 100 Mbps',  count:19, pct:15, color:'bg-status-success-text' },
  { name:'Home Basic 10 Mbps', count:14, pct:11, color:'bg-border-default' },
]
const activities = [
  { id:1, title:'Pembayaran Diterima',      desc:'Bpk. Agus Setiawan - Rp 250.000 via Transfer Bank',   time:'5 mnt lalu',  icon:'check_circle',  iconBg:'bg-status-success-bg', iconColor:'text-status-success-text' },
  { id:2, title:'Tiket Pengaduan Baru',     desc:'Ibu Sari Dewi - Koneksi lambat di Griya Asri Blok C', time:'23 mnt lalu', icon:'support_agent', iconBg:'bg-status-warning-bg', iconColor:'text-status-warning-text' },
  { id:3, title:'Pelanggan Baru Terdaftar', desc:'Ahmad Fauzi - Paket Fiber Pro 50 Mbps',               time:'1 jam lalu',  icon:'person_add',    iconBg:'bg-primary-fixed',     iconColor:'text-primary-container' },
  { id:4, title:'Gangguan Teratasi',        desc:'Node RT-07/RW-03 kembali online',                     time:'2 jam lalu',  icon:'router',        iconBg:'bg-status-success-bg', iconColor:'text-status-success-text' },
]
</script>
