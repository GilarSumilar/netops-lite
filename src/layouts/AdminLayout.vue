<template>
  <div class="flex min-h-screen bg-background-canvas">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-50 bg-black/40 md:hidden"
      aria-hidden="true"
      @click="isSidebarOpen = false"
    ></div>
    <AdminSidebar :open="isSidebarOpen" @close="isSidebarOpen = false" />
    <div class="flex min-w-0 flex-1 flex-col md:pl-64">
      <AdminHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      <main class="min-w-0 flex-1 pt-16">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

const isSidebarOpen = ref(false)
</script>
