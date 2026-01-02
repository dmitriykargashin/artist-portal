<script setup lang="ts">
import { 
  TrendingUp, 
  TrendingDown,
  Play,
  Users,
  Heart,
  Eye,
  Music2,
  Instagram,
  Target,
  Calendar
} from 'lucide-vue-next'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const { getMetrics, getGoals } = useApi()
const { data: _metrics, pending: _metricsPending } = await useAsyncData('metrics', () => getMetrics())
const { data: goals, pending: goalsPending } = await useAsyncData('goals', () => getGoals())

// Time range filter
const timeRange = ref<'7d' | '30d' | '90d'>('30d')

// Main stats
const mainStats = [
  { 
    title: 'Monthly Streams', 
    value: '2.4M', 
    change: '+12.5%', 
    trend: 'up', 
    icon: Play,
    color: 'primary',
    description: 'Across all platforms'
  },
  { 
    title: 'Total Followers', 
    value: '156K', 
    change: '+8.2%', 
    trend: 'up', 
    icon: Users,
    color: 'accent',
    description: 'Social media combined'
  },
  { 
    title: 'Engagement Rate', 
    value: '4.8%', 
    change: '+0.5%', 
    trend: 'up', 
    icon: Heart,
    color: 'emerald',
    description: 'Average across posts'
  },
  { 
    title: 'Profile Views', 
    value: '89K', 
    change: '-2.1%', 
    trend: 'down', 
    icon: Eye,
    color: 'amber',
    description: 'Last 30 days'
  }
]

// Platform stats
const platformStats = [
  { name: 'Spotify', value: '1.8M', subValue: 'Monthly Listeners', icon: Music2, color: '#1DB954' },
  { name: 'Instagram', value: '45.2K', subValue: 'Followers', icon: Instagram, color: '#E1306C' },
  { name: 'TikTok', value: '78.5K', subValue: 'Followers', icon: Target, color: '#00F2EA' }
]

// Chart data
const chartData = computed(() => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  return {
    labels,
    datasets: [
      {
        label: 'Streams',
        data: [1.2, 1.4, 1.3, 1.6, 1.8, 2.1, 1.9, 2.2, 2.0, 2.3, 2.1, 2.4].map(v => v * 1000000),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1f1f23',
      titleColor: '#fff',
      bodyColor: '#9ca3af',
      borderColor: '#374151',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => `${(context.raw / 1000000).toFixed(1)}M streams`
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6b7280'
      }
    },
    y: {
      grid: {
        color: '#374151'
      },
      ticks: {
        color: '#6b7280',
        callback: (value: string | number) => `${(Number(value) / 1000000).toFixed(1)}M`
      }
    }
  }
}

// Goal progress
function calculateGoalProgress(goal: any) {
  return Math.min(Math.round((goal.current / goal.target) * 100), 100)
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-1">Insights & Analytics</h1>
        <p class="text-dark-400">Track your growth and performance metrics</p>
      </div>
      
      <!-- Time Range Filter -->
      <div class="flex items-center gap-2 p-1 bg-dark-800 rounded-xl">
        <button
          v-for="range in [{ value: '7d', label: '7 Days' }, { value: '30d', label: '30 Days' }, { value: '90d', label: '90 Days' }]"
          :key="range.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            timeRange === range.value 
              ? 'bg-primary-500 text-white' 
              : 'text-dark-400 hover:text-white'
          ]"
          @click="timeRange = range.value as '7d' | '30d' | '90d'"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- Main Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <UiCard
        v-for="stat in mainStats"
        :key="stat.title"
        class="group hover:border-primary-500/30 transition-all"
      >
        <UiCardContent class="p-6">
          <div class="flex items-start justify-between mb-4">
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
            <div
              :class="[
                'flex items-center gap-1 text-sm font-medium',
                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              ]"
            >
              <component
                :is="stat.trend === 'up' ? TrendingUp : TrendingDown"
                class="h-4 w-4"
              />
              {{ stat.change }}
            </div>
          </div>
          <p class="text-dark-400 text-sm mb-1">{{ stat.title }}</p>
          <p class="text-3xl font-bold">{{ stat.value }}</p>
          <p class="text-dark-500 text-xs mt-1">{{ stat.description }}</p>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Charts Row -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Streams Chart -->
      <UiCard class="lg:col-span-2">
        <UiCardHeader>
          <div class="flex items-center justify-between">
            <div>
              <UiCardTitle>Streaming Performance</UiCardTitle>
              <UiCardDescription>Monthly streams over time</UiCardDescription>
            </div>
          </div>
        </UiCardHeader>
        <UiCardContent>
          <div class="h-80">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Platform Breakdown -->
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Platform Stats</UiCardTitle>
        </UiCardHeader>
        <UiCardContent class="space-y-4">
          <div
            v-for="platform in platformStats"
            :key="platform.name"
            class="flex items-center gap-4 p-3 rounded-xl bg-dark-800/50"
          >
            <div
              class="h-10 w-10 rounded-xl flex items-center justify-center"
              :style="{ backgroundColor: `${platform.color}20` }"
            >
              <component
                :is="platform.icon"
                class="h-5 w-5"
                :style="{ color: platform.color }"
              />
            </div>
            <div class="flex-1">
              <p class="font-semibold">{{ platform.value }}</p>
              <p class="text-sm text-dark-400">{{ platform.subValue }}</p>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Goals Section -->
    <UiCard>
      <UiCardHeader>
        <div class="flex items-center justify-between">
          <div>
            <UiCardTitle>Goals & Targets</UiCardTitle>
            <UiCardDescription>Track progress towards your milestones</UiCardDescription>
          </div>
        </div>
      </UiCardHeader>
      <UiCardContent>
        <div v-if="goalsPending" class="space-y-4">
          <UiSkeleton v-for="i in 3" :key="i" class="h-20 w-full" />
        </div>
        <div v-else-if="!goals?.length">
          <UiEmptyState
            title="No goals set"
            description="Set goals to track your progress"
            :icon="Target"
          />
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="goal in goals"
            :key="goal.id"
            class="p-4 rounded-xl bg-dark-800/50"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <Target class="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h4 class="font-medium">{{ goal.title }}</h4>
                  <p class="text-sm text-dark-400">{{ goal.period }} goal</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold">{{ calculateGoalProgress(goal) }}%</p>
                <p class="text-xs text-dark-500">
                  {{ goal.current?.toLocaleString() }} / {{ goal.target?.toLocaleString() }}
                </p>
              </div>
            </div>
            <UiProgress :value="calculateGoalProgress(goal)" />
            <div class="flex items-center justify-between mt-2 text-xs text-dark-500">
              <span>{{ goal.type }}</span>
              <div v-if="goal.endDate" class="flex items-center gap-1">
                <Calendar class="h-3 w-3" />
                <span>Target: {{ new Date(goal.endDate).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
