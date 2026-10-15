<template>
  <div class="flex min-h-screen bg-background-canvas">
    <AdminSidebar />
    <!-- overlay backdrop mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    />
    <div class="flex flex-col flex-1 min-w-0 lg:pl-64">
      <AdminHeader />
      <main class="flex-1 pt-16">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

const sidebarOpen = ref(false)
provide('sidebar', sidebarOpen)
</script>

