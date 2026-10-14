<template>
  <div class="flex flex-col min-h-screen bg-background-canvas">
    <!-- Desktop top nav (md+) -->
    <PortalTopNav class="hidden md:block" />
    <!-- Mobile header (<md) -->
    <PortalHeaderMobile class="block md:hidden" />

    <main class="flex-1 pt-16 pb-24 md:pb-0">
      <RouterView />
    </main>

    <!-- Mobile bottom tab nav (<md) -->
    <PortalTabNav class="block md:hidden" />
  </div>
</template>

<script setup>
import PortalTopNav from '@/components/portal/PortalTopNav.vue'
import PortalHeaderMobile from '@/components/portal/PortalHeaderMobile.vue'
import PortalTabNav from '@/components/portal/PortalTabNav.vue'
</script>
