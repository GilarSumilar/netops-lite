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
| `LoginView.vue` | `/admin/login` | ✅ Done |
| `DashboardView.vue` | `/admin/dashboard` | ✅ Done |
| `PelangganView.vue` | `/admin/pelanggan` | ✅ Done |
| `TagihanView.vue` | `/admin/tagihan` | ✅ Done |
| `PaketView.vue` | `/admin/paket` | ✅ Done |
| `PengaduanView.vue` | `/admin/pengaduan` | ✅ Done |

### Portal (Pelanggan)

| View | Route | Status |
|------|-------|--------|
| `LoginView.vue` | `/portal/login` | ✅ Done |
| `BerandaView.vue` | `/portal/beranda` | ✅ Done |
| `TagihanView.vue` | `/portal/tagihan` | ✅ Done |
| `LayananView.vue` | `/portal/layanan` | ✅ Done |
| `PengaduanView.vue` | `/portal/pengaduan` | ✅ Done |
| `ProfilView.vue` | `/portal/profil` | ✅ Done |
| `SimulasiBayarView.vue` | `/portal/simulasi-bayar` | ✅ Done |

### Kuitansi

| View | Route | Status |
|------|-------|--------|
| `PratinjauA4View.vue` | `/kuitansi/pratinjau-a4` | ✅ Done |
| `GridMarginView.vue` | `/kuitansi/grid-margin` | ✅ Done |
| `HeatmapView.vue` | `/kuitansi/heatmap` | ✅ Done |
| `OverlayDiffView.vue` | `/kuitansi/overlay-diff` | ✅ Done |
| `WarnaMononView.vue` | `/kuitansi/warna-monon` | ✅ Done |

---

## Fase 2 — Action Handlers & Modal ✅

Semua tombol yang sebelumnya dummy diberi handler, modal, dan feedback.

### Admin

| View | Fitur | Status |
|------|-------|--------|
| `DashboardView.vue` | Modal Catat Pembayaran dari dashboard | ✅ Done |
| `TagihanView.vue` | Tombol "Catat Pembayaran" → modal form pelanggan/jumlah/metode | ✅ Done |
| `PaketView.vue` | Tombol Tambah → modal form baru; Tombol Edit → modal pre-filled; Tombol Delete → konfirmasi dialog; list reaktif | ✅ Done |
| `PengaduanView.vue` | Tombol "Tangani" → modal update status + catatan; status berubah reaktif di list | ✅ Done |

### Portal

| View | Fitur | Status |
|------|-------|--------|
| `TagihanView.vue` | Fix route "Bayar Sekarang" `/portal/simulasi` → `/portal/simulasi-bayar` | ✅ Done |
| `LayananView.vue` | Modal Upgrade Paket → pilih paket, submit, success feedback, auto-close 2.5s | ✅ Done |
| `ProfilView.vue` | Modal Edit Profil; Modal Ganti Kata Sandi dengan validasi konfirmasi mismatch | ✅ Done |
| `SimulasiBayarView.vue` | Flow 3 step: Ringkasan → Instruksi per metode → Selesai + no. referensi | ✅ Done |

### Kuitansi

| View | Fitur | Status |
|------|-------|--------|
| `PratinjauA4View.vue` | Fix print blank — ganti selector `body > *:not(#id)` ke `visibility` trick + `print-color-adjust: exact` | ✅ Done |

---

## Fase 3 — Integrasi Data & API 🔲

Semua data saat ini dummy/hardcoded. Fase ini menghubungkan ke backend nyata.

### Admin

| View | Tugas | Status |
|------|-------|--------|
| `DashboardView.vue` | Fetch statistik dari API | 🔲 Todo |
| `PelangganView.vue` | CRUD pelanggan via API; pagination | 🔲 Todo |
| `TagihanView.vue` | Fetch tagihan; submit pembayaran ke API | 🔲 Todo |
| `PaketView.vue` | CRUD paket via API | 🔲 Todo |
| `PengaduanView.vue` | Fetch tiket; update status via API | 🔲 Todo |

### Portal

| View | Tugas | Status |
|------|-------|--------|
| `BerandaView.vue` | Fetch data pelanggan login dari API | 🔲 Todo |
| `TagihanView.vue` | Fetch tagihan aktif pelanggan | 🔲 Todo |
| `LayananView.vue` | Submit request upgrade ke API | 🔲 Todo |
| `PengaduanView.vue` | Submit tiket baru; fetch riwayat tiket | 🔲 Todo |
| `ProfilView.vue` | Submit edit profil + ganti password via API | 🔲 Todo |
| `SimulasiBayarView.vue` | Verifikasi pembayaran via payment gateway | 🔲 Todo |

---

## Fase 4 — Auth & Guard 🔲

| Tugas | Status |
|-------|--------|
| Implementasi Pinia auth store | 🔲 Todo |
| Route guard admin (redirect ke `/admin/login` jika belum login) | 🔲 Todo |
| Route guard portal (redirect ke `/portal/login` jika belum login) | 🔲 Todo |
| Persistent session (localStorage / token refresh) | 🔲 Todo |

---

## Fase 5 — Polish & Production 🔲

| Tugas | Status |
|-------|--------|
| Loading skeleton state di semua list view | 🔲 Todo |
| Error boundary + toast notifikasi global | 🔲 Todo |
| Form validation library (atau Zod) | 🔲 Todo |
| PWA / offline support | 🔲 Todo |
| Lighthouse audit (performance, a11y) | 🔲 Todo |

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
