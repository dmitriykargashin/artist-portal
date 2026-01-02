<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  icon?: Component
  title: string
  description?: string
  action?: string
  class?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div
    :class="cn(
      'flex flex-col items-center justify-center py-12 px-6 text-center',
      props.class
    )"
  >
    <div
      v-if="icon"
      class="mb-4 p-4 rounded-2xl bg-dark-800/50 border border-dark-700/50"
    >
      <component :is="icon" class="h-10 w-10 text-dark-500" />
    </div>
    
    <h3 class="text-lg font-medium text-dark-200 mb-1">
      {{ title }}
    </h3>
    
    <p v-if="description" class="text-sm text-dark-500 max-w-sm">
      {{ description }}
    </p>
    
    <UiButton
      v-if="action"
      class="mt-4"
      variant="secondary"
      size="sm"
      @click="emit('action')"
    >
      {{ action }}
    </UiButton>
  </div>
</template>
