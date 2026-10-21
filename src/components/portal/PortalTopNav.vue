<template>
  <header
    class="fixed top-0 inset-x-0 z-50 bg-surface-base/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
  >
    <div
      class="max-w-7xl mx-auto px-gutter h-16 flex items-center justify-between gap-space-md"
    >
      <!-- Logo → beranda -->
      <RouterLink to="/portal/beranda" class="flex items-center gap-space-sm">
        <div
          class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shrink-0"
        >
          <span class="material-symbols-outlined text-on-primary text-[20px]"
            >router</span
          >
        </div>
        <div class="flex flex-col">
          <div class="flex items-center gap-1">
            <span
              class="font-headline-sm text-headline-sm text-text-primary tracking-tight font-bold"
              >NetOps</span
            >
            <span class="font-label-md text-label-md text-primary font-bold"
              >Lite</span
            >
          </div>
          <span class="font-label-sm text-label-sm text-text-muted"
            >Portal Pelanggan</span
          >
        </div>
      </RouterLink>

      <!-- Nav links -->
      <nav
        class="hidden md:flex items-center gap-1 bg-surface-container-low rounded-xl p-1"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          custom
          v-slot="{ isActive, navigate }"
        >
          <a
            @click="navigate"
            :class="[
              'px-space-md py-space-xs transition-colors font-label-lg rounded-lg cursor-pointer',
              isActive
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface',
            ]"
            >{{ item.label }}</a
          >
        </RouterLink>
      </nav>

      <!-- Right -->
      <div class="flex items-center gap-space-sm">
        <div
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-success-bg"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-status-success-text animate-pulse"
          ></span>
          <span
            class="font-label-sm text-label-sm text-status-success-text font-semibold"
            >Aktif</span
          >
        </div>

        <!-- Notifikasi -->
        <div class="relative" v-click-outside="() => (showNotif = false)">
          <button
            @click="showNotif = !showNotif"
            aria-label="Notifikasi"
            class="relative w-10 h-10 flex items-center justify-center rounded-lg text-text-body hover:text-text-primary transition-colors"
            type="button"
          >
            <span class="material-symbols-outlined text-[22px]"
              >notifications</span
            >
            <span
              v-if="notifs.length"
              class="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-danger-text ring-2 ring-surface-base"
            ></span>
          </button>
          <div
            v-if="showNotif"
            class="absolute right-0 top-12 w-72 bg-surface-base border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div
              class="flex items-center justify-between px-4 py-3 border-b border-border-subtle"
            >
              <span
                class="font-label-md text-label-md text-text-primary font-bold"
                >Notifikasi</span
              >
              <button
                @click="notifs = []"
                class="font-label-sm text-label-sm text-primary-container hover:underline"
              >
                Bersihkan
              </button>
            </div>
            <div
              class="flex flex-col divide-y divide-border-subtle max-h-64 overflow-y-auto"
            >
              <div
                v-for="n in notifs"
                :key="n.id"
                class="flex gap-3 px-4 py-3 hover:bg-surface-container-low"
              >
                <span
                  class="material-symbols-outlined text-lg mt-0.5 text-primary-container"
                  >{{ n.icon }}</span
                >
                <div class="flex flex-col min-w-0">
                  <span class="font-label-md text-label-md text-text-primary">{{
                    n.title
                  }}</span>
                  <span
                    class="font-label-sm text-label-sm text-text-muted mt-0.5"
                    >{{ n.time }}</span
                  >
                </div>
              </div>
              <div
                v-if="!notifs.length"
                class="px-4 py-5 text-center font-body-sm text-body-sm text-text-muted"
              >
                Tidak ada notifikasi
              </div>
            </div>
          </div>
        </div>

        <!-- Avatar dropdown -->
        <div class="relative" v-click-outside="() => (showUserMenu = false)">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 cursor-pointer rounded-lg px-1 py-1 hover:bg-surface-container-low transition-colors"
          >
            <div
              class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary font-label-md font-bold ring-2 ring-primary-fixed"
            >
              {{ initials }}
            </div>
            <span
              class="hidden lg:block font-label-md text-label-md text-text-primary"
              >{{ user?.name }}</span
            >
            <span
              class="material-symbols-outlined text-base text-text-muted hidden lg:block"
              >expand_more</span
            >
          </button>
          <div
            v-if="showUserMenu"
            class="absolute right-0 top-11 w-48 bg-surface-base border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden py-1"
          >
            <RouterLink
              to="/portal/profil"
              @click="showUserMenu = false"
              class="flex items-center gap-2.5 px-4 py-2.5 font-label-md text-label-md text-text-body hover:bg-surface-container-low transition-colors"
            >
              <span class="material-symbols-outlined text-lg text-text-muted"
                >person</span
              >
              Profil Saya
            </RouterLink>
            <div class="h-px bg-border-subtle mx-2 my-1"></div>
            <a
              @click="handleLogout"
              class="flex items-center gap-2.5 px-4 py-2.5 font-label-md text-label-md text-status-danger-text hover:bg-status-danger-bg cursor-pointer transition-colors"
            >
              <span class="material-symbols-outlined text-lg">logout</span>
              Keluar
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const user = computed(() => auth.user);
const initials = computed(() => user.value?.initials || "U");
const showNotif = ref(false);
const showUserMenu = ref(false);
const notifs = ref([
  {
    id: 1,
    icon: "receipt_long",
    title: "Tagihan Oktober belum dibayar",
    time: "Jatuh tempo 25 Okt 2024",
  },
  {
    id: 2,
    icon: "wifi_off",
    title: "Gangguan jaringan di area Anda",
    time: "Kemarin, 14.30",
  },
]);

const navItems = [
  { to: "/portal/beranda", label: "Beranda" },
  { to: "/portal/tagihan", label: "Tagihan Saya" },
  { to: "/portal/layanan", label: "Layanan Saya" },
  { to: "/portal/pengaduan", label: "Pengaduan" },
  { to: "/portal/profil", label: "Profil Saya" },
];

function handleLogout() {
  auth.logout();
  router.push("/portal/login");
}

const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => {
      if (!el.contains(e.target)) binding.value(e);
    };
    document.addEventListener("click", el._handler);
  },
  unmounted(el) {
    document.removeEventListener("click", el._handler);
  },
};
</script>
