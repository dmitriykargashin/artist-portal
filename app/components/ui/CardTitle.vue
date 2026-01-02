<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <h3 :class="cn('text-lg font-semibold text-white', props.class)">
    <slot />
  </h3>
</template>
