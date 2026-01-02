<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  class?: string
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: false,
  padding: 'md'
})

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}
</script>

<template>
  <div
    :class="cn(
      'rounded-2xl bg-dark-900/80 backdrop-blur-xl border border-dark-700/50 shadow-glass',
      paddingClasses[padding],
      hoverable && 'card-hover cursor-pointer',
      props.class
    )"
  >
    <slot />
  </div>
</template>
