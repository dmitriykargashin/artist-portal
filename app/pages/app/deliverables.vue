<script setup lang="ts">
import { 
  Clock, 
  Search,
  MoreHorizontal,
  MessageSquare,
  Paperclip
} from 'lucide-vue-next'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const { getDeliverables } = useApi()
const { data: deliverables, pending } = await useAsyncData('deliverables', () => getDeliverables())

const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)

// Status config
const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
  'in-progress': { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
  review: { label: 'In Review', color: 'text-purple-400', bg: 'bg-purple-500/10', dot: 'bg-purple-500' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' }
}

const statuses = ['pending', 'in-progress', 'review', 'completed']

// Filter deliverables
const filteredDeliverables = computed(() => {
  if (!deliverables.value) return []
  
  let result = deliverables.value
  
  if (selectedStatus.value) {
    result = result.filter(d => d.status === selectedStatus.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(d => 
      d.title.toLowerCase().includes(query) ||
      d.description?.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Group by status for kanban view
const columns = computed(() => statuses.map(status => ({
  id: status,
  ...statusConfig[status],
  items: filteredDeliverables.value.filter(d => d.status === status)
})))

function formatDate(date: Date | string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(date: string | Date | null, status: string) {
  if (!date || status === 'approved') return false
  return new Date(date) < new Date()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold mb-1">Deliverables</h1>
      <p class="text-dark-400">Track and manage all your campaign deliverables in one place</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <UiCard
        v-for="column in columns"
        :key="column.id"
        :class="`cursor-pointer transition-all ${selectedStatus === column.id ? 'border-primary-500/50 ring-1 ring-primary-500/20' : 'hover:border-dark-600'}`"
        @click="selectedStatus = selectedStatus === column.id ? null : column.id"
      >
        <UiCardContent class="p-4">
          <div class="flex items-center gap-2 mb-1">
            <div :class="['h-2 w-2 rounded-full', column.dot]" />
            <span class="text-sm text-dark-400">{{ column.label }}</span>
          </div>
          <p class="text-2xl font-bold">{{ column.items.length }}</p>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search deliverables..."
          class="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
        >
      </div>
      
      <UiButton
        v-if="selectedStatus"
        variant="ghost"
        size="sm"
        @click="selectedStatus = null"
      >
        Clear filter
      </UiButton>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="space-y-3">
        <UiSkeleton class="h-10 w-full rounded-xl" />
        <UiSkeleton v-for="j in 3" :key="j" class="h-32 w-full rounded-xl" />
      </div>
    </div>

    <!-- Kanban Board -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="column in columns"
        :key="column.id"
        class="space-y-3"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl sticky top-0 z-10">
          <div class="flex items-center gap-2">
            <div :class="['h-2 w-2 rounded-full', column.dot]" />
            <span class="font-medium">{{ column.label }}</span>
          </div>
          <span class="text-dark-500 text-sm">{{ column.items.length }}</span>
        </div>

        <!-- Cards -->
        <div class="space-y-3 min-h-[300px]">
          <TransitionGroup name="card">
            <UiCard
              v-for="item in column.items"
              :key="item.id"
              class="group hover:border-primary-500/30 transition-all cursor-pointer"
            >
              <UiCardContent class="p-4">
                <!-- Header -->
                <div class="flex items-start justify-between mb-2">
                  <UiBadge :class="`${column.bg} ${column.color}`" class="text-xs">
                    {{ item.priority }}
                  </UiBadge>
                  <button class="p-1 rounded-lg hover:bg-dark-700 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal class="h-4 w-4 text-dark-400" />
                  </button>
                </div>

                <!-- Title -->
                <h4 class="font-medium mb-2 line-clamp-2">{{ item.title }}</h4>
                
                <!-- Description -->
                <p v-if="item.description" class="text-sm text-dark-400 line-clamp-2 mb-3">
                  {{ item.description }}
                </p>

                <!-- Footer -->
                <div class="flex items-center justify-between text-xs text-dark-500">
                  <div
                    v-if="item.dueDate"
                    :class="`flex items-center gap-1 ${isOverdue(item.dueDate, item.status) ? 'text-red-400' : ''}`"
                  >
                    <Clock class="h-3 w-3" />
                    {{ formatDate(item.dueDate) }}
                  </div>
                </div>
              </UiCardContent>
            </UiCard>
          </TransitionGroup>

          <!-- Empty Column -->
          <div
            v-if="column.items.length === 0"
            class="flex items-center justify-center h-32 border-2 border-dashed border-dark-700 rounded-xl text-dark-500 text-sm"
          >
            No items
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.card-move {
  transition: transform 0.3s ease;
}
</style>
