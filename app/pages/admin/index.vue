<script setup lang="ts">
import { 
  Users, 
  FolderKanban, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { getDeliverables, getProjects } = useApi()
const { data: deliverables } = await useAsyncData('admin-deliverables', () => getDeliverables())
const { data: projects } = await useAsyncData('admin-projects', () => getProjects())

// Stats
const stats = computed(() => [
  {
    title: 'Total Artists',
    value: '127',
    change: '+12',
    trend: 'up',
    icon: Users,
    color: 'primary',
    period: 'this month'
  },
  {
    title: 'Active Projects',
    value: projects.value?.filter(p => p.status === 'active').length || 0,
    change: '+3',
    trend: 'up',
    icon: FolderKanban,
    color: 'accent',
    period: 'this month'
  },
  {
    title: 'Revenue',
    value: '$48.2K',
    change: '+18.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'emerald',
    period: 'this month'
  },
  {
    title: 'Deliverables Done',
    value: deliverables.value?.filter(d => d.status === 'approved').length || 0,
    change: '+24',
    trend: 'up',
    icon: CheckCircle2,
    color: 'blue',
    period: 'this week'
  }
])

// Pending deliverables
const pendingDeliverables = computed(() => {
  return (deliverables.value || [])
    .filter(d => d.status === 'not_started' || d.status === 'in_progress')
    .slice(0, 5)
})

// Recent activity (mock)
const recentActivity = [
  { id: 1, type: 'new_artist', message: 'New artist registered', artist: 'Luna Echo', time: '5 min ago' },
  { id: 2, type: 'deliverable', message: 'Deliverable completed', artist: 'Demo Artist', time: '12 min ago' },
  { id: 3, type: 'subscription', message: 'Plan upgraded to Pro', artist: 'Neon Pulse', time: '1 hour ago' },
  { id: 4, type: 'project', message: 'New project created', artist: 'Demo Artist', time: '2 hours ago' },
  { id: 5, type: 'addon', message: 'Add-on purchased', artist: 'Crystal Wave', time: '3 hours ago' }
]

const statusColors: Record<string, string> = {
  not_started: 'bg-amber-500/10 text-amber-400',
  in_progress: 'bg-blue-500/10 text-blue-400',
  review: 'bg-purple-500/10 text-purple-400',
  revision: 'bg-orange-500/10 text-orange-400',
  approved: 'bg-emerald-500/10 text-emerald-400',
  cancelled: 'bg-red-500/10 text-red-400'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold mb-1">Admin Dashboard</h1>
      <p class="text-dark-400">Overview of your agency's performance</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UiCard
        v-for="stat in stats"
        :key="stat.title"
        class="group hover:border-accent-500/30 transition-all"
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
                <span class="text-dark-500 text-sm">{{ stat.period }}</span>
              </div>
            </div>
            <div
              :class="[
                'h-12 w-12 rounded-xl flex items-center justify-center',
                stat.color === 'primary' ? 'bg-primary-500/10 text-primary-400' :
                stat.color === 'accent' ? 'bg-accent-500/10 text-accent-400' :
                stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-blue-500/10 text-blue-400'
              ]"
            >
              <component :is="stat.icon" class="h-6 w-6" />
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Main Content -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Pending Deliverables -->
      <UiCard class="lg:col-span-2">
        <UiCardHeader>
          <div class="flex items-center justify-between">
            <UiCardTitle>Deliverables Queue</UiCardTitle>
            <NuxtLink to="/admin/deliverables">
              <UiButton variant="ghost" size="sm">View All</UiButton>
            </NuxtLink>
          </div>
        </UiCardHeader>
        <UiCardContent class="p-0">
          <div v-if="!pendingDeliverables.length" class="p-6">
            <UiEmptyState
              title="All caught up!"
              description="No pending deliverables at the moment"
              :icon="CheckCircle2"
            />
          </div>
          <div v-else class="divide-y divide-dark-800">
            <div
              v-for="item in pendingDeliverables"
              :key="item.id"
              class="flex items-center gap-4 p-4 hover:bg-dark-800/50 transition-colors"
            >
              <div class="h-10 w-10 rounded-xl bg-dark-700 flex items-center justify-center">
                <Clock class="h-5 w-5 text-dark-400" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium truncate">{{ item.title }}</h4>
                <p class="text-sm text-dark-400">{{ item.description || 'No description' }}</p>
              </div>
              <UiBadge :class="statusColors[item.status]">
                {{ item.status }}
              </UiBadge>
            </div>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Recent Activity -->
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Recent Activity</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="p-0">
          <div class="divide-y divide-dark-800">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-start gap-3 p-4"
            >
              <div
                :class="[
                  'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  activity.type === 'new_artist' ? 'bg-primary-500/10 text-primary-400' :
                  activity.type === 'deliverable' ? 'bg-emerald-500/10 text-emerald-400' :
                  activity.type === 'subscription' ? 'bg-accent-500/10 text-accent-400' :
                  'bg-blue-500/10 text-blue-400'
                ]"
              >
                <component
                  :is="activity.type === 'new_artist' ? Users :
                       activity.type === 'deliverable' ? CheckCircle2 :
                       activity.type === 'subscription' ? TrendingUp :
                       FolderKanban"
                  class="h-4 w-4"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm">
                  <span class="font-medium">{{ activity.artist }}</span>
                  <span class="text-dark-400"> - {{ activity.message }}</span>
                </p>
                <p class="text-xs text-dark-500 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Quick Actions -->
    <div class="grid md:grid-cols-3 gap-4">
      <NuxtLink to="/admin/artists">
        <UiCard class="group hover:border-primary-500/30 transition-all cursor-pointer">
          <UiCardContent class="p-6 flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
              <Users class="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h4 class="font-semibold">Manage Artists</h4>
              <p class="text-sm text-dark-400">View and manage all artists</p>
            </div>
          </UiCardContent>
        </UiCard>
      </NuxtLink>

      <NuxtLink to="/admin/deliverables">
        <UiCard class="group hover:border-accent-500/30 transition-all cursor-pointer">
          <UiCardContent class="p-6 flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-accent-500/10 flex items-center justify-center group-hover:bg-accent-500/20 transition-colors">
              <AlertCircle class="h-6 w-6 text-accent-400" />
            </div>
            <div>
              <h4 class="font-semibold">Deliverables Queue</h4>
              <p class="text-sm text-dark-400">Process pending work</p>
            </div>
          </UiCardContent>
        </UiCard>
      </NuxtLink>

      <NuxtLink to="/admin/services">
        <UiCard class="group hover:border-emerald-500/30 transition-all cursor-pointer">
          <UiCardContent class="p-6 flex items-center gap-4">
            <div class="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <DollarSign class="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h4 class="font-semibold">Services Editor</h4>
              <p class="text-sm text-dark-400">Manage plans and addons</p>
            </div>
          </UiCardContent>
        </UiCard>
      </NuxtLink>
    </div>
  </div>
</template>
