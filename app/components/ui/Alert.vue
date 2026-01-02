<script setup lang="ts">
import { cn } from '~/utils'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-vue-next'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  description?: string
  dismissible?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false
})

const emit = defineEmits<{
  dismiss: []
}>()

const visible = ref(true)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const styles = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  error: 'bg-red-500/10 border-red-500/30 text-red-300',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-300'
}

const iconStyles = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400'
}

function handleDismiss() {
  visible.value = false
  emit('dismiss')
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible"
      :class="cn(
        'flex items-start gap-3 p-4 rounded-xl border',
        styles[type],
        props.class
      )"
    >
      <component
        :is="icons[type]"
        :class="cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[type])"
      />
      
      <div class="flex-1 min-w-0">
        <p v-if="title" class="font-medium">{{ title }}</p>
        <p
          v-if="description"
          :class="cn('text-sm opacity-90', !title && 'font-medium')"
        >
          {{ description }}
        </p>
        <slot />
      </div>

      <button
        v-if="dismissible"
        class="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
        @click="handleDismiss"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
