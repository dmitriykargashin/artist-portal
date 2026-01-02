<script setup lang="ts">
import { 
  Search, 
  Crown,
  Star,
  Zap,
  Eye,
  Edit,
  Trash2
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

// Mock artists data
const artists = ref([
  {
    id: 1,
    name: 'Demo Artist',
    email: 'artist@demo.com',
    avatar: null,
    plan: 'Growth',
    status: 'active',
    joinedAt: '2024-01-15',
    projects: 4,
    lastActive: '2 hours ago'
  },
  {
    id: 2,
    name: 'Luna Echo',
    email: 'luna@example.com',
    avatar: null,
    plan: 'Pro',
    status: 'active',
    joinedAt: '2024-02-20',
    projects: 6,
    lastActive: '1 day ago'
  },
  {
    id: 3,
    name: 'Neon Pulse',
    email: 'neon@example.com',
    avatar: null,
    plan: 'Starter',
    status: 'active',
    joinedAt: '2024-03-10',
    projects: 2,
    lastActive: '3 days ago'
  },
  {
    id: 4,
    name: 'Crystal Wave',
    email: 'crystal@example.com',
    avatar: null,
    plan: 'Growth',
    status: 'paused',
    joinedAt: '2024-01-05',
    projects: 3,
    lastActive: '1 week ago'
  },
  {
    id: 5,
    name: 'Midnight Tide',
    email: 'midnight@example.com',
    avatar: null,
    plan: 'Pro',
    status: 'active',
    joinedAt: '2023-12-20',
    projects: 8,
    lastActive: '5 min ago'
  }
])

const searchQuery = ref('')
const selectedPlan = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)

// Filters
const filteredArtists = computed(() => {
  let result = artists.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => 
      a.name.toLowerCase().includes(query) ||
      a.email.toLowerCase().includes(query)
    )
  }

  if (selectedPlan.value) {
    result = result.filter(a => a.plan === selectedPlan.value)
  }

  if (selectedStatus.value) {
    result = result.filter(a => a.status === selectedStatus.value)
  }

  return result
})

// Plan icons
const planIcons: Record<string, any> = {
  Starter: Zap,
  Growth: Star,
  Pro: Crown
}

const planColors: Record<string, string> = {
  Starter: 'bg-blue-500/10 text-blue-400',
  Growth: 'bg-primary-500/10 text-primary-400',
  Pro: 'bg-amber-500/10 text-amber-400'
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400',
  paused: 'bg-amber-500/10 text-amber-400',
  inactive: 'bg-red-500/10 text-red-400'
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-1">Artists</h1>
        <p class="text-dark-400">Manage your agency's artist roster</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-dark-400">{{ filteredArtists.length }} artists</span>
      </div>
    </div>

    <!-- Filters -->
    <UiCard>
      <UiCardContent class="p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Search -->
          <div class="relative flex-1">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or email..."
              class="w-full pl-12 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-all"
            >
          </div>

          <!-- Plan Filter -->
          <select
            v-model="selectedPlan"
            class="px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          >
            <option :value="null">All Plans</option>
            <option value="Starter">Starter</option>
            <option value="Growth">Growth</option>
            <option value="Pro">Pro</option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="selectedStatus"
            class="px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          >
            <option :value="null">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </UiCardContent>
    </UiCard>

    <!-- Artists Table -->
    <UiCard>
      <UiCardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-dark-800">
                <th class="text-left p-4 text-sm font-medium text-dark-400">Artist</th>
                <th class="text-left p-4 text-sm font-medium text-dark-400">Plan</th>
                <th class="text-left p-4 text-sm font-medium text-dark-400">Status</th>
                <th class="text-left p-4 text-sm font-medium text-dark-400">Projects</th>
                <th class="text-left p-4 text-sm font-medium text-dark-400">Last Active</th>
                <th class="text-left p-4 text-sm font-medium text-dark-400">Joined</th>
                <th class="text-right p-4 text-sm font-medium text-dark-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-800">
              <tr
                v-for="artist in filteredArtists"
                :key="artist.id"
                class="hover:bg-dark-800/50 transition-colors"
              >
                <td class="p-4">
                  <div class="flex items-center gap-3">
                    <UiAvatar>
                      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white font-medium">
                        {{ getInitials(artist.name) }}
                      </span>
                    </UiAvatar>
                    <div>
                      <p class="font-medium">{{ artist.name }}</p>
                      <p class="text-sm text-dark-400">{{ artist.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <div :class="['h-6 w-6 rounded-lg flex items-center justify-center', planColors[artist.plan]]">
                      <component :is="planIcons[artist.plan]" class="h-3.5 w-3.5" />
                    </div>
                    <span>{{ artist.plan }}</span>
                  </div>
                </td>
                <td class="p-4">
                  <UiBadge :class="statusColors[artist.status]">
                    {{ artist.status }}
                  </UiBadge>
                </td>
                <td class="p-4 text-dark-300">
                  {{ artist.projects }}
                </td>
                <td class="p-4 text-dark-400 text-sm">
                  {{ artist.lastActive }}
                </td>
                <td class="p-4 text-dark-400 text-sm">
                  {{ formatDate(artist.joinedAt) }}
                </td>
                <td class="p-4">
                  <div class="flex items-center justify-end gap-1">
                    <button class="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button class="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button class="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-red-400 transition-colors">
                      <Trash2 class="h-4 w-4" />
                    </button>
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
