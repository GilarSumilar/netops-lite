<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="font-label-md text-label-md text-text-primary">{{ label }}</label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
      class="h-10 px-3.5 rounded-lg border border-border-default bg-surface-base font-body-md text-body-md text-text-primary focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <slot />
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label:       { type: String, default: '' },
  id:          { type: String, default: '' },
  disabled:    { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>
