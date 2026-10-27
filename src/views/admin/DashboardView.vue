<template>
  <div class="flex w-full min-w-0 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
          <span
            class="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold"
            >NOC Dashboard Overview</span
          >
        </div>
        <p
          v-if="errorMsg"
          role="alert"
          class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text"
        >
          {{ errorMsg }}
        </p>
        <h1
          class="mt-1 font-headline-lg text-headline-lg-mobile tracking-tight text-text-primary sm:text-headline-lg"
        >
          Ringkasan Operasional
        </h1>
        <p class="font-body-md text-body-md text-text-body mt-0.5">
          Pantau performa layanan, tagihan pelanggan, dan respon gangguan hari
          ini.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <AppSelect
          v-model="periodeFilter"
          class="w-full sm:w-56 [&>select]:w-full"
        >
          <option value="bulan-ini">Bulan Ini (Oktober 2024)</option>
          <option value="bulan-lalu">Bulan Lalu (September 2024)</option>
          <option value="triwulan-3">Triwulan 3 (Jul - Sep 2024)</option>
          <option value="tahun-ini">Tahun Berjalan 2024</option>
        </AppSelect>
        <div class="flex gap-2">
          <AppButton variant="secondary" class="flex-1 sm:flex-none">
            <span class="material-symbols-outlined text-lg text-text-muted"
              >download</span
            ><span class="hidden sm:inline">Unduh Laporan</span>
          </AppButton>
          <AppButton
            v-if="auth.isAdmin"
            @click="showPaymentModal = true"
            class="flex-1 sm:flex-none"
          >
            <span class="material-symbols-outlined text-lg">add</span
            ><span>Catat Pembayaran</span>
          </AppButton>
        </div>
      </div>
    </div>
    <div
      :class="[
        'grid grid-cols-1 sm:grid-cols-2 gap-4',
        auth.isAdmin ? 'xl:grid-cols-4' : 'xl:grid-cols-3',
      ]"
    >
      <div
        v-for="s in stats"
        :key="s.label"
        class="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow sm:p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <span
              class="font-body-sm text-body-sm text-text-muted font-medium"
              >{{ s.label }}</span
            >
            <div class="mt-2 flex items-baseline gap-2">
              <span
                class="font-currency-stat text-currency-stat text-text-primary tracking-tight"
                >{{ s.value }}</span
              >
              <span
                v-if="s.unit"
                class="font-body-sm text-body-sm text-text-muted"
                >{{ s.unit }}</span
              >
              <span
                v-if="s.badge"
                :class="[
                  'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold',
                  s.badgeCls,
                ]"
                >{{ s.badge }}</span
              >
            </div>
          </div>
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center',
              s.iconBg,
            ]"
          >
            <span
              class="material-symbols-outlined text-2xl"
              :class="s.iconColor"
              >{{ s.icon }}</span
            >
          </div>
        </div>
        <div
          class="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between font-label-sm text-label-sm"
        >
          <span
            :class="[
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold',
              s.trendCls,
            ]"
          >
            <span class="material-symbols-outlined text-sm">{{
              s.trendIcon
            }}</span
            >{{ s.trend }}
          </span>
          <span class="text-text-muted">{{ s.trendDesc }}</span>
        </div>
      </div>
    </div>
    <div v-if="auth.isAdmin" class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div
        class="lg:col-span-8 bg-surface-base border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-4 sm:p-6"
      >
        <div>
          <h2 class="font-headline-sm text-headline-sm text-text-primary">
            Pendapatan Bulanan
          </h2>
          <p class="font-body-sm text-body-sm text-text-muted">
            Target vs realisasi tagihan terbayar
          </p>
        </div>
        <div class="flex items-end gap-1.5 h-36">
          <div
            v-for="b in chartBars"
            :key="b.label"
            class="flex-1 flex flex-col items-center gap-1"
          >
            <div
              class="w-full flex flex-col justify-end gap-0.5 h-28 relative group"
            >
              <div
                class="w-full rounded-sm bg-border-subtle"
                :style="{ height: b.target }"
              ></div>
              <div
                class="w-full rounded-sm bg-primary-container absolute bottom-0"
                :style="{ height: b.actual }"
              ></div>
              <div
                class="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-overlay text-on-surface text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                {{ b.tooltip }}
              </div>
            </div>
            <span
              class="font-label-sm text-label-sm text-text-muted text-[10px]"
              >{{ b.label }}</span
            >
          </div>
        </div>
        <div
          class="flex items-center gap-4 font-label-sm text-label-sm text-text-muted"
        >
          <span class="flex items-center gap-1.5"
            ><span
              class="w-3 h-2 rounded-sm bg-border-subtle inline-block"
            ></span
            >Target</span
          >
          <span class="flex items-center gap-1.5"
            ><span
              class="w-3 h-2 rounded-sm bg-primary-container inline-block"
            ></span
            >Realisasi</span
          >
        </div>
      </div>
      <div
        class="lg:col-span-4 bg-surface-base border border-border-subtle rounded-xl p-4 shadow-sm flex flex-col gap-4 sm:p-6"
      >
        <div>
          <h2 class="font-headline-sm text-headline-sm text-text-primary">
            Distribusi Paket
          </h2>
          <p class="font-body-sm text-body-sm text-text-muted">
            Komposisi paket aktif saat ini
          </p>
        </div>
        <div class="flex flex-col gap-3">
          <div
            v-for="pkg in packages"
            :key="pkg.name"
            class="flex flex-col gap-1"
          >
            <div
              class="flex items-center justify-between font-label-sm text-label-sm"
            >
              <span class="text-text-primary font-medium">{{ pkg.name }}</span>
              <span class="text-text-muted"
                >{{ pkg.count }} pel. ({{ pkg.pct }}%)</span
              >
            </div>
            <div
              class="h-2 w-full rounded-full bg-surface-container-low overflow-hidden"
            >
              <div
                class="h-full rounded-full"
                :class="pkg.color"
                :style="{ width: pkg.pct + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-sm sm:p-6"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-headline-sm text-headline-sm text-text-primary">
          Aktivitas Terkini
        </h2>
        <RouterLink
          :to="auth.isAdmin ? '/admin/tagihan' : '/admin/pengaduan'"
          class="font-label-md text-label-md text-primary-container hover:underline"
        >
          {{ auth.isAdmin ? "Lihat Tagihan" : "Lihat Tiket" }}
        </RouterLink>
      </div>
      <div class="flex flex-col divide-y divide-border-subtle">
        <div
          v-for="act in activities"
          :key="act.id"
          class="flex items-start gap-3 py-3"
        >
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
              act.iconBg,
            ]"
          >
            <span
              class="material-symbols-outlined text-[16px]"
              :class="act.iconColor"
              >{{ act.icon }}</span
            >
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-label-md text-label-md text-text-primary">
              {{ act.title }}
            </p>
            <p class="font-body-sm text-body-sm text-text-muted line-clamp-2">
              {{ act.desc }}
            </p>
          </div>
          <span
            class="font-label-sm text-label-sm text-text-muted shrink-0 text-[11px] md:text-xs"
            >{{ act.time }}</span
          >
        </div>
      </div>
    </div>
    <AppModal v-model="showPaymentModal" title="Catat Pembayaran">
      <div class="flex flex-col gap-3">
        <AppInput
          v-model="payForm.pelanggan"
          label="ID / Nama Pelanggan"
          placeholder="CUST-001 atau nama..."
        />
        <AppInput
          v-model="payForm.periode"
          label="Periode Tagihan"
          placeholder="Oktober 2026"
        />
        <AppInput
          v-model="payForm.jumlah"
          label="Jumlah Pembayaran"
          placeholder="250000"
        />
        <AppSelect
          v-model="payForm.metode"
          label="Metode Pembayaran"
          class="[&>select]:w-full"
        >
          <option value="">Pilih metode...</option>
          <option>Transfer Bank</option>
          <option>Tunai</option>
          <option>QRIS</option>
          <option>Virtual Account</option>
        </AppSelect>
      </div>
      <p
        v-if="errorMsg"
        role="alert"
        class="rounded-lg bg-status-danger-bg px-3 py-2 font-body-sm text-status-danger-text"
      >
        {{ errorMsg }}
      </p>
      <div class="flex gap-3 pt-1">
        <AppButton
          variant="outline"
          :full="true"
          @click="showPaymentModal = false"
          >Batal</AppButton
        >
        <AppButton :full="true" @click="submitPayment">Simpan</AppButton>
      </div>
    </AppModal>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import AppButton from "@/components/AppButton.vue";
