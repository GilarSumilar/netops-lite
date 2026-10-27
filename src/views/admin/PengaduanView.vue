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
        <AppButton v-if="auth.isAdmin" @click="showCreateModal = true" :full="true" class="sm:w-auto">
          <span class="material-symbols-outlined text-lg">add</span><span>Buat Tiket</span>
        </AppButton>
      </div>
    </div>
    <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>
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
          <AppButton v-if="auth.isAdmin" variant="danger" size="sm" @click="openDelete(t)">
            <span class="material-symbols-outlined text-[16px]">delete</span>
            Hapus
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
      <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>
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
    <AppModal v-model="showCreateModal" title="Buat Tiket Pengaduan">
      <div class="flex flex-col gap-3">
        <AppInput v-model="createForm.judul" label="Judul" placeholder="Contoh: Koneksi lambat" />
        <AppInput v-model="createForm.pelanggan" label="Nama Pelanggan" placeholder="Nama pelanggan" />
        <AppSelect v-model="createForm.prioritas" label="Prioritas">
          <option value="normal">Normal</option>
          <option value="tinggi">Tinggi</option>
          <option value="mendesak">Mendesak</option>
        </AppSelect>
        <div class="flex flex-col gap-1.5">
          <label class="font-label-md text-label-md text-text-primary">Deskripsi</label>
          <textarea v-model="createForm.desc" rows="3" placeholder="Jelaskan masalah..." class="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-base font-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container resize-none"></textarea>
        </div>
      </div>
      <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>
      <div class="flex gap-3">
        <AppButton variant="outline" :full="true" @click="showCreateModal = false">Batal</AppButton>
        <AppButton :full="true" @click="submitCreate">Buat Tiket</AppButton>
      </div>
    </AppModal>
    <AppModal v-model="showDeleteModal" title="Hapus Tiket?" max-width="sm">
      <p class="font-body-md text-body-md text-text-body">Tiket <strong>{{ deleteTarget?.id }}</strong> akan dihapus permanen.</p>
      <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>
      <div class="flex gap-3">
        <AppButton variant="outline" :full="true" @click="showDeleteModal = false">Batal</AppButton>
        <AppButton variant="danger" :full="true" @click="confirmDelete">Hapus</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";
import AppSelect from "@/components/AppSelect.vue";
import AppModal from "@/components/AppModal.vue";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();
const filterStatus = ref("");
const showTanganiModal = ref(false);
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const activeTiket = ref(null);
const deleteTarget = ref(null);
const errorMsg = ref("");
const tanganiForm = reactive({ status: "proses", catatan: "" });
const createForm = reactive({ judul: "", pelanggan: "", prioritas: "normal", desc: "" });
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
const tikets = ref([]);
onMounted(loadTikets);
async function loadTikets() {
  try {
    tikets.value = await api.list("pengaduan");
  } catch (error) {
    errorMsg.value = `Gagal memuat tiket: ${error.message}`;
  }
}
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
async function submitTangani() {
  if (!activeTiket.value) return;
  try {
    errorMsg.value = "";
    Object.assign(activeTiket.value, await api.update("pengaduan", activeTiket.value.id, {
      status: tanganiForm.status,
      catatan: tanganiForm.catatan,
    }));
    showTanganiModal.value = false;
  } catch (error) {
    errorMsg.value = `Gagal memperbarui tiket: ${error.message}`;
  }
}
async function submitCreate() {
  if (!createForm.judul.trim() || !createForm.pelanggan.trim() || !createForm.desc.trim()) {
    errorMsg.value = "Judul, nama pelanggan, dan deskripsi wajib diisi.";
    return;
  }
  try {
    errorMsg.value = "";
    tikets.value.unshift(await api.create("pengaduan", {
      ...createForm,
      judul: createForm.judul.trim(),
      pelanggan: createForm.pelanggan.trim(),
      desc: createForm.desc.trim(),
      waktu: "Baru saja",
      status: "baru",
      iconName: "support_agent",
      catatan: "",
    }));
    Object.assign(createForm, { judul: "", pelanggan: "", prioritas: "normal", desc: "" });
    showCreateModal.value = false;
  } catch (error) {
    errorMsg.value = `Gagal membuat tiket: ${error.message}`;
  }
}
function openDelete(ticket) {
  deleteTarget.value = ticket;
  showDeleteModal.value = true;
}
async function confirmDelete() {
  try {
    errorMsg.value = "";
    await api.remove("pengaduan", deleteTarget.value.id);
    tikets.value = tikets.value.filter(ticket => ticket.id !== deleteTarget.value.id);
    showDeleteModal.value = false;
    deleteTarget.value = null;
  } catch (error) {
    errorMsg.value = `Gagal menghapus tiket: ${error.message}`;
  }
}
</script>
