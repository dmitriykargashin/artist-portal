<script setup lang="ts">
import { cn } from '~/utils'
import { Check } from 'lucide-vue-next'

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
      'flex items-start gap-3 cursor-pointer',
      disabled && 'opacity-50 cursor-not-allowed',
      props.class
    )"
  >
    <div class="relative flex-shrink-0 mt-0.5">
      <input
        :id="id"
        v-model="checked"
        type="checkbox"
        :disabled="disabled"
        class="sr-only peer"
      >
      <div
        :class="cn(
          'h-5 w-5 rounded-md border-2 transition-all duration-200',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/50',
          checked
            ? 'bg-primary-500 border-primary-500'
            : 'bg-dark-800 border-dark-600 peer-hover:border-dark-500'
        )"
      >
        <Check
          v-if="checked"
          class="h-full w-full p-0.5 text-white"
        />
      </div>
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
