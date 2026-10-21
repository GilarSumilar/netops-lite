<template>
  <div class="flex min-w-0 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2
          class="font-headline-lg text-headline-lg-mobile text-text-primary sm:text-headline-lg"
        >
          Pengaduan &amp; Gangguan
        </h2>
        <p class="font-body-sm text-body-sm text-text-body mt-0.5">
          Kelola tiket pengaduan dan gangguan jaringan pelanggan
        </p>
      </div>
      <div class="flex gap-2">
        <AppSelect v-model="filterStatus" class="w-full sm:w-auto">
          <option value="">Semua Status</option>
          <option value="baru">Baru</option>
          <option value="proses">Dalam Proses</option>
          <option value="selesai">Selesai</option>
        </AppSelect>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <div
        v-for="t in filtered"
        :key="t.id"
        class="bg-surface-base rounded-xl border border-border-subtle p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
      >
        <div
          class="flex flex-col items-start justify-between gap-3 sm:flex-row"
        >
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <div
              :class="[
                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                prioCls[t.prioritas].bg,
              ]"
            >
              <span
                class="material-symbols-outlined text-[18px]"
                :class="prioCls[t.prioritas].icon"
                >{{ t.iconName }}</span
              >
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-label-md text-label-md text-text-muted">{{
                  t.id
                }}</span>
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full font-label-sm text-label-sm',
                    prioCls[t.prioritas].badge,
                  ]"
                  >{{ t.prioritas }}</span
                >
              </div>
              <p
                class="font-headline-sm text-headline-sm text-text-primary mt-0.5"
              >
                {{ t.judul }}
              </p>
              <p class="font-body-sm text-body-sm text-text-body mt-1">
                {{ t.desc }}
              </p>
            </div>
          </div>
          <span
            :class="[
              'shrink-0 px-2.5 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap sm:self-start',
              sCls[t.status],
            ]"
            >{{ t.status }}</span
          >
        </div>
        <div
          class="flex flex-col gap-2 border-t border-border-subtle pt-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <span class="font-body-sm text-body-sm text-text-muted"
            >{{ t.pelanggan }} • {{ t.waktu }}</span
          >
          <AppButton variant="ghost" size="sm" @click="openTangani(t)">
            <span class="material-symbols-outlined text-[16px]"
              >open_in_new</span
            >
            Tangani
          </AppButton>
        </div>
      </div>
    </div>
    <!-- Modal Tangani Tiket -->
    <AppModal v-model="showTanganiModal" title="Tangani Tiket">
      <div
        v-if="activeTiket"
        class="bg-surface-container-low rounded-xl p-3 flex flex-col gap-1"
      >
        <span class="font-label-sm text-label-sm text-text-muted">{{
          activeTiket.id
        }}</span>
        <p class="font-label-md text-label-md text-text-primary">
          {{ activeTiket.judul }}
        </p>
        <p class="font-body-sm text-body-sm text-text-body">
          {{ activeTiket.pelanggan }}
        </p>
      </div>
      <AppSelect v-model="tanganiForm.status" label="Update Status">
        <option value="baru">Baru</option>
        <option value="proses">Dalam Proses</option>
        <option value="selesai">Selesai</option>
      </AppSelect>
      <div class="flex flex-col gap-1.5">
        <label class="font-label-md text-label-md text-text-primary"
          >Catatan Penanganan</label
        >
        <textarea
          v-model="tanganiForm.catatan"
          rows="3"
          placeholder="Jelaskan langkah penanganan..."
          class="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container resize-none"
        ></textarea>
      </div>
      <div class="flex gap-3">
        <AppButton
          variant="outline"
          :full="true"
          @click="showTanganiModal = false"
          >Batal</AppButton
        >
        <AppButton :full="true" @click="submitTangani">Simpan Update</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import AppButton from "@/components/AppButton.vue";
import AppSelect from "@/components/AppSelect.vue";
import AppModal from "@/components/AppModal.vue";
const filterStatus = ref("");
const showTanganiModal = ref(false);
const activeTiket = ref(null);
const tanganiForm = reactive({ status: "proses", catatan: "" });
const prioCls = {
  mendesak: {
    bg: "bg-status-danger-bg",
    icon: "text-status-danger-text",
    badge: "bg-status-danger-bg text-status-danger-text",
  },
  tinggi: {
    bg: "bg-status-warning-bg",
    icon: "text-status-warning-text",
    badge: "bg-status-warning-bg text-status-warning-text",
  },
  normal: {
    bg: "bg-surface-container",
    icon: "text-text-body",
    badge: "bg-status-neutral-bg text-status-neutral-text",
  },
};
const sCls = {
  baru: "bg-primary-fixed text-primary",
  proses: "bg-status-warning-bg text-status-warning-text",
  selesai: "bg-status-success-bg text-status-success-text",
};
const tikets = ref([
  {
    id: "TKT-001",
    judul: "Koneksi lambat sejak kemarin malam",
    desc: "Kecepatan download hanya 2 Mbps dari paket 50 Mbps",
    pelanggan: "Ibu Sari Dewi",
    waktu: "23 mnt lalu",
    prioritas: "mendesak",
    status: "baru",
    iconName: "speed",
  },
  {
    id: "TKT-002",
    judul: "Internet mati total sejak pagi",
    desc: "Router menyala tapi tidak ada koneksi ke luar",
    pelanggan: "Ahmad Fauzi",
    waktu: "2 jam lalu",
    prioritas: "mendesak",
    status: "proses",
    iconName: "wifi_off",
  },
  {
    id: "TKT-003",
    judul: "Ping tinggi saat gaming",
    desc: "Latensi mencapai 200ms ke server SEA",
    pelanggan: "Bpk. Rudi",
    waktu: "5 jam lalu",
    prioritas: "tinggi",
    status: "proses",
    iconName: "network_check",
  },
  {
    id: "TKT-004",
    judul: "Permintaan upgrade paket",
    desc: "Ingin upgrade dari 20 Mbps ke 50 Mbps",
    pelanggan: "Ibu Dewi",
    waktu: "1 hari lalu",
    prioritas: "normal",
    status: "selesai",
    iconName: "upgrade",
  },
]);
const filtered = computed(() =>
  tikets.value.filter(
    (t) => !filterStatus.value || t.status === filterStatus.value,
  ),
);
function openTangani(t) {
  activeTiket.value = t;
  tanganiForm.status = t.status;
  tanganiForm.catatan = "";
  showTanganiModal.value = true;
}
function submitTangani() {
  // ponytail: mock — swap real API
  if (activeTiket.value) activeTiket.value.status = tanganiForm.status;
  showTanganiModal.value = false;
}
</script>
