<script setup lang="ts">
import { cn } from '~/utils'
import { X } from 'lucide-vue-next'

interface Props {
  open?: boolean
  title?: string
  description?: string
  side?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  side: 'right',
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
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
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
    <Transition name="slideover">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50"
      >
        <!-- Backdrop -->
        <Transition name="fade">
          <div
            v-if="isOpen"
            class="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            @click="handleClose"
          />
        </Transition>

        <!-- Panel -->
        <div
          :class="cn(
            'absolute inset-y-0 flex',
            side === 'right' ? 'right-0' : 'left-0'
          )"
        >
          <Transition
            :name="side === 'right' ? 'slide-right' : 'slide-left'"
          >
            <div
              v-if="isOpen"
              :class="cn(
                'w-screen bg-dark-900 border-dark-700/50 shadow-2xl flex flex-col',
                side === 'right' ? 'border-l' : 'border-r',
                sizeClasses[size],
                props.class
              )"
            >
              <!-- Header -->
              <div class="flex items-start justify-between p-6 border-b border-dark-700/50">
                <div>
                  <slot name="header">
                    <h2 v-if="title" class="text-lg font-semibold text-white">{{ title }}</h2>
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
              <div class="flex-1 overflow-y-auto p-6">
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
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slideover-enter-active,
.slideover-leave-active {
  transition: opacity 0.3s ease;
}

.slideover-enter-from,
.slideover-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
