<script setup lang="ts">
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Plus,
  MoreHorizontal,
  MessageSquare,
  FolderKanban,
  ClipboardList
} from 'lucide-vue-next'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const route = useRoute()
const projectId = route.params.id as string

const { getProjects, getDeliverables } = useApi()

// Fetch project and deliverables
const { data: projects } = await useAsyncData('projects', () => getProjects())
const { data: allDeliverables } = await useAsyncData('deliverables', () => getDeliverables())

const project = computed(() => projects.value?.find(p => p.id === projectId))
const deliverables = computed(() => 
  allDeliverables.value?.filter(d => d.projectId === projectId) || []
)

// Status config
const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  not_started: { label: 'Not Started', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  review: { label: 'In Review', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  revision: { label: 'Revision', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  cancelled: { label: 'Cancelled', color: 'text-dark-400', bg: 'bg-dark-500/10' }
}

// Group deliverables by status for kanban
const columns = computed(() => [
  { id: 'not_started', title: 'Not Started', items: deliverables.value.filter(d => d.status === 'not_started') },
  { id: 'in_progress', title: 'In Progress', items: deliverables.value.filter(d => d.status === 'in_progress') },
  { id: 'review', title: 'In Review', items: deliverables.value.filter(d => d.status === 'review') },
  { id: 'approved', title: 'Approved', items: deliverables.value.filter(d => d.status === 'approved') }
])

// Progress percentage
const progress = computed(() => {
  if (!deliverables.value.length) return 0
  const completed = deliverables.value.filter(d => d.status === 'approved').length
  return Math.round((completed / deliverables.value.length) * 100)
})

function formatDate(date: Date | string | null) {
  if (!date) return 'No date'
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  })
}

function isOverdue(date: Date | string | null) {
  if (!date) return false
  return new Date(date) < new Date()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Back Link -->
    <NuxtLink to="/app/projects" class="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors">
      <ArrowLeft class="h-4 w-4" />
      Back to Projects
    </NuxtLink>

    <!-- Not Found -->
    <UiEmptyState
      v-if="!project"
      title="Project not found"
      description="This project doesn't exist or you don't have access to it"
      :icon="FolderKanban"
    >
      <template #action>
        <NuxtLink to="/app/projects">
          <UiButton>View All Projects</UiButton>
        </NuxtLink>
      </template>
    </UiEmptyState>

    <template v-else>
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-bold">{{ project.title }}</h1>
            <UiBadge
              :class="`${project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : project.status === 'completed' ? 'bg-blue-500/10 text-blue-400' : 'bg-dark-600 text-dark-300'}`"
            >
              {{ project.status }}
            </UiBadge>
          </div>
          <p class="text-dark-400 text-lg">{{ project.description }}</p>
        </div>

        <UiButton class="gap-2">
          <Plus class="h-4 w-4" />
          Add Deliverable
        </UiButton>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UiCard>
          <UiCardContent class="p-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <Calendar class="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p class="text-sm text-dark-400">Start Date</p>
                <p class="font-semibold">{{ formatDate(project.startDate) }}</p>
              </div>
            </div>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="p-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                <Clock class="h-5 w-5 text-accent-400" />
              </div>
              <div>
                <p class="text-sm text-dark-400">Due Date</p>
                <p class="font-semibold">{{ formatDate(project.dueDate) }}</p>
              </div>
            </div>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="p-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 class="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p class="text-sm text-dark-400">Progress</p>
                <p class="font-semibold">{{ progress }}%</p>
              </div>
            </div>
          </UiCardContent>
        </UiCard>

        <UiCard>
          <UiCardContent class="p-4">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <AlertCircle class="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p class="text-sm text-dark-400">Deliverables</p>
                <p class="font-semibold">{{ deliverables.length }} total</p>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>

      <!-- Progress Bar -->
      <UiCard>
        <UiCardContent class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-dark-400">Overall Progress</span>
            <span class="text-sm font-medium">{{ progress }}%</span>
          </div>
          <UiProgress :value="progress" />
        </UiCardContent>
      </UiCard>

      <!-- Kanban Board -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Deliverables</h2>
        
        <div v-if="!deliverables.length" class="py-12">
          <UiEmptyState
            title="No deliverables yet"
            description="Add deliverables to track tasks for this project"
            :icon="ClipboardList"
          >
            <template #action>
              <UiButton class="gap-2">
                <Plus class="h-4 w-4" />
                Add First Deliverable
              </UiButton>
            </template>
          </UiEmptyState>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="column in columns"
            :key="column.id"
            class="space-y-3"
          >
            <!-- Column Header -->
            <div class="flex items-center justify-between p-3 bg-dark-800/50 rounded-xl">
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'h-2 w-2 rounded-full',
                    column.id === 'not_started' ? 'bg-amber-500' :
                    column.id === 'in_progress' ? 'bg-blue-500' :
                    column.id === 'review' ? 'bg-purple-500' :
                    'bg-emerald-500'
                  ]"
                />
                <span class="font-medium">{{ column.title }}</span>
              </div>
              <span class="text-dark-500 text-sm">{{ column.items.length }}</span>
            </div>

            <!-- Cards -->
            <div class="space-y-3 min-h-[200px]">
              <UiCard
                v-for="item in column.items"
                :key="item.id"
                class="group hover:border-primary-500/30 transition-all cursor-pointer"
              >
                <UiCardContent class="p-4">
                  <div class="flex items-start justify-between mb-2">
                    <UiBadge :class="`${statusConfig[item.status]?.bg} ${statusConfig[item.status]?.color}`" class="text-xs">
                      {{ item.priority }}
                    </UiBadge>
                    <button class="p-1 rounded-lg hover:bg-dark-700 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal class="h-4 w-4 text-dark-400" />
                    </button>
                  </div>

                  <h4 class="font-medium mb-2 line-clamp-2">{{ item.title }}</h4>
                  
                  <p v-if="item.description" class="text-sm text-dark-400 line-clamp-2 mb-3">
                    {{ item.description }}
                  </p>

                  <div class="flex items-center justify-between text-xs text-dark-500">
                    <div
                      v-if="item.dueDate"
                      :class="`flex items-center gap-1 ${isOverdue(item.dueDate) && item.status !== 'approved' ? 'text-red-400' : ''}`"
                    >
                      <Clock class="h-3 w-3" />
                      {{ formatDate(item.dueDate) }}
                    </div>
                  </div>
                </UiCardContent>
              </UiCard>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
