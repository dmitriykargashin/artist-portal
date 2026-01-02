<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  rows?: number
  class?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  rows: 3
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
  <textarea
    :id="id"
    v-model="inputValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="cn(
      'flex w-full rounded-xl bg-dark-800 border border-dark-600 px-4 py-3 text-sm text-white placeholder:text-dark-400',
      'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-200 resize-none',
      props.class
    )"
  />
</template>
