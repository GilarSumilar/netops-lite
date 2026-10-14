<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div class="w-full max-w-[794px] flex flex-col gap-4">
      <!-- Toolbar -->
      <div class="flex items-center justify-between bg-white rounded-xl border border-border-subtle p-3 shadow-sm">
        <h1 class="font-headline-sm text-headline-sm text-text-primary font-bold">Pratinjau Kuitansi A4</h1>
        <div class="flex gap-2">
          <button @click="print" class="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary-container text-on-primary font-label-md hover:bg-primary transition-all">
            <span class="material-symbols-outlined text-[16px]">print</span> Cetak
          </button>
          <RouterLink to="/portal/beranda" class="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-border-default text-text-body font-label-md hover:border-primary-container hover:text-primary-container transition-all">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span> Kembali
          </RouterLink>
        </div>
      </div>
      <!-- A4 paper -->
      <div class="bg-white shadow-xl rounded-lg overflow-hidden" style="width:794px;min-height:1123px;padding:48px" id="receipt-a4">
        <!-- Header -->
        <div class="flex items-start justify-between border-b-2 border-primary pb-6 mb-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <span class="material-symbols-outlined text-on-primary text-[20px]">router</span>
              </div>
              <div>
                <p class="font-headline-sm text-headline-sm text-text-primary font-bold">NetOps Lite</p>
                <p class="font-label-sm text-label-sm text-text-muted">ISP &amp; RT-RW Management</p>
              </div>
            </div>
            <p class="font-body-sm text-body-sm text-text-body">Jl. Teknologi No. 45, Kota Digital</p>
            <p class="font-body-sm text-body-sm text-text-body">Telp: (021) 555-0123 | info@netops.id</p>
          </div>
          <div class="text-right">
            <p class="font-headline-sm text-headline-sm text-primary font-bold">KUITANSI RESMI</p>
            <p class="font-label-md text-label-md text-text-muted">No: KWT-2024-10-1001</p>
            <p class="font-label-md text-label-md text-text-muted">Tanggal: 5 Oktober 2024</p>
            <span class="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-status-success-bg text-status-success-text font-label-sm font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-status-success-text"></span> LUNAS
            </span>
          </div>
        </div>
        <!-- Customer info -->
        <div class="bg-surface-container-low rounded-lg p-4 mb-6 grid grid-cols-2 gap-3">
          <div v-for="f in customerFields" :key="f.label">
            <p class="font-label-sm text-label-sm text-text-muted">{{ f.label }}</p>
            <p class="font-label-md text-label-md text-text-primary font-semibold mt-0.5">{{ f.value }}</p>
          </div>
        </div>
        <!-- Items table -->
        <table class="w-full mb-6">
          <thead><tr class="bg-primary-container text-on-primary">
            <th class="text-left px-4 py-3 font-label-md text-label-md rounded-tl-lg">Deskripsi</th>
            <th class="text-center px-4 py-3 font-label-md text-label-md">Periode</th>
            <th class="text-right px-4 py-3 font-label-md text-label-md rounded-tr-lg">Jumlah</th>
          </tr></thead>
          <tbody>
            <tr class="border-b border-border-subtle">
              <td class="px-4 py-3 font-body-md text-body-md text-text-primary">Layanan Internet Fiber Pro 50 Mbps</td>
              <td class="px-4 py-3 font-body-md text-body-md text-text-body text-center">Oktober 2024</td>
              <td class="px-4 py-3 font-label-md text-label-md text-text-primary font-semibold text-right">Rp 250.000</td>
            </tr>
            <tr><td colspan="2" class="px-4 py-3 font-label-lg text-label-lg text-text-primary font-bold text-right">Total Pembayaran</td>
              <td class="px-4 py-3 font-headline-sm text-headline-sm text-primary font-bold text-right">Rp 250.000</td>
            </tr>
          </tbody>
        </table>
        <!-- Footer -->
        <div class="border-t border-border-subtle pt-4 flex justify-between items-end">
          <p class="font-body-sm text-body-sm text-text-muted max-w-xs">Kuitansi ini adalah bukti pembayaran yang sah. Simpan sebagai arsip Anda.</p>
          <div class="text-center">
            <p class="font-label-sm text-label-sm text-text-muted mb-8">Hormat kami,</p>
            <p class="font-label-md text-label-md text-text-primary font-semibold border-t border-border-default pt-1">Budi Santoso</p>
            <p class="font-label-sm text-label-sm text-text-muted">Admin NetOps Lite</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const customerFields = [
  { label:'Nama Pelanggan', value:'Bpk. Agus Setiawan' },
  { label:'ID Pelanggan',   value:'CUST-2024-035' },
  { label:'Alamat',         value:'Jl. Melati No. 12, RT 03/RW 01' },
  { label:'Paket Layanan',  value:'Fiber Pro 50 Mbps' },
]
function print() { window.print() }
</script>

<style>
@media print {
  /* Hide everything except the receipt */
  body * { visibility: hidden; }
  #receipt-a4, #receipt-a4 * { visibility: visible; }
  #receipt-a4 {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    padding: 32px !important;
  }
  /* Force Tailwind color classes to render (print strips bg by default) */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
</style>
