<script setup lang="ts">
import { cn } from '~/utils'
import { ChevronDown } from 'lucide-vue-next'

interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  options: Option[]
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  class?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select option',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()

const selectedOption = computed(() =>
  props.options.find(o => o.value === props.modelValue)
)

function toggle() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function selectOption(option: Option) {
  if (option.disabled) return
  emit('update:modelValue', option.value)
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
  <div :class="cn('relative', props.class)">
    <button
      :id="id"
      ref="triggerRef"
      type="button"
      :disabled="disabled"
      :class="cn(
        'flex h-10 w-full items-center justify-between rounded-xl bg-dark-800 border border-dark-600 px-4 py-2 text-sm',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-200',
        isOpen && 'border-primary-500 ring-2 ring-primary-500/20'
      )"
      @click="toggle"
    >
      <span :class="selectedOption ? 'text-white' : 'text-dark-400'">
        {{ selectedOption?.label || placeholder }}
      </span>
      <ChevronDown
        :class="cn(
          'h-4 w-4 text-dark-400 transition-transform duration-200',
          isOpen && 'rotate-180'
        )"
      />
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute z-50 mt-2 w-full py-1 bg-dark-800 border border-dark-700 rounded-xl shadow-xl max-h-60 overflow-auto"
      >
        <button
          v-for="option in options"
          :key="option.value"
          :disabled="option.disabled"
          :class="cn(
            'flex w-full items-center px-4 py-2 text-sm transition-colors',
            option.value === modelValue
              ? 'bg-primary-500/20 text-primary-300'
              : 'text-dark-200 hover:bg-dark-700 hover:text-white',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </button>
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
