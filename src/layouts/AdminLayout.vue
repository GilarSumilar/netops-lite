<template>
  <div class="flex min-h-screen bg-background-canvas">
    <AdminSidebar />
    <div class="flex flex-col flex-1 pl-64">
      <AdminHeader />
      <main class="flex-1 pt-16">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
</script>
