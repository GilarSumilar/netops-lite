<template>
  <div class="max-w-2xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
    <h2 class="font-headline-lg text-headline-lg text-text-primary">
      Profil Saya
    </h2>
    <!-- Avatar + name -->
    <div
      class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex items-center gap-4"
    >
      <div
        class="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-headline-md font-bold ring-4 ring-primary-fixed shrink-0"
      >
        {{ user?.initials }}
      </div>
      <div>
        <h3
          class="font-headline-sm text-headline-sm text-text-primary font-bold"
        >
          {{ user?.name }}
        </h3>
        <p class="font-body-sm text-body-sm text-text-muted">{{ user?.id }}</p>
        <span
          class="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-status-success-bg text-status-success-text font-label-sm font-semibold"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-status-success-text"></span>
          Pelanggan Aktif
        </span>
      </div>
    </div>
    <!-- Info fields -->
    <div
      class="bg-surface-base rounded-xl border border-border-subtle p-5 shadow-sm flex flex-col gap-0 divide-y divide-border-subtle"
    >
      <div
        v-for="f in fields"
        :key="f.label"
        class="flex items-center justify-between py-3"
      >
        <div class="flex items-center gap-2.5">
          <span class="material-symbols-outlined text-[18px] text-text-muted">{{
            f.icon
          }}</span>
          <span class="font-body-md text-body-md text-text-body">{{
            f.label
          }}</span>
        </div>
        <span
          class="font-label-md text-label-md text-text-primary font-semibold text-right max-w-[60%]"
          >{{ f.value }}</span
        >
      </div>
    </div>
    <!-- Actions -->
    <div class="flex flex-col gap-2">
      <AppButton variant="outline" :full="true" size="lg" @click="openEdit">
        <span class="material-symbols-outlined text-[18px]">edit</span> Edit
        Profil
      </AppButton>
      <AppButton
        variant="outline"
        :full="true"
        size="lg"
        @click="showPasswordModal = true"
      >
        <span class="material-symbols-outlined text-[18px]">lock</span> Ganti
        Kata Sandi
      </AppButton>
      <AppButton variant="danger" :full="true" size="lg" @click="handleLogout">
        <span class="material-symbols-outlined text-[18px]">logout</span> Keluar
      </AppButton>
    </div>
    <!-- Modal Edit Profil -->
    <AppModal v-model="showEditModal" title="Edit Profil">
      <div class="flex flex-col gap-3">
        <AppInput v-model="editForm.name" label="Nama Lengkap" />
        <AppInput v-model="editForm.phone" label="No. Telepon" />
        <AppInput v-model="editForm.email" label="Email" type="email" />
        <AppInput v-model="editForm.address" label="Alamat" />
      </div>
      <p
        v-if="editSubmitted"
        class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg"
      >
        Profil berhasil diperbarui.
      </p>
      <div class="flex gap-3">
        <AppButton variant="outline" :full="true" @click="showEditModal = false"
          >Batal</AppButton
        >
        <AppButton :full="true" @click="submitEdit">Simpan</AppButton>
      </div>
    </AppModal>
    <!-- Modal Ganti Kata Sandi -->
    <AppModal v-model="showPasswordModal" title="Ganti Kata Sandi">
      <div class="flex flex-col gap-3">
        <AppInput
          v-model="passForm.lama"
          label="Kata Sandi Lama"
          type="password"
        />
        <AppInput
          v-model="passForm.baru"
          label="Kata Sandi Baru"
          type="password"
        />
        <AppInput
          v-model="passForm.konfirmasi"
          label="Konfirmasi Kata Sandi Baru"
          type="password"
        />
      </div>
      <p
        v-if="passSubmitted"
        class="font-body-sm text-body-sm text-status-success-text bg-status-success-bg px-3 py-2 rounded-lg"
      >
        Kata sandi berhasil diubah.
      </p>
      <p
        v-if="
          passForm.baru &&
          passForm.konfirmasi &&
          passForm.baru !== passForm.konfirmasi
        "
        class="font-body-sm text-body-sm text-status-danger-text bg-status-danger-bg px-3 py-2 rounded-lg"
      >
        Konfirmasi kata sandi tidak cocok.
      </p>
      <div class="flex gap-3">
        <AppButton
          variant="outline"
          :full="true"
          @click="showPasswordModal = false"
          >Batal</AppButton
        >
        <AppButton :full="true" @click="submitPassword">Simpan</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";
import AppModal from "@/components/AppModal.vue";
const auth = useAuthStore(),
  router = useRouter();
const user = computed(() => auth.user);
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const editForm = reactive({ name: "", phone: "", email: "", address: "" });
const passForm = reactive({ lama: "", baru: "", konfirmasi: "" });
const editSubmitted = ref(false);
const passSubmitted = ref(false);
const fields = [
  { label: "Nama Lengkap", icon: "person", value: "Bpk. Agus Setiawan" },
  { label: "ID Pelanggan", icon: "badge", value: "CUST-2024-035" },
  { label: "Paket Aktif", icon: "wifi", value: "Fiber Pro 50 Mbps" },
  { label: "Alamat", icon: "home", value: "Jl. Melati No. 12, RT 03/RW 01" },
  { label: "No. Telepon", icon: "phone", value: "+62 812-3456-7890" },
  { label: "Email", icon: "alternate_email", value: "agus.setiawan@email.com" },
  {
    label: "Bergabung Sejak",
    icon: "calendar_month",
    value: "15 Januari 2023",
  },
];
function handleLogout() {
  auth.logout();
  router.push("/portal/login");
}
function openEdit() {
  editForm.name = user.value?.name || "";
  editForm.phone = "+62 812-3456-7890";
  editForm.email = "agus.setiawan@email.com";
  editForm.address = "Jl. Melati No. 12, RT 03/RW 01";
  showEditModal.value = true;
}
function submitEdit() {
  // ponytail: mock — swap real API + update auth store
  editSubmitted.value = true;
  setTimeout(() => {
    showEditModal.value = false;
    editSubmitted.value = false;
  }, 1500);
}
function submitPassword() {
  if (!passForm.lama || passForm.baru !== passForm.konfirmasi) return;
  // ponytail: mock — swap real API
  passSubmitted.value = true;
  setTimeout(() => {
    showPasswordModal.value = false;
    passSubmitted.value = false;
    passForm.lama = "";
    passForm.baru = "";
    passForm.konfirmasi = "";
  }, 1500);
}
</script>
