# NetOps Lite

Sistem manajemen ISP RT-RW berbasis Vue 3 + Vite. Migrasi dari 27 halaman HTML flat monolitik ke SPA.

- **Stack:** Vue 3, Vite, Vue Router, Pinia, Tailwind CSS
- **Live:** [netops-lite.vercel.app](https://netops-lite.vercel.app) _(update setelah deploy berhasil)_
- **Repo:** [github.com/RezaRiyaldi/netops-lite](https://github.com/RezaRiyaldi/netops-lite)

---

## Fase 1 — Migrasi Struktur & Routing ✅

Semua halaman HTML dikonversi ke `.vue`, router dikonfigurasi, layout terpisah antara Admin dan Portal.

### Admin

| View | Route | Status |
|------|-------|--------|
| `LoginView.vue` | `/admin/login` | ✅ |
| `DashboardView.vue` | `/admin/dashboard` | ✅ |
| `PelangganView.vue` | `/admin/pelanggan` | ✅ |
| `TagihanView.vue` | `/admin/tagihan` | ✅ |
| `PaketView.vue` | `/admin/paket` | ✅ |
| `PengaduanView.vue` | `/admin/pengaduan` | ✅ |
| `PengaturanView.vue` | `/admin/pengaturan` | ✅ |

### Portal (Pelanggan)

| View | Route | Status |
|------|-------|--------|
| `LoginView.vue` | `/portal/login` | ✅ |
| `BerandaView.vue` | `/portal/beranda` | ✅ |
| `TagihanView.vue` | `/portal/tagihan` | ✅ |
| `LayananView.vue` | `/portal/layanan` | ✅ |
| `PengaduanView.vue` | `/portal/pengaduan` | ✅ |
| `ProfilView.vue` | `/portal/profil` | ✅ |
| `SimulasiBayarView.vue` | `/portal/simulasi-bayar` | ✅ |

### Kuitansi

| View | Route | Status |
|------|-------|--------|
| `PratinjauA4View.vue` | `/kuitansi/pratinjau-a4` | ✅ |
| `GridMarginView.vue` | `/kuitansi/grid-margin` | ✅ |
| `HeatmapView.vue` | `/kuitansi/heatmap` | ✅ |
| `OverlayDiffView.vue` | `/kuitansi/overlay-diff` | ✅ |
| `WarnaMononView.vue` | `/kuitansi/warna-monon` | ✅ |

---

## Fase 2 — Shared Components, Action Handlers & Modal ✅

Raw HTML elements diganti komponen bersama. Semua tombol dummy diberi handler, modal, dan feedback reaktif.

### Shared Components (`src/components/`)

| Komponen | Deskripsi |
|----------|-----------|
| `AppButton.vue` | variant `primary/secondary/ghost/danger/outline`; size `sm/md/lg`; prop `full`, `to` (RouterLink mode) |
| `AppInput.vue` | Input dengan label, placeholder, type, error state |
| `AppSelect.vue` | Select dengan label; slot default untuk `<option>` |
| `AppModal.vue` | Modal backdrop, `max-width` prop, slot konten |
| `AppDataTable.vue` | Paginasi, search (internal/external), per-page dropdown, slot `#cell-{key}` custom render, slot `#actions` per baris |

### Admin

| View | Fitur | Status |
|------|-------|--------|
| `AdminHeader.vue` | Notif dropdown + badge + tandai dibaca; search routing; Catat Pembayaran → `/admin/tagihan` | ✅ |
| `AdminSidebar.vue` | `more_vert` dropdown; Pengaturan → `/admin/pengaturan`; `v-click-outside` | ✅ |
| `DashboardView.vue` | Modal Catat Pembayaran | ✅ |
| `PelangganView.vue` | AppDataTable + filter status; modal Detail, Edit (pre-fill + reaktif), Hapus (konfirmasi) | ✅ |
| `TagihanView.vue` | AppDataTable + filter; modal Detail, Tandai Lunas, Catat Pembayaran; kuitansi → pratinjau-a4 | ✅ |
| `PaketView.vue` | Tambah/Edit modal; Delete konfirmasi; list reaktif | ✅ |
| `PengaduanView.vue` | Modal Tangani: update status + catatan; reaktif | ✅ |
| `PengaturanView.vue` | 4 tab: Profil, Keamanan (ganti sandi + sesi), Notifikasi (toggles), Sistem (info + ISP config + reset modal) | ✅ |

### Portal

| View | Fitur | Status |
|------|-------|--------|
| `PortalTopNav.vue` | Logo RouterLink; notif dropdown; avatar dropdown | ✅ |
| `PortalHeaderMobile.vue` | Logo RouterLink; notif dropdown; avatar → profil | ✅ |
| `PortalFooter.vue` | Komponen baru: brand, nav links, kontak, bottom bar | ✅ |
| `PortalLayout.vue` | Render PortalFooter | ✅ |
| `LayananView.vue` | Modal Upgrade Paket + success feedback | ✅ |
| `PengaduanView.vue` | Submit tiket baru via modal | ✅ |
| `ProfilView.vue` | Modal Edit Profil; Modal Ganti Sandi + validasi mismatch | ✅ |
| `SimulasiBayarView.vue` | Flow 3 step: Ringkasan → Instruksi → Selesai + no. referensi | ✅ |

---

## Fase 3 — Integrasi Data & API 🔲

Semua data saat ini dummy/hardcoded.

| View | Tugas | Status |
|------|-------|--------|
| `DashboardView.vue` | Fetch statistik dari API | 🔲 |
| `PelangganView.vue` | CRUD pelanggan via API | 🔲 |
| `TagihanView.vue` | Fetch tagihan; submit pembayaran | 🔲 |
| `PaketView.vue` | CRUD paket via API | 🔲 |
| `PengaduanView.vue` | Fetch + update tiket via API | 🔲 |
| `PengaturanView.vue` | Simpan profil admin + konfigurasi ISP | 🔲 |
| Portal — semua view | Fetch data pelanggan login; submit form via API | 🔲 |
| `SimulasiBayarView.vue` | Verifikasi pembayaran via payment gateway | 🔲 |

---

## Fase 4 — Auth & Guard 🔲

| Tugas | Status |
|-------|--------|
| Implementasi Pinia auth store | 🔲 |
| Route guard admin (`/admin/login`) | 🔲 |
| Route guard portal (`/portal/login`) | 🔲 |
| Persistent session (localStorage / token refresh) | 🔲 |

---

## Fase 5 — Polish & Production 🔲

| Tugas | Status |
|-------|--------|
| Loading skeleton state di semua list view | 🔲 |
| Error boundary + toast notifikasi global | 🔲 |
| Form validation (Zod atau VeeValidate) | 🔲 |
| PWA / offline support | 🔲 |
| Lighthouse audit (performance, a11y) | 🔲 |

---

## Development

```bash
npm install
npm run dev      # localhost:5173
npm run build    # output ke dist/
npm run preview  # preview build lokal
```

## Deploy

Push ke `master` → Vercel auto-deploy. SPA routing ditangani `vercel.json`.
