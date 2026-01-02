<script setup lang="ts">
import { 
  TrendingUp, 
  Music2, 
  Clock, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Eye,
  Heart,
  Users,
  FolderOpen,
  Bell,
  ClipboardList
} from 'lucide-vue-next'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const { user } = useAuth()
const { 
  getMetrics, 
  getProjects, 
  getDeliverables,
  getNotifications 
} = useApi()

// Fetch data
const { data: metrics } = await useAsyncData('dashboard-metrics', () => getMetrics())
const { data: projects } = await useAsyncData('dashboard-projects', () => getProjects())
const { data: deliverables } = await useAsyncData('dashboard-deliverables', () => getDeliverables())
const { data: notifications } = await useAsyncData('dashboard-notifications', () => getNotifications())

// Compute stats from metrics
const statCards = computed(() => {
  const _latestMetrics = metrics.value?.slice(0, 4) || []
  
  return [
    {
      title: 'Monthly Streams',
      value: '2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: Play,
      color: 'primary'
    },
    {
      title: 'Total Followers',
      value: '156K',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'accent'
    },
    {
      title: 'Engagement Rate',
      value: '4.8%',
      change: '+0.5%',
      trend: 'up',
      icon: Heart,
      color: 'emerald'
    },
    {
      title: 'Profile Views',
      value: '89K',
      change: '-2.1%',
      trend: 'down',
      icon: Eye,
      color: 'amber'
    }
  ]
})

// Recent deliverables
const recentDeliverables = computed(() => {
  return (deliverables.value || []).slice(0, 5)
})

// Active projects
const activeProjects = computed(() => {
  return (projects.value || []).filter(p => p.status === 'active').slice(0, 3)
})

