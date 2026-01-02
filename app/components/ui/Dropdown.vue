<script setup lang="ts">
import { cn } from '~/utils'

interface Props {
  items: DropdownItem[]
  align?: 'left' | 'right'
  class?: string
}

interface DropdownItem {
  id: string
  label: string
  icon?: Component
  variant?: 'default' | 'danger'
  disabled?: boolean
  separator?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right'
})

const emit = defineEmits<{
  select: [item: DropdownItem]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()

function toggle() {
  isOpen.value = !isOpen.value
}

function handleSelect(item: DropdownItem) {
  if (item.disabled) return
  emit('select', item)
  isOpen.value = false
}

// Close on click outside
onClickOutside(dropdownRef, () => {
  isOpen.value = false
}, { ignore: [triggerRef] })

// Close on escape
onKeyStroke('Escape', () => {
  isOpen.value = false
})
</script>

<template>
  <div class="relative inline-block">
    <div ref="triggerRef" @click="toggle">
      <slot name="trigger" />
    </div>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        :class="cn(
          'absolute z-50 mt-2 min-w-[180px] py-1 bg-dark-800 border border-dark-700 rounded-xl shadow-xl',
          align === 'right' ? 'right-0' : 'left-0',
          props.class
        )"
      >
        <template v-for="item in items" :key="item.id">
          <div v-if="item.separator" class="my-1 h-px bg-dark-700" />
          <button
            v-else
            :disabled="item.disabled"
            :class="cn(
              'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
              item.variant === 'danger'
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-dark-200 hover:bg-dark-700 hover:text-white',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )"
            @click="handleSelect(item)"
          >
            <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
