<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="to ? undefined : disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-label-lg transition-all',
      sizeClass,
      variantClass,
      disabled && !to ? 'opacity-40 cursor-not-allowed' : '',
    ]"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    // primary | secondary | ghost | danger | outline
  },
  size: {
    type: String,
    default: 'md',
    // sm (h-8) | md (h-10) | lg (h-11)
  },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  to: { type: [String, Object], default: null },
  full: { type: Boolean, default: false },
})

const sizeClass = computed(() => ({
  sm: 'h-8 px-3 rounded-lg text-label-md',
  md: 'h-10 px-4 rounded-lg text-label-lg',
  lg: 'h-11 px-4 rounded-lg text-label-lg',
}[props.size] + (props.full ? ' w-full' : '')))

const variantClass = computed(() => ({
  primary:   'bg-primary-container text-on-primary shadow-sm hover:bg-primary',
  secondary: 'bg-surface-base border border-border-default text-text-primary shadow-sm hover:bg-surface-container-low',
  ghost:     'bg-primary-container/10 text-primary-container hover:bg-primary-container hover:text-on-primary',
  danger:    'bg-status-danger-text text-on-error shadow-sm hover:opacity-90',
  outline:   'border border-border-default text-text-body hover:bg-surface-container-low',
  'outline-primary': 'border border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary',
}[props.variant]))
</script>
