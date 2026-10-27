<template>
  <div class="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
    <h2 class="font-headline-lg text-headline-lg text-text-primary">
      Pengaduan &amp; Bantuan
    </h2>
    <!-- Submit form -->
    <div
      class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-4"
    >
      <h3 class="font-headline-sm text-headline-sm text-text-primary">
        Laporkan Masalah
      </h3>
      <form @submit.prevent="submitTiket" class="flex flex-col gap-3">
        <div class="flex flex-col gap-1.5">
          <label class="font-label-md text-label-md text-text-primary" for="kat"
            >Kategori Masalah</label
          >
          <AppSelect v-model="form.kategori" id="kat">
            <option value="">Pilih kategori...</option>
            <option>Koneksi Lambat</option>
            <option>Internet Mati Total</option>
            <option>Latensi/Ping Tinggi</option>
            <option>Gangguan Fisik Kabel</option>
            <option>Lainnya</option>
          </AppSelect>
        </div>
        <div class="flex flex-col gap-1.5">
          <label
            class="font-label-md text-label-md text-text-primary"
            for="desc"
            >Deskripsi Masalah</label
          >
          <textarea
            v-model="form.deskripsi"
            id="desc"
            rows="3"
            placeholder="Jelaskan masalah yang Anda alami..."
            class="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container resize-none transition-all"
          ></textarea>
        </div>
        <p
          v-if="submitted"
          class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg"
        >
          Tiket berhasil dikirim! Tim kami akan menghubungi Anda.
        </p>
        <p v-if="errorMsg || portal.error" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg || portal.error }}</p>
        <AppButton type="submit" :full="true" size="lg">
          <span class="material-symbols-outlined text-[18px]">send</span> Kirim
          Laporan
        </AppButton>
      </form>
    </div>
    <!-- Histori tiket -->
    <div
      class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-4"
    >
      <h3 class="font-headline-sm text-headline-sm text-text-primary">
        Riwayat Tiket
      </h3>
      <div class="flex flex-col divide-y divide-border-subtle">
        <div
          v-for="t in portal.data?.pengaduan || []"
          :key="t.id"
          class="py-3 flex items-start justify-between gap-3"
        >
          <div>
            <p class="font-label-md text-label-md text-text-primary">
              {{ t.judul }}
            </p>
            <p class="font-body-sm text-body-sm text-text-muted">
              {{ t.id }} • {{ t.waktu }}
            </p>
          </div>
          <span
            :class="[
              'px-2 py-0.5 rounded-full font-label-sm whitespace-nowrap',
              sCls[t.status],
            ]"
            >{{ statusLabel[t.status] || t.status }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import AppButton from "@/components/AppButton.vue";
import AppSelect from "@/components/AppSelect.vue";
import { usePortalStore } from "@/stores/portal";
const form = reactive({ kategori: "", deskripsi: "" });
const submitted = ref(false);
const errorMsg = ref("");
const portal = usePortalStore();
const statusLabel = { baru: "Baru", proses: "Dalam Proses", selesai: "Selesai" };
const sCls = {
  baru: "bg-primary-fixed text-primary",
  proses: "bg-status-warning-bg text-status-warning-text",
  selesai: "bg-status-success-bg text-status-success-text",
};
onMounted(() => portal.load());
async function submitTiket() {
  if (!form.kategori || !form.deskripsi.trim()) return;
  try {
    errorMsg.value = "";
    await portal.createTicket({
      judul: form.kategori,
      desc: form.deskripsi.trim(),
    });
    submitted.value = true;
    form.kategori = "";
    form.deskripsi = "";
    setTimeout(() => { submitted.value = false; }, 4000);
  } catch (error) {
    errorMsg.value = `Gagal mengirim pengaduan: ${error.message}`;
  }
}
</script>
