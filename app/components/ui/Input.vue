<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  modelValue?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  class?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value ?? '')
})
</script>

<template>
  <input
    :id="id"
    v-model="inputValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="cn(
      'flex h-10 w-full rounded-xl bg-dark-800 border border-dark-600 px-4 py-2 text-sm text-white placeholder:text-dark-400',
      'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-200',
      props.class
    )"
  >
</template>
