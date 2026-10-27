<template>
  <div class="max-w-2xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-5">
    <h2 class="font-headline-lg text-headline-lg text-text-primary">
      Profil Saya
    </h2>
    <p v-if="portal.error" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ portal.error }}</p>
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
          :class="['mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm font-semibold', hasSubscription ? 'bg-status-success-bg text-status-success-text' : 'bg-status-warning-bg text-status-warning-text']"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="hasSubscription ? 'bg-status-success-text' : 'bg-status-warning-text'"></span>
          {{ hasSubscription ? `Berlangganan · ${portal.data?.customer?.status}` : 'Belum berlangganan' }}
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
      <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>
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
      <p v-if="errorMsg" role="alert" class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text">{{ errorMsg }}</p>
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
import { computed, ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";
import AppModal from "@/components/AppModal.vue";
import { usePortalStore } from "@/stores/portal";
const auth = useAuthStore(),
  router = useRouter();
const portal = usePortalStore();
const user = computed(() => auth.user);
const hasSubscription = computed(() => !!portal.data?.customer);
const showEditModal = ref(false);
const showPasswordModal = ref(false);
const editForm = reactive({ name: "", phone: "", email: "", address: "" });
const passForm = reactive({ lama: "", baru: "", konfirmasi: "" });
const editSubmitted = ref(false);
const passSubmitted = ref(false);
const errorMsg = ref("");
const fields = computed(() => [
  { label: "Nama Lengkap", icon: "person", value: user.value?.name || "-" },
  { label: "ID Pelanggan", icon: "badge", value: portal.data?.customer?.id || "Belum ditautkan" },
  { label: "Paket Aktif", icon: "wifi", value: portal.data?.customer?.paket || "Belum berlangganan" },
  { label: "Alamat", icon: "home", value: portal.data?.customer?.address || user.value?.address || "-" },
  { label: "No. Telepon", icon: "phone", value: portal.data?.customer?.phone || user.value?.phone || "-" },
  { label: "Email", icon: "alternate_email", value: user.value?.email || "-" },
]);
onMounted(() => portal.load());
async function handleLogout() {
  try {
    await auth.logout()
  } catch (error) {
    window.alert(`Sesi lokal ditutup, tetapi sesi server gagal diakhiri: ${error.message}`)
  } finally {
    router.push('/portal/login')
  }
}
function openEdit() {
  editForm.name = user.value?.name || "";
  editForm.phone = user.value?.phone || "";
  editForm.email = user.value?.email || "";
  editForm.address = user.value?.address || "";
  showEditModal.value = true;
}
async function submitEdit() {
  try {
    errorMsg.value = "";
    const result = await portal.updateProfile(editForm);
    auth.user = result.user;
    editSubmitted.value = true;
    setTimeout(() => {
      showEditModal.value = false;
      editSubmitted.value = false;
    }, 1500);
  } catch (error) {
    errorMsg.value = `Gagal menyimpan profil: ${error.message}`;
  }
}
async function submitPassword() {
  if (!passForm.lama || passForm.baru.length < 8 || passForm.baru !== passForm.konfirmasi) {
    errorMsg.value = "Periksa kata sandi saat ini dan pastikan kata sandi baru minimal 8 karakter serta cocok.";
    return;
  }
  try {
    errorMsg.value = "";
    await auth.changePassword({ currentPassword: passForm.lama, newPassword: passForm.baru });
    passSubmitted.value = true;
    setTimeout(() => {
      showPasswordModal.value = false;
      passSubmitted.value = false;
      passForm.lama = "";
      passForm.baru = "";
      passForm.konfirmasi = "";
    }, 1500);
  } catch (error) {
    errorMsg.value = `Gagal mengganti kata sandi: ${error.message}`;
  }
}
</script>
