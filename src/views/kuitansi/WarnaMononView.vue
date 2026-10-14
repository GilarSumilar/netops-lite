<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div class="w-full max-w-4xl flex flex-col gap-4">
      <div class="bg-white rounded-xl border border-border-subtle p-4 shadow-sm flex items-center justify-between">
        <h1 class="font-headline-sm text-headline-sm text-text-primary font-bold">Warna vs Monokrom</h1>
        <RouterLink to="/portal/beranda" class="inline-flex items-center gap-1 h-9 px-4 rounded-lg border border-border-default text-text-body font-label-md hover:border-primary-container hover:text-primary-container transition-all">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> Kembali
        </RouterLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Color version -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-primary-container">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm font-semibold">Warna</span>
          </div>
          <div class="bg-primary-container text-on-primary rounded-lg p-4 mb-4">
            <p class="font-headline-sm font-bold">NetOps Lite</p>
            <p class="font-label-sm opacity-80">Kuitansi Resmi</p>
          </div>
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between"><span class="text-text-body">Pelanggan</span><span class="font-semibold">Bpk. Agus Setiawan</span></div>
            <div class="flex justify-between"><span class="text-text-body">Paket</span><span class="font-semibold">Fiber Pro 50 Mbps</span></div>
            <div class="flex justify-between border-t pt-2 mt-1"><span class="font-bold">Total</span><span class="font-bold text-primary-container">Rp 250.000</span></div>
          </div>
        </div>
        <!-- Mono version -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-300">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-label-sm font-semibold">Monokrom</span>
          </div>
          <div class="bg-gray-800 text-white rounded-lg p-4 mb-4">
            <p class="font-headline-sm font-bold">NetOps Lite</p>
            <p class="font-label-sm opacity-70">Kuitansi Resmi</p>
          </div>
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between"><span class="text-gray-500">Pelanggan</span><span class="font-semibold">Bpk. Agus Setiawan</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Paket</span><span class="font-semibold">Fiber Pro 50 Mbps</span></div>
            <div class="flex justify-between border-t pt-2 mt-1"><span class="font-bold">Total</span><span class="font-bold">Rp 250.000</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
