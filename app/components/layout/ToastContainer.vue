<script setup lang="ts">
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-vue-next'

const { toasts, removeToast } = useToast()

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
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-lg',
            styles[toast.type]
          ]"
        >
          <component
            :is="icons[toast.type]"
            :class="['h-5 w-5 flex-shrink-0', iconStyles[toast.type]]"
          />
          <div class="flex-1 min-w-0">
            <p v-if="toast.title" class="font-medium">{{ toast.title }}</p>
            <p :class="['text-sm', toast.title ? 'opacity-90' : 'font-medium']">
              {{ toast.message }}
            </p>
          </div>
          <button
            class="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
            @click="removeToast(toast.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
