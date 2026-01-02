<script setup lang="ts">
import { cn } from '~/utils'

interface Tab {
  id: string
  label: string
  icon?: Component
  badge?: string | number
  disabled?: boolean
}

interface Props {
  tabs: Tab[]
  modelValue?: string
  class?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = computed({
  get: () => props.modelValue ?? props.tabs[0]?.id,
  set: (value) => emit('update:modelValue', value!)
})
</script>

<template>
  <div :class="cn('flex', props.class)">
    <div class="flex gap-1 p-1 bg-dark-800/50 rounded-xl border border-dark-700/50">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :disabled="tab.disabled"
        :class="cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          activeTab === tab.id
            ? 'bg-dark-700 text-white shadow-sm'
            : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700/50',
          tab.disabled && 'opacity-50 cursor-not-allowed'
        )"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" v-if="tab.icon" class="h-4 w-4" />
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.badge"
          class="px-1.5 py-0.5 text-2xs rounded-full bg-primary-500/20 text-primary-300"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>
  </div>
</template>
