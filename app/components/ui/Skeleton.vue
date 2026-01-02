<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  class?: string
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  rounded: 'lg'
})

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
}
</script>

<template>
  <div
    :class="cn(
      'animate-pulse bg-dark-700',
      roundedClasses[rounded],
      props.class
    )"
    :style="{
      width: width,
      height: height
    }"
  />
</template>
