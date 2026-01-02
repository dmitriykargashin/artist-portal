<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  modelValue?: boolean
  label?: string
  description?: string
  disabled?: boolean
  class?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <label
    :class="cn(
      'flex items-center gap-3 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed',
      props.class
    )"
  >
    <div class="relative">
      <input
        :id="id"
        v-model="checked"
        type="checkbox"
        :disabled="disabled"
        class="sr-only peer"
      >
      <div
        :class="cn(
          'h-6 w-11 rounded-full transition-all duration-200',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-dark-900',
          checked ? 'bg-primary-500' : 'bg-dark-700'
        )"
      />
      <div
        :class="cn(
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200',
          checked && 'translate-x-5'
        )"
      />
    </div>
    
    <div v-if="label || description" class="flex-1 min-w-0">
      <p v-if="label" class="text-sm font-medium text-dark-100">
        {{ label }}
      </p>
      <p v-if="description" class="text-xs text-dark-400 mt-0.5">
        {{ description }}
      </p>
    </div>
  </label>
</template>
