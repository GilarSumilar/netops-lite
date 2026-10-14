<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
    <h2 class="font-headline-lg text-headline-lg text-text-primary">Pengaduan &amp; Bantuan</h2>
    <!-- Submit form -->
    <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-4">
      <h3 class="font-headline-sm text-headline-sm text-text-primary">Laporkan Masalah</h3>
      <form @submit.prevent="submitTiket" class="flex flex-col gap-3">
        <div class="flex flex-col gap-1.5">
          <label class="font-label-md text-label-md text-text-primary" for="kat">Kategori Masalah</label>
          <select v-model="form.kategori" id="kat" class="h-10 px-3 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-container/20">
            <option value="">Pilih kategori...</option>
            <option>Koneksi Lambat</option>
            <option>Internet Mati Total</option>
            <option>Latensi/Ping Tinggi</option>
            <option>Gangguan Fisik Kabel</option>
            <option>Lainnya</option>
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="font-label-md text-label-md text-text-primary" for="desc">Deskripsi Masalah</label>
          <textarea v-model="form.deskripsi" id="desc" rows="3" placeholder="Jelaskan masalah yang Anda alami..."
            class="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container resize-none transition-all"></textarea>
        </div>
        <p v-if="submitted" class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg">Tiket berhasil dikirim! Tim kami akan menghubungi Anda.</p>
        <button type="submit" class="h-11 rounded-lg bg-primary-container text-on-primary font-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm">
          <span class="material-symbols-outlined text-[18px]">send</span> Kirim Laporan
        </button>
      </form>
    </div>
    <!-- Histori tiket -->
    <div class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm">
      <h3 class="font-headline-sm text-headline-sm text-text-primary mb-3">Riwayat Tiket</h3>
      <div class="flex flex-col divide-y divide-border-subtle">
        <div v-for="t in tikets" :key="t.id" class="py-3 flex items-start justify-between gap-3">
          <div>
            <p class="font-label-md text-label-md text-text-primary">{{ t.judul }}</p>
            <p class="font-body-sm text-body-sm text-text-muted">{{ t.id }} • {{ t.tanggal }}</p>
          </div>
          <span :class="['px-2 py-0.5 rounded-full font-label-sm whitespace-nowrap', sCls[t.status]]">{{ t.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const form = reactive({ kategori: '', deskripsi: '' })
const submitted = ref(false)
const sCls = { Baru:'bg-primary-fixed text-primary', 'Dalam Proses':'bg-status-warning-bg text-status-warning-text', Selesai:'bg-status-success-bg text-status-success-text' }
const tikets = [
  { id:'TKT-089', judul:'Koneksi lambat sore hari',      tanggal:'28 Sep 2024', status:'Selesai' },
  { id:'TKT-076', judul:'Internet mati 2 jam',           tanggal:'15 Agt 2024', status:'Selesai' },
  { id:'TKT-064', judul:'Permintaan relokasi router',    tanggal:'2 Jul 2024',  status:'Selesai' },
]
function submitTiket() {
  if (!form.kategori || !form.deskripsi) return
  submitted.value = true
  form.kategori = ''; form.deskripsi = ''
  setTimeout(() => { submitted.value = false }, 4000)
}
</script>
