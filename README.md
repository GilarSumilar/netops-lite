# NetOps Lite

Sistem manajemen ISP RT-RW berbasis Vue 3 + Vite. Migrasi dari 27 halaman HTML flat monolitik ke SPA.

- **Stack:** Vue 3, Vite, Vue Router, Pinia, Tailwind CSS
- **Live:** [netops-lite.vercel.app](https://netops-lite.vercel.app) _(update setelah deploy berhasil)_
- **Repo:** [github.com/RezaRiyaldi/netops-lite](https://github.com/RezaRiyaldi/netops-lite)

---

## Fase 1 — Migrasi Struktur & Routing ✅

Semua halaman HTML dikonversi ke `.vue`, router dikonfigurasi, layout terpisah antara Admin dan Portal.

### Admin

| View                 | Route               | Status |
| -------------------- | ------------------- | ------ |
| `LoginView.vue`      | `/admin/login`      | ✅     |
| `DashboardView.vue`  | `/admin/dashboard`  | ✅     |
| `PelangganView.vue`  | `/admin/pelanggan`  | ✅     |
| `TagihanView.vue`    | `/admin/tagihan`    | ✅     |
| `PaketView.vue`      | `/admin/paket`      | ✅     |
| `PengaduanView.vue`  | `/admin/pengaduan`  | ✅     |
| `RouterView.vue`     | `/admin/router`     | ✅     |
| `AkunView.vue`       | `/admin/akun`       | ✅     |
| `PengaturanView.vue` | `/admin/pengaturan` | ✅     |

### Portal (Pelanggan)

| View                    | Route                    | Status |
| ----------------------- | ------------------------ | ------ |
| `LoginView.vue`         | `/portal/login`          | ✅     |
| `RegisterView.vue`      | `/portal/register`       | ✅     |
| `BerandaView.vue`       | `/portal/beranda`        | ✅     |
| `TagihanView.vue`       | `/portal/tagihan`        | ✅     |
| `LayananView.vue`       | `/portal/layanan`        | ✅     |
| `PengaduanView.vue`     | `/portal/pengaduan`      | ✅     |
| `ProfilView.vue`        | `/portal/profil`         | ✅     |
| `SimulasiBayarView.vue` | `/portal/simulasi-bayar` | ✅     |

### Kuitansi

| View                  | Route                    | Status |
| --------------------- | ------------------------ | ------ |
| `PratinjauA4View.vue` | `/kuitansi/pratinjau-a4` | ✅     |
| `GridMarginView.vue`  | `/kuitansi/grid-margin`  | ✅     |
| `HeatmapView.vue`     | `/kuitansi/heatmap`      | ✅     |
| `OverlayDiffView.vue` | `/kuitansi/overlay-diff` | ✅     |
| `WarnaMononView.vue`  | `/kuitansi/warna-monon`  | ✅     |

---

## Fase 2 — Shared Components, Action Handlers & Modal ✅

Raw HTML elements diganti komponen bersama. Aksi yang sudah terhubung memiliki
handler, modal, dan feedback; beberapa kontrol masih berupa tampilan demo dan
dijelaskan pada bagian batasan fitur.

### Shared Components (`src/components/`)

| Komponen           | Deskripsi                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `AppButton.vue`    | variant `primary/secondary/ghost/danger/outline`; size `sm/md/lg`; prop `full`, `to` (RouterLink mode)               |
| `AppInput.vue`     | Input dengan label, placeholder, type, error state                                                                   |
| `AppSelect.vue`    | Select dengan label; slot default untuk `<option>`                                                                   |
| `AppModal.vue`     | Modal backdrop, `max-width` prop, slot konten                                                                        |
| `AppDataTable.vue` | Paginasi, search (internal/external), per-page dropdown, slot `#cell-{key}` custom render, slot `#actions` per baris |

### Admin

| View                 | Fitur                                                                                        | Status |
| -------------------- | -------------------------------------------------------------------------------------------- | ------ |
| `AdminHeader.vue`    | Notif dropdown + badge + tandai dibaca; search routing; Catat Pembayaran → `/admin/tagihan`  | ✅     |
| `AdminSidebar.vue`   | `more_vert` dropdown; Pengaturan → `/admin/pengaturan`; `v-click-outside`                    | ✅     |
| `DashboardView.vue`  | Modal Catat Pembayaran                                                                       | ✅     |
| `PelangganView.vue`  | AppDataTable + filter status; modal Detail, Edit (pre-fill + reaktif), Hapus (konfirmasi)    | ✅     |
| `TagihanView.vue`    | AppDataTable + filter; modal Detail, Tandai Lunas, Catat Pembayaran; kuitansi → pratinjau-a4 | ✅     |
| `PaketView.vue`      | Tambah/Edit modal; Delete konfirmasi; list reaktif                                           | ✅     |
| `PengaduanView.vue`  | Modal Tangani: update status + catatan; reaktif                                              | ✅     |
| `PengaturanView.vue` | 4 tab: Profil, Keamanan (ganti sandi), Notifikasi, Sistem                                    | ✅     |

### Portal

| View                     | Fitur                                                        | Status |
| ------------------------ | ------------------------------------------------------------ | ------ |
| `PortalTopNav.vue`       | Logo RouterLink; notif dropdown; avatar dropdown             | ✅     |
| `PortalHeaderMobile.vue` | Logo RouterLink; notif dropdown; avatar → profil             | ✅     |
| `PortalFooter.vue`       | Komponen baru: brand, nav links, kontak, bottom bar          | ✅     |
| `PortalLayout.vue`       | Render PortalFooter                                          | ✅     |
| `LayananView.vue`        | Modal Upgrade Paket + success feedback                       | ✅     |
| `PengaduanView.vue`      | Submit tiket baru via modal                                  | ✅     |
| `ProfilView.vue`         | Modal Edit Profil; Modal Ganti Sandi + validasi mismatch     | ✅     |
| `SimulasiBayarView.vue`  | Flow 3 step: Ringkasan → Instruksi → Selesai + no. referensi | ✅     |

---

## Fase 3 — Integrasi Data & API 🔄

Data operasional disimpan di file JSON lokal melalui API Node. Fitur yang memerlukan
payment gateway atau perangkat router sungguhan masih berupa simulasi.

| View                                                  | Tugas                                                 | Status |
| ----------------------------------------------------- | ----------------------------------------------------- | ------ |
| `DashboardView.vue`                                   | Statistik dari JSON sesuai role; layout kartu teknisi responsif | ✅ |
| `PelangganView.vue`                                   | CRUD pelanggan via JSON API                           | ✅     |
| `TagihanView.vue`                                     | CRUD tagihan; catat dan tandai pembayaran             | ✅     |
| `PaketView.vue`                                       | CRUD paket via JSON API                               | ✅     |
| `PengaduanView.vue`                                   | Admin mengelola tiket; teknisi memperbarui status/catatan; pelanggan mengirim tiket | ✅ |
| `PengaturanView.vue`                                  | Ganti kata sandi melalui sesi API                     | ✅     |
| `AkunView.vue`                                        | Kelola akun staf dan role admin/teknisi               | ✅     |
| Portal — beranda, tagihan, layanan, profil, pengaduan | Data terautentikasi dan ditautkan lewat email         | ✅     |
| `SimulasiBayarView.vue`                               | Alur demo pembayaran; payment gateway belum terintegrasi | ✅ |

---

## Fase 4 — Auth & Guard ✅

| Tugas                                                | Status |
| ---------------------------------------------------- | ------ |
| Implementasi Pinia auth store                        | ✅     |
| Route guard admin dan portal                         | ✅     |
| Sesi cookie HttpOnly dan hak akses API berbasis role | ✅     |
| Registrasi pelanggan dan tautan akun melalui email   | ✅     |

### Hak Akses

| Role | Akses |
| ---- | ----- |
| Admin | Akses penuh ke data operasional dan pengelolaan akun staf |
| Teknisi | Dashboard, data pelanggan, tiket pengaduan, dan halaman monitoring router; tidak dapat mengakses tagihan, paket, pengaturan, atau akun staf |
| Pelanggan | Portal dengan data tagihan, layanan, profil, dan pengaduan yang tertaut ke akunnya |

Dashboard admin menampilkan ringkasan pelanggan, tagihan lunas, tiket aktif,
grafik pendapatan bulanan, distribusi paket, dan aktivitas terkini. Dashboard
teknisi menampilkan total pelanggan, pelanggan aktif, serta tiket yang belum
selesai dalam tiga kartu responsif. Kontrol periode diletakkan rata kiri di
bawah judul dashboard. Pemilih periode dan tombol unduh laporan saat ini hanya
berupa tampilan; belum memfilter data atau menghasilkan berkas laporan.

Halaman **Manajemen Router** menampilkan metrik dan sesi contoh dari API lokal.
Integrasi langsung dengan perangkat MikroTik belum tersedia, sehingga nilai
status, trafik, dan PPPoE bukan data perangkat sungguhan.

---

## Fase 5 — Polish & Production 🔲

| Tugas                                     | Status |
| ----------------------------------------- | ------ |
| Loading skeleton state di semua list view | 🔲     |
| Error boundary + toast notifikasi global  | 🔲     |
| Form validation (Zod atau VeeValidate)    | 🔲     |
| PWA / offline support                     | 🔲     |
| Lighthouse audit (performance, a11y)      | 🔲     |

---

## Development

```bash
npm install
npm run api      # terminal 1: JSON API di localhost:3001
npm run dev      # terminal 2: frontend di localhost:5173
npm run build    # output ke dist/
npm run preview  # preview build lokal
```

Data prototype tersimpan di `data/netops.json`. API membaca dan menulis koleksi
`pelanggan`, `paket`, `tagihan`, `pengaduan`, dan `akun`. Password disimpan dalam
bentuk hash; sesi menggunakan cookie HttpOnly. Email akun portal yang sama
dengan email pelanggan akan ditautkan otomatis. Akun tanpa pasangan pelanggan
tetap dapat masuk, tetapi portal menampilkan status "Belum berlangganan".

Frontend berjalan di `http://localhost:5173` dan meneruskan permintaan `/api`
ke API di `http://localhost:3001`. Sesi disimpan di memori server selama 8 jam;
restart API akan mengakhiri sesi aktif.

Akun demo dibuat otomatis saat API pertama dijalankan:

| Role                      | Email                    | Kata sandi             |
| ------------------------- | ------------------------ | ---------------------- |
| Admin                     | `budi.santoso@netops.id` | `NetOpsNOC#2025Secure` |
| Teknisi                   | `dani.pratama@netops.id` | `TeknisiDemo#2025`     |
| Pelanggan demo (CUST-001) | `agus@example.com`       | `pelanggan123`         |

Role admin memiliki akses penuh dan dapat mengelola akun staf. Teknisi dapat
melihat data pelanggan serta mengelola tiket, tetapi tidak dapat membuka tagihan,
paket, pengaturan, atau akun staf. Pelanggan hanya dapat melihat data yang
tertaut ke akunnya. Daftar akun di atas adalah kredensial demo lokal; ganti
sebelum penggunaan di luar lingkungan pengembangan.

Simulasi pembayaran portal hanya menampilkan alur demo dan tidak memproses
pembayaran atau mengubah tagihan. Fitur permintaan upgrade paket juga belum
menyimpan perubahan ke API.

Buat salinan file JSON sebelum mengubah atau menghapus data. Penyimpanan JSON,
akun demo, dan sesi dalam memori hanya untuk prototype lokal; jangan gunakan
kredensial demo atau deploy API ini terbuka ke publik.

## Deploy

Vercel saat ini hanya menangani build frontend dan SPA routing melalui
`vercel.json`. API Node, penyimpanan JSON, dan sesi prototype tidak otomatis
dideploy oleh konfigurasi tersebut. Untuk deployment produksi, API memerlukan
hosting dan penyimpanan persisten yang sesuai; jangan gunakan konfigurasi
prototype ini sebagai backend publik.
