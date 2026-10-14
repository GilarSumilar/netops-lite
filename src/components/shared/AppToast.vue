<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl min-w-[280px] max-w-sm pointer-events-auto',
            typeClass[t.type] ?? typeClass.success
          ]"
        >
          <span class="material-symbols-outlined text-[20px]">{{ typeIcon[t.type] ?? typeIcon.success }}</span>
          <span class="font-body-sm text-body-sm flex-1">{{ t.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast.js'

const { toasts } = useToast()

const typeClass = {
  success: 'bg-status-success-bg text-status-success-text border border-status-success-text/20',
  error:   'bg-status-danger-bg text-status-danger-text border border-status-danger-text/20',
  warning: 'bg-status-warning-bg text-status-warning-text border border-status-warning-text/20',
  info:    'bg-surface-container text-text-primary border border-border-subtle',
}
const typeIcon = {
  success: 'check_circle',
  error:   'error',
  warning: 'warning',
  info:    'info',
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to   { opacity: 0; transform: translateX(40px); }
</style>
