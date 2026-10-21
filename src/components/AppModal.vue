<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      @click.self="$emit('update:modelValue', false)"
    >
      <div
        :class="['bg-surface-base rounded-2xl shadow-2xl w-full flex flex-col gap-5 p-4 sm:p-6 max-h-[calc(100dvh-2rem)] overflow-y-auto', maxWidthClass]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h3 class="font-headline-sm text-headline-sm text-text-primary font-bold">{{ title }}</h3>
          <button
            @click="$emit('update:modelValue', false)"
            class="p-1.5 rounded-lg hover:bg-surface-container-low text-text-muted transition-colors"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <!-- Body -->
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title:      { type: String,  default: '' },
  maxWidth:   { type: String,  default: 'md' }, // sm | md | lg
})
defineEmits(['update:modelValue'])

const maxWidthClass = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}[props.maxWidth]))
</script>