import AppInput from "@/components/AppInput.vue";
import AppSelect from "@/components/AppSelect.vue";
import AppModal from "@/components/AppModal.vue";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/services/api";
const auth = useAuthStore();
const periodeFilter = ref("bulan-ini");
const showPaymentModal = ref(false);
const errorMsg = ref("");
const customers = ref([]);
const tagihans = ref([]);
const tickets = ref([]);
const paketList = ref([]);
const payForm = reactive({
  pelanggan: "",
  periode: "",
  jumlah: "",
  metode: "",
});
const money = (value) => `Rp ${value.toLocaleString("id-ID")}`;
const numberAmount = (value) =>
  Number(String(value || "").replace(/\D/g, "")) || 0;
onMounted(loadDashboard);
async function loadDashboard() {
  try {
    const results = auth.isAdmin
      ? await Promise.all([
          api.list("pelanggan"),
          api.list("tagihan"),
          api.list("pengaduan"),
          api.list("paket"),
        ])
      : await Promise.all([api.list("pelanggan"), api.list("pengaduan")]);
    customers.value = results[0];
    if (auth.isAdmin) {
      tagihans.value = results[1];
      tickets.value = results[2];
      paketList.value = results[3];
    } else {
      tickets.value = results[1];
    }
  } catch (error) {
    errorMsg.value = `Gagal memuat dashboard: ${error.message}`;
  }
}
const stats = computed(() => {
  const activeCustomers = customers.value.filter(
    (customer) => customer.status === "aktif",
  ).length;
  const openTickets = tickets.value.filter(
    (ticket) => ticket.status !== "selesai",
  );
  if (!auth.isAdmin)
    return [
      {
        label: "Total Pelanggan",
        value: customers.value.length,
        unit: "Data pelanggan",
        icon: "group",
        iconBg: "bg-primary-fixed/40",
        iconColor: "text-primary-container",
        trend: "Tersedia",
        trendIcon: "engineering",
        trendCls: "bg-primary-fixed text-primary-container",
        trendDesc: "Untuk penanganan",
      },
      {
        label: "Pelanggan Aktif",
        value: activeCustomers,
        unit: "Layanan",
        icon: "wifi_tethering",
        iconBg: "bg-status-success-bg/70",
        iconColor: "text-status-success-text",
        trend: "Status layanan",
        trendIcon: "wifi",
        trendCls: "bg-status-success-bg text-status-success-text",
        trendDesc: "Saat ini",
      },
      {
        label: "Tiket Aktif",
        value: openTickets.length,
        unit: "Tiket",
        icon: "support_agent",
        iconBg: "bg-status-warning-bg",
        iconColor: "text-status-warning-text",
        trend: "Perlu tindak lanjut",
        trendIcon: "priority_high",
        trendCls: "bg-status-warning-bg text-status-warning-text",
        trendDesc: "Belum selesai",
      },
    ];
  const paidTotal = tagihans.value
    .filter((row) => row.status === "lunas")
    .reduce((sum, row) => sum + numberAmount(row.nominal), 0);
  return [
    {
      label: "Total Pelanggan",
      value: customers.value.length,
      unit: "Subscribers",
      icon: "group",
      iconBg: "bg-primary-fixed/40",
      iconColor: "text-primary-container",
      trend: "Tercatat",
      trendIcon: "groups",
      trendCls: "bg-status-success-bg text-status-success-text",
      trendDesc: "Akun pelanggan",
    },
    {
      label: "Pelanggan Aktif",
      value: activeCustomers,
      unit: "Layanan",
      icon: "wifi_tethering",
      iconBg: "bg-status-success-bg/70",
      iconColor: "text-status-success-text",
      trend: "Status layanan",
      trendIcon: "wifi",
      trendCls: "bg-status-success-bg text-status-success-text",
      trendDesc: "Saat ini",
    },
    {
      label: "Tagihan Lunas",
      value: money(paidTotal),
      icon: "payments",
      iconBg: "bg-tertiary/20",
      iconColor: "text-tertiary",
      trend: `${tagihans.value.filter((row) => row.status === "lunas").length} tagihan`,
      trendIcon: "percent",
      trendCls: "bg-primary-fixed text-primary-container",
      trendDesc: "Tercatat lunas",
    },
    {
      label: "Tiket Aktif",
      value: openTickets.length,
      unit: "Tiket",
      icon: "support_agent",
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning-text",
      trend: "Perlu tindak lanjut",
      trendIcon: "support_agent",
      trendCls: "bg-status-warning-bg text-status-warning-text",
      trendDesc: "Belum selesai",
    },
  ];
});
const chartBars = computed(() => {
  const periods = ["Mei", "Jun", "Jul", "Agu", "Sep", "Okt"];
  const monthly = periods.map((label) =>
    tagihans.value
      .filter(
        (row) =>
          row.status === "lunas" &&
          row.periode?.toLowerCase().startsWith(label.toLowerCase()),
      )
      .reduce((sum, row) => sum + numberAmount(row.nominal), 0),
  );
  const max = Math.max(...monthly, 1);
  return periods.map((label, index) => ({
    label,
    target: "100%",
    actual: `${Math.round((monthly[index] / max) * 100)}%`,
    tooltip: money(monthly[index]),
  }));
});
const packages = computed(() => {
  const counts = new Map();
  for (const customer of customers.value.filter(
    (item) => item.status === "aktif",
  )) {
    counts.set(customer.paket, (counts.get(customer.paket) || 0) + 1);
  }
  const colors = [
    "bg-primary-container",
    "bg-tertiary",
    "bg-status-success-text",
    "bg-border-default",
  ];
  const total =
    [...counts.values()].reduce((sum, count) => sum + count, 0) || 1;
  return [...counts.entries()].map(([name, count], index) => ({
    name,
    count,
    pct: Math.round((count / total) * 100),
    color: colors[index % colors.length],
  }));
});
const activities = computed(() =>
  [
    ...tickets.value.map((ticket) => ({
      id: `ticket-${ticket.id}`,
      title: "Tiket Pengaduan",
      desc: `${ticket.pelanggan} - ${ticket.judul}`,
      time: ticket.status,
      icon: "support_agent",
      iconBg: "bg-status-warning-bg",
      iconColor: "text-status-warning-text",
    })),
    ...tagihans.value
      .filter((invoice) => invoice.status === "lunas")
      .map((invoice) => ({
        id: `invoice-${invoice.id}`,
        title: "Pembayaran Diterima",
        desc: `${invoice.nama} - ${invoice.nominal} via ${invoice.metode}`,
        time: invoice.tglBayar || invoice.periode,
        icon: "check_circle",
        iconBg: "bg-status-success-bg",
        iconColor: "text-status-success-text",
      })),
  ]
    .slice(-4)
    .reverse(),
);
async function submitPayment() {
  const amount = numberAmount(payForm.jumlah);
  if (
    !payForm.pelanggan.trim() ||
    !payForm.periode.trim() ||
    !payForm.metode ||
    amount <= 0
  ) {
    errorMsg.value = "Pelanggan, periode, nominal, dan metode wajib diisi.";
    return;
  }
  try {
    errorMsg.value = "";
    const invoice = await api.create("tagihan", {
      nama: payForm.pelanggan.trim(),
      periode: payForm.periode.trim(),
      nominal: money(amount),
      status: "lunas",
      metode: payForm.metode,
      tglBayar: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
    tagihans.value.push(invoice);
    showPaymentModal.value = false;
    Object.assign(payForm, {
      pelanggan: "",
      periode: "",
      jumlah: "",
      metode: "",
    });
  } catch (error) {
    errorMsg.value = `Gagal mencatat pembayaran: ${error.message}`;
  }
}
</script>
