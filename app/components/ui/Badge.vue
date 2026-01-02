<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-dark-700 text-dark-200',
        primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
        accent: 'bg-accent-500/20 text-accent-300 border border-accent-500/30',
        success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        error: 'bg-red-500/20 text-red-300 border border-red-500/30',
        info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        outline: 'border border-dark-600 text-dark-300'
      },
      size: {
        sm: 'text-2xs px-2 py-0',
        default: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

type BadgeVariants = VariantProps<typeof badgeVariants>

interface Props {
  variant?: BadgeVariants['variant']
  size?: BadgeVariants['size']
  dot?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  dot: false
})

const dotColorClass = computed(() => {
  const colors: Record<string, string> = {
    default: 'bg-dark-400',
    primary: 'bg-primary-400',
    accent: 'bg-accent-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
    outline: 'bg-dark-400'
  }
  return colors[props.variant ?? 'default']
})
</script>

<template>
  <span :class="cn(badgeVariants({ variant, size }), props.class)">
    <span v-if="dot" :class="cn('h-1.5 w-1.5 rounded-full', dotColorClass)" />
    <slot />
  </span>
</template>
