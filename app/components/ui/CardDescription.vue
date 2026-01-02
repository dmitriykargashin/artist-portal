<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <p :class="cn('text-sm text-dark-400', props.class)">
    <slot />
  </p>
</template>
