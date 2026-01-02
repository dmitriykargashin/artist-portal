<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fallback: '?'
})

const sizeClasses = {
  xs: 'h-6 w-6 text-2xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg'
}

const imageError = ref(false)

const showFallback = computed(() => !props.src || imageError.value)

const initials = computed(() => {
  if (props.fallback && props.fallback.length <= 2) return props.fallback
  return props.fallback?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
})
</script>

<template>
  <div
    :class="cn(
      'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white font-medium ring-2 ring-dark-700/50 ring-offset-2 ring-offset-dark-900',
      sizeClasses[size],
      props.class
    )"
  >
    <img
      v-if="!showFallback"
      :src="src!"
      :alt="alt"
      class="h-full w-full rounded-full object-cover"
      @error="imageError = true"
    >
    <span v-else>{{ initials }}</span>
  </div>
</template>
