<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning'
  showLabel?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  size: 'md',
  variant: 'primary',
  showLabel: false
})

const percentage = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
}

const variantClasses = {
  default: 'bg-dark-500',
  primary: 'bg-gradient-to-r from-primary-600 to-primary-400',
  accent: 'bg-gradient-to-r from-accent-600 to-accent-400',
  success: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
  warning: 'bg-gradient-to-r from-amber-600 to-amber-400'
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div v-if="showLabel" class="flex justify-between mb-1.5 text-xs">
      <span class="text-dark-400">Progress</span>
      <span class="text-dark-200 font-medium">{{ Math.round(percentage) }}%</span>
    </div>
    <div :class="cn('w-full rounded-full bg-dark-700 overflow-hidden', sizeClasses[size])">
      <div
        :class="cn('h-full rounded-full transition-all duration-500 ease-out', variantClasses[variant])"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
