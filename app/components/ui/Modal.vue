<script setup lang="ts">
import { cn } from '~/utils'
import { X } from 'lucide-vue-next'

interface Props {
  open?: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]'
}

function handleClose() {
  isOpen.value = false
  emit('close')
}

// Close on escape key
onKeyStroke('Escape', handleClose)

// Lock body scroll when open
watch(isOpen, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
          @click="handleClose"
        />

        <!-- Modal content -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: 10 }"
          :enter="{ opacity: 1, scale: 1, y: 0 }"
          :leave="{ opacity: 0, scale: 0.95, y: 10 }"
          :class="cn(
            'relative w-full bg-dark-900 border border-dark-700/50 rounded-2xl shadow-2xl',
            sizeClasses[size],
            props.class
          )"
        >
          <!-- Header -->
          <div
            v-if="title || $slots.header"
            class="flex items-start justify-between p-6 border-b border-dark-700/50"
          >
            <div>
              <slot name="header">
                <h2 class="text-xl font-semibold text-white">{{ title }}</h2>
                <p v-if="description" class="mt-1 text-sm text-dark-400">{{ description }}</p>
              </slot>
            </div>
            <button
              class="p-1 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
              @click="handleClose"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="flex items-center justify-end gap-3 p-6 border-t border-dark-700/50"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
