<script setup lang="ts">
import { cn } from '~/utils'
import { Check, Circle } from 'lucide-vue-next'

interface Step {
  id: string
  title: string
  description?: string
}

interface Props {
  steps: Step[]
  currentStep: string
  class?: string
}

const props = defineProps<Props>()

const currentStepIndex = computed(() => 
  props.steps.findIndex(s => s.id === props.currentStep)
)

function getStepStatus(index: number) {
  if (index < currentStepIndex.value) return 'completed'
  if (index === currentStepIndex.value) return 'current'
  return 'upcoming'
}
</script>

<template>
  <div :class="cn('flex items-center', props.class)">
    <template v-for="(step, index) in steps" :key="step.id">
      <div class="flex items-center">
        <!-- Step indicator -->
        <div class="relative flex items-center justify-center">
          <div
            :class="cn(
              'h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
              getStepStatus(index) === 'completed' && 'bg-primary-500 border-primary-500',
              getStepStatus(index) === 'current' && 'bg-primary-500/20 border-primary-500',
              getStepStatus(index) === 'upcoming' && 'bg-dark-800 border-dark-600'
            )"
          >
            <Check
              v-if="getStepStatus(index) === 'completed'"
              class="h-5 w-5 text-white"
            />
            <Circle
              v-else-if="getStepStatus(index) === 'current'"
              class="h-3 w-3 fill-primary-500 text-primary-500"
            />
            <span
              v-else
              class="text-sm font-medium text-dark-400"
            >
              {{ index + 1 }}
            </span>
          </div>
        </div>

        <!-- Step content -->
        <div class="ml-3 min-w-0">
          <p
            :class="cn(
              'text-sm font-medium',
              getStepStatus(index) === 'upcoming' ? 'text-dark-400' : 'text-white'
            )"
          >
            {{ step.title }}
          </p>
          <p v-if="step.description" class="text-xs text-dark-500">
            {{ step.description }}
          </p>
        </div>
      </div>

      <!-- Connector -->
      <div
        v-if="index < steps.length - 1"
        :class="cn(
          'flex-1 h-0.5 mx-4 min-w-[2rem]',
          index < currentStepIndex ? 'bg-primary-500' : 'bg-dark-700'
        )"
      />
    </template>
  </div>
</template>
