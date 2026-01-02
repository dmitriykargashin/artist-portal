<script setup lang="ts">
import { 
  Plus, 
  FolderKanban, 
  Clock, 
  CheckCircle2,
  Calendar,
  Users
} from 'lucide-vue-next'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const { getProjects } = useApi()
const { data: projects, pending, refresh: _refresh } = await useAsyncData('projects', () => getProjects())

// Status config
const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: 'Active', color: 'bg-emerald-500/10 text-emerald-400', icon: CheckCircle2 },
  on_hold: { label: 'On Hold', color: 'bg-amber-500/10 text-amber-400', icon: Clock },
  completed: { label: 'Completed', color: 'bg-blue-500/10 text-blue-400', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-dark-600 text-dark-300', icon: Clock }
}

// Group projects by status
const projectsByStatus = computed(() => {
  if (!projects.value) return {}
  
  return {
    active: projects.value.filter(p => p.status === 'active'),
    on_hold: projects.value.filter(p => p.status === 'on_hold'),
    completed: projects.value.filter(p => p.status === 'completed'),
    cancelled: projects.value.filter(p => p.status === 'cancelled')
  }
})

// Stats
const stats = computed(() => ({
  total: projects.value?.length || 0,
  active: projectsByStatus.value.active?.length || 0,
  completed: projectsByStatus.value.completed?.length || 0
}))

function formatDate(date: Date | string | null) {
  if (!date) return 'No date'
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-1">Projects</h1>
        <p class="text-dark-400">Manage your active campaigns and track progress</p>
      </div>
      <UiButton class="gap-2">
        <Plus class="h-4 w-4" />
        New Project
      </UiButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-3 gap-4">
      <UiCard>
        <UiCardContent class="p-4 text-center">
          <p class="text-3xl font-bold text-primary-400">{{ stats.total }}</p>
          <p class="text-dark-400 text-sm">Total Projects</p>
        </UiCardContent>
      </UiCard>
      <UiCard>
        <UiCardContent class="p-4 text-center">
          <p class="text-3xl font-bold text-emerald-400">{{ stats.active }}</p>
          <p class="text-dark-400 text-sm">Active</p>
        </UiCardContent>
      </UiCard>
      <UiCard>
        <UiCardContent class="p-4 text-center">
          <p class="text-3xl font-bold text-blue-400">{{ stats.completed }}</p>
          <p class="text-dark-400 text-sm">Completed</p>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UiCard v-for="i in 6" :key="i" class="p-6">
        <UiSkeleton class="h-6 w-3/4 mb-2" />
        <UiSkeleton class="h-4 w-full mb-4" />
        <UiSkeleton class="h-4 w-1/2" />
      </UiCard>
    </div>

    <!-- Empty State -->
    <UiEmptyState
      v-else-if="!projects?.length"
      title="No projects yet"
      description="Create your first project to start tracking your campaigns"
      :icon="FolderKanban"
    >
      <template #action>
        <UiButton class="gap-2">
          <Plus class="h-4 w-4" />
          Create Project
        </UiButton>
      </template>
    </UiEmptyState>

    <!-- Projects Grid -->
    <div v-else class="space-y-8">
      <!-- Active Projects -->
      <div v-if="projectsByStatus.active?.length">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-emerald-500" />
          Active Projects
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="project in projectsByStatus.active"
            :key="project.id"
            :to="`/app/projects/${project.id}`"
          >
            <UiCard class="h-full group hover:border-primary-500/30 transition-all">
              <UiCardContent class="p-6">
                <!-- Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                    <FolderKanban class="h-5 w-5 text-primary-300" />
                  </div>
                  <UiBadge :class="statusConfig[project.status]?.color">
                    {{ statusConfig[project.status]?.label }}
                  </UiBadge>
                </div>

                <!-- Content -->
                <h3 class="text-lg font-semibold mb-2 group-hover:text-primary-300 transition-colors">
                  {{ project.title }}
                </h3>
                <p class="text-dark-400 text-sm line-clamp-2 mb-4">
                  {{ project.description }}
                </p>

                <!-- Meta -->
                <div class="flex items-center gap-4 text-sm text-dark-500">
                  <div class="flex items-center gap-1">
                    <Calendar class="h-4 w-4" />
                    <span>{{ formatDate(project.startDate) }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Users class="h-4 w-4" />
                    <span>{{ project.progress }}% complete</span>
                  </div>
                </div>
              </UiCardContent>
            </UiCard>
          </NuxtLink>
        </div>
      </div>

      <!-- On Hold Projects -->
      <div v-if="projectsByStatus.on_hold?.length">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-amber-500" />
          On Hold Projects
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="project in projectsByStatus.on_hold"
            :key="project.id"
            :to="`/app/projects/${project.id}`"
          >
            <UiCard class="h-full group hover:border-dark-600 transition-all opacity-75 hover:opacity-100">
              <UiCardContent class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="h-10 w-10 rounded-xl bg-dark-700 flex items-center justify-center">
                    <FolderKanban class="h-5 w-5 text-dark-400" />
                  </div>
                  <UiBadge :class="statusConfig[project.status]?.color">
                    {{ statusConfig[project.status]?.label }}
                  </UiBadge>
                </div>

                <h3 class="text-lg font-semibold mb-2">{{ project.title }}</h3>
                <p class="text-dark-400 text-sm line-clamp-2 mb-4">
                  {{ project.description }}
                </p>

                <div class="flex items-center gap-4 text-sm text-dark-500">
                  <div class="flex items-center gap-1">
                    <Calendar class="h-4 w-4" />
                    <span>{{ formatDate(project.startDate) }}</span>
                  </div>
                </div>
              </UiCardContent>
            </UiCard>
          </NuxtLink>
        </div>
      </div>

      <!-- Completed Projects -->
      <div v-if="projectsByStatus.completed?.length">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-blue-500" />
          Completed Projects
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="project in projectsByStatus.completed"
            :key="project.id"
            :to="`/app/projects/${project.id}`"
          >
            <UiCard class="h-full group hover:border-blue-500/30 transition-all opacity-75 hover:opacity-100">
              <UiCardContent class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <CheckCircle2 class="h-5 w-5 text-blue-400" />
                  </div>
                  <UiBadge :class="statusConfig[project.status]?.color">
                    {{ statusConfig[project.status]?.label }}
                  </UiBadge>
                </div>

                <h3 class="text-lg font-semibold mb-2">{{ project.title }}</h3>
                <p class="text-dark-400 text-sm line-clamp-2 mb-4">
                  {{ project.description }}
                </p>

                <div class="flex items-center gap-4 text-sm text-dark-500">
                  <div class="flex items-center gap-1">
                    <Calendar class="h-4 w-4" />
                    <span>{{ formatDate(project.completedAt) }}</span>
                  </div>
                </div>
              </UiCardContent>
            </UiCard>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