// Status colors
const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400',
  'in-progress': 'bg-blue-500/10 text-blue-400',
  review: 'bg-purple-500/10 text-purple-400',
  completed: 'bg-emerald-500/10 text-emerald-400',
  active: 'bg-emerald-500/10 text-emerald-400'
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  review: 'In Review',
  completed: 'Completed',
  active: 'Active'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-1">
          <ClientOnly fallback-tag="span" fallback="Welcome back, Artist 👋">
            Welcome back, {{ user?.name?.split(' ')[0] || 'Artist' }} 👋
          </ClientOnly>
        </h1>
        <p class="text-dark-400">
          Here's what's happening with your music career today.
        </p>
      </div>
      <NuxtLink to="/app/insights">
        <UiButton variant="outline" class="gap-2">
          <TrendingUp class="h-4 w-4" />
          View Full Analytics
        </UiButton>
      </NuxtLink>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UiCard
        v-for="stat in statCards"
        :key="stat.title"
        class="group hover:border-primary-500/30 transition-all"
      >
        <UiCardContent class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-dark-400 text-sm mb-1">{{ stat.title }}</p>
              <p class="text-3xl font-bold">{{ stat.value }}</p>
              <div class="flex items-center gap-1 mt-2">
                <component
                  :is="stat.trend === 'up' ? ArrowUpRight : ArrowDownRight"
                  :class="[
                    'h-4 w-4',
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  ]"
                />
                <span
                  :class="[
                    'text-sm font-medium',
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  ]"
                >
                  {{ stat.change }}
                </span>
                <span class="text-dark-500 text-sm">vs last month</span>
              </div>
            </div>
            <div
              :class="[
                'h-12 w-12 rounded-xl flex items-center justify-center',
                stat.color === 'primary' ? 'bg-primary-500/10 text-primary-400' :
                stat.color === 'accent' ? 'bg-accent-500/10 text-accent-400' :
                stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-amber-500/10 text-amber-400'
              ]"
            >
              <component :is="stat.icon" class="h-6 w-6" />
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Main Content Grid -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Active Projects -->
      <UiCard class="lg:col-span-2">
        <UiCardHeader>
          <div class="flex items-center justify-between">
            <UiCardTitle>Active Projects</UiCardTitle>
            <NuxtLink to="/app/projects">
              <UiButton variant="ghost" size="sm">View All</UiButton>
            </NuxtLink>
          </div>
        </UiCardHeader>
        <UiCardContent class="p-0">
          <div v-if="activeProjects.length === 0" class="p-6">
            <UiEmptyState
              title="No active projects"
              description="Your active projects will appear here"
              :icon="FolderOpen"
            />
          </div>
          <div v-else class="divide-y divide-dark-800">
            <NuxtLink
              v-for="project in activeProjects"
              :key="project.id"
              :to="`/app/projects/${project.id}`"
              class="flex items-center gap-4 p-4 hover:bg-dark-800/50 transition-colors"
            >
              <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <Music2 class="h-6 w-6 text-primary-300" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium truncate">{{ project.title }}</h4>
                <p class="text-sm text-dark-400 truncate">{{ project.description }}</p>
              </div>
              <div class="text-right">
                <UiBadge :class="statusColors[project.status]">
                  {{ statusLabels[project.status] }}
                </UiBadge>
                <p class="text-xs text-dark-500 mt-1">
                  {{ (project as any).totalDeliverables || 0 }} deliverables
                </p>
              </div>
            </NuxtLink>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Recent Activity -->
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Recent Updates</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="p-0">
          <div v-if="!notifications?.length" class="p-6">
            <UiEmptyState
              title="No updates"
              description="Recent notifications will appear here"
              :icon="Bell"
            />
          </div>
          <div v-else class="divide-y divide-dark-800">
            <div
              v-for="notification in (notifications || []).slice(0, 5)"
              :key="notification.id"
              class="flex items-start gap-3 p-4"
            >
              <div
                :class="[
                  'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  notification.type === 'system' ? 'bg-emerald-500/10 text-emerald-400' :
                  notification.type === 'booking' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-primary-500/10 text-primary-400'
                ]"
              >
                <CheckCircle2 class="h-4 w-4" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium">{{ notification.title }}</p>
                <p class="text-xs text-dark-400 line-clamp-2">{{ notification.content }}</p>
              </div>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Recent Deliverables -->
    <UiCard>
      <UiCardHeader>
        <div class="flex items-center justify-between">
          <div>
            <UiCardTitle>Recent Deliverables</UiCardTitle>
            <UiCardDescription>Track the progress of your campaign deliverables</UiCardDescription>
          </div>
          <NuxtLink to="/app/deliverables">
            <UiButton variant="outline" size="sm">View Kanban</UiButton>
          </NuxtLink>
        </div>
      </UiCardHeader>
      <UiCardContent class="p-0">
        <div v-if="!recentDeliverables.length" class="p-6">
          <UiEmptyState
            title="No deliverables yet"
            description="Your deliverables will appear here once projects are started"
            :icon="ClipboardList"
          />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-dark-800">
                <th class="text-left p-4 text-sm font-medium text-dark-400">Deliverable</th>
                <th class="text-left p-4 text-sm font-medium text-dark-400">Project</th>
                <th class="text-left p-4 text-sm font-medium text-dark-400">Status</th>
                <th class="text-left p-4 text-sm font-medium text-dark-400">Due Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-800">
              <tr
                v-for="deliverable in recentDeliverables"
                :key="deliverable.id"
                class="hover:bg-dark-800/50 transition-colors"
              >
                <td class="p-4">
                  <div>
                    <p class="font-medium">{{ deliverable.title }}</p>
                    <p class="text-sm text-dark-400 line-clamp-1">{{ deliverable.description }}</p>
                  </div>
                </td>
                <td class="p-4 text-dark-300">
                  {{ (deliverable as any).projectTitle || 'Unknown' }}
                </td>
                <td class="p-4">
                  <UiBadge :class="statusColors[deliverable.status]">
                    {{ statusLabels[deliverable.status] }}
                  </UiBadge>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2 text-dark-400">
                    <Clock class="h-4 w-4" />
                    <span class="text-sm">
                      {{ deliverable.dueDate ? new Date(deliverable.dueDate).toLocaleDateString() : 'No due date' }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
