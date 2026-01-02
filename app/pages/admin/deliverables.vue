<script setup lang="ts">
import { 
  Search, 
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  ClipboardList
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { getDeliverables } = useApi()
const { addToast } = useToast()

const { data: deliverables, pending, refresh: _refresh } = await useAsyncData('admin-deliverables', () => getDeliverables())

const searchQuery = ref('')
const selectedStatus = ref<string | null>(null)

// Status config
const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  not_started: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-500' },
  in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
  review: { label: 'In Review', color: 'text-purple-400', bg: 'bg-purple-500/10', dot: 'bg-purple-500' },
  revision: { label: 'Revision', color: 'text-orange-400', bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
  approved: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', color: 'text-dark-400', bg: 'bg-dark-500/10', dot: 'bg-dark-500' }
}

// Filter
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

// Stats
const stats = computed(() => {
  if (!deliverables.value) return { notStarted: 0, inProgress: 0, review: 0, approved: 0 }
  return {
    notStarted: deliverables.value.filter(d => d.status === 'not_started').length,
    inProgress: deliverables.value.filter(d => d.status === 'in_progress').length,
    review: deliverables.value.filter(d => d.status === 'review').length,
    approved: deliverables.value.filter(d => d.status === 'approved').length
  }
})

function formatDate(date: Date | string | null) {
  if (!date) return 'No due date'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(date: Date | string | null, status: string) {
  if (!date || status === 'approved') return false
  return new Date(date) < new Date()
}

// Mock status update
async function updateStatus(id: string, newStatus: string) {
  // In real app, this would call API
  addToast({
    type: 'success',
    title: 'Status Updated',
    message: `Deliverable moved to ${statusConfig[newStatus]?.label}`
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold mb-1">Deliverables Queue</h1>
      <p class="text-dark-400">Review and process artist deliverables</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <UiCard
        :class="`cursor-pointer transition-all ${selectedStatus === 'not_started' ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'hover:border-dark-600'}`"
        @click="selectedStatus = selectedStatus === 'not_started' ? null : 'not_started'"
      >
        <UiCardContent class="p-4">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-2 w-2 rounded-full bg-amber-500" />
            <span class="text-sm text-dark-400">Pending</span>
          </div>
          <p class="text-2xl font-bold">{{ stats.notStarted }}</p>
        </UiCardContent>
      </UiCard>

      <UiCard
        :class="`cursor-pointer transition-all ${selectedStatus === 'in_progress' ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'hover:border-dark-600'}`"
        @click="selectedStatus = selectedStatus === 'in_progress' ? null : 'in_progress'"
      >
        <UiCardContent class="p-4">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-2 w-2 rounded-full bg-blue-500" />
            <span class="text-sm text-dark-400">In Progress</span>
          </div>
          <p class="text-2xl font-bold">{{ stats.inProgress }}</p>
        </UiCardContent>
      </UiCard>

      <UiCard
        :class="`cursor-pointer transition-all ${selectedStatus === 'review' ? 'border-purple-500/50 ring-1 ring-purple-500/20' : 'hover:border-dark-600'}`"
        @click="selectedStatus = selectedStatus === 'review' ? null : 'review'"
      >
        <UiCardContent class="p-4">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-2 w-2 rounded-full bg-purple-500" />
            <span class="text-sm text-dark-400">In Review</span>
          </div>
          <p class="text-2xl font-bold">{{ stats.review }}</p>
        </UiCardContent>
      </UiCard>

      <UiCard
        :class="`cursor-pointer transition-all ${selectedStatus === 'approved' ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'hover:border-dark-600'}`"
        @click="selectedStatus = selectedStatus === 'approved' ? null : 'approved'"
      >
        <UiCardContent class="p-4">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-2 w-2 rounded-full bg-emerald-500" />
            <span class="text-sm text-dark-400">Completed</span>
          </div>
          <p class="text-2xl font-bold">{{ stats.approved }}</p>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search deliverables..."
          class="w-full pl-12 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-all"
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

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <UiSkeleton v-for="i in 5" :key="i" class="h-24 w-full" />
    </div>

    <!-- Empty -->
    <UiEmptyState
      v-else-if="!filteredDeliverables.length"
      :title="selectedStatus ? `No ${statusConfig[selectedStatus]?.label.toLowerCase()} deliverables` : 'No deliverables found'"
      description="Adjust your filters or check back later"
      :icon="ClipboardList"
    />

    <!-- Deliverables List -->
    <div v-else class="space-y-4">
      <UiCard
        v-for="item in filteredDeliverables"
        :key="item.id"
        class="group hover:border-accent-500/30 transition-all"
      >
        <UiCardContent class="p-4">
          <div class="flex items-start gap-4">
            <!-- Status Indicator -->
            <div
              :class="[
                'h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0',
                statusConfig[item.status]?.bg
              ]"
            >
              <component
                :is="item.status === 'approved' ? CheckCircle2 : 
                     item.status === 'review' ? AlertCircle : Clock"
                :class="['h-6 w-6', statusConfig[item.status]?.color]"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h4 class="font-semibold mb-1">{{ item.title }}</h4>
                  <p class="text-sm text-dark-400 line-clamp-1">{{ item.description }}</p>
                </div>
                <UiBadge :class="`${statusConfig[item.status]?.bg} ${statusConfig[item.status]?.color}`">
                  {{ statusConfig[item.status]?.label }}
                </UiBadge>
              </div>

              <!-- Meta -->
              <div class="flex items-center gap-4 mt-3 text-sm">
                <div class="flex items-center gap-2 text-dark-400">
                  <User class="h-4 w-4" />
                  <span>Demo Artist</span>
                </div>
                <div
                  :class="[
                    'flex items-center gap-1',
                    isOverdue(item.dueDate, item.status) ? 'text-red-400' : 'text-dark-500'
                  ]"
                >
                  <Clock class="h-4 w-4" />
                  {{ formatDate(item.dueDate) }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <UiButton
                v-if="item.status === 'not_started'"
                size="sm"
                @click="updateStatus(item.id, 'in_progress')"
              >
                Start
                <ArrowRight class="h-4 w-4 ml-1" />
              </UiButton>
              <UiButton
                v-else-if="item.status === 'in_progress'"
                size="sm"
                @click="updateStatus(item.id, 'review')"
              >
                Submit for Review
              </UiButton>
              <UiButton
                v-else-if="item.status === 'review'"
                size="sm"
                variant="default"
                class="bg-emerald-600 hover:bg-emerald-700"
                @click="updateStatus(item.id, 'approved')"
              >
                <CheckCircle2 class="h-4 w-4 mr-1" />
                Complete
              </UiButton>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
