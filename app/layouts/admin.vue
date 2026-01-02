<script setup lang="ts">
import { 
  LayoutDashboard, 
  Users,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Command,
  User,
  BarChart3
} from 'lucide-vue-next'

const { user, logout } = useAuth()
const { toggle: toggleCommandPalette } = useCommandPalette()
const route = useRoute()

const sidebarCollapsed = useState('sidebar-collapsed', () => false)

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Artists', href: '/admin/artists', icon: Users },
  { name: 'Deliverables Queue', href: '/admin/deliverables', icon: ClipboardList },
  { name: 'Services Editor', href: '/admin/services', icon: Settings },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 }
]

const isActive = (href: string) => {
  if (href === '/admin') return route.path === '/admin'
  return route.path.startsWith(href)
}

const notificationCount = ref(2)
</script>

<template>
  <div class="min-h-screen bg-dark-950 flex">
    <div class="noise-overlay" />
    
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-40 flex flex-col bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 transition-all duration-300',
        sidebarCollapsed ? 'w-[72px]' : 'w-64'
      ]"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center gap-3 px-4 border-b border-dark-700/50">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-primary-500">
          <span class="text-lg font-bold text-white">A</span>
        </div>
        <div v-if="!sidebarCollapsed" class="flex flex-col">
          <span class="font-semibold text-white truncate">Artist Portal</span>
          <span class="text-2xs text-accent-400">Admin</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
            isActive(item.href)
              ? 'bg-accent-500/20 text-accent-300 shadow-lg shadow-accent-500/10'
              : 'text-dark-300 hover:text-white hover:bg-dark-800'
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <span v-if="!sidebarCollapsed">{{ item.name }}</span>
        </NuxtLink>

        <!-- Artist app link -->
        <NuxtLink
          to="/app"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-4 border-t border-dark-700/50 pt-4 text-dark-300 hover:text-white hover:bg-dark-800"
        >
          <User class="h-5 w-5 flex-shrink-0" />
          <span v-if="!sidebarCollapsed">Artist View</span>
        </NuxtLink>
      </nav>

      <!-- Collapse button -->
      <button
        class="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-dark-800 border border-dark-600 text-dark-400 hover:text-white transition-colors"
        @click="sidebarCollapsed = !sidebarCollapsed"
      >
        <ChevronLeft v-if="!sidebarCollapsed" class="h-4 w-4" />
        <ChevronRight v-else class="h-4 w-4" />
      </button>

      <!-- User section -->
      <div class="p-3 border-t border-dark-700/50">
        <div 
          :class="[
            'flex items-center gap-3 p-2 rounded-xl bg-dark-800/50',
            sidebarCollapsed ? 'justify-center' : ''
          ]"
        >
          <ClientOnly>
            <UiAvatar
              :src="user?.avatarUrl"
              :fallback="user?.name || 'U'"
              size="sm"
            />
            <template #fallback>
              <div class="h-8 w-8 rounded-full bg-dark-700 animate-pulse" />
            </template>
          </ClientOnly>
          <div v-if="!sidebarCollapsed" class="flex-1 min-w-0">
            <ClientOnly>
              <p class="text-sm font-medium text-white truncate">{{ user?.name }}</p>
              <p class="text-xs text-accent-400 truncate">Administrator</p>
              <template #fallback>
                <div class="h-4 w-24 bg-dark-700 rounded animate-pulse mb-1" />
                <div class="h-3 w-20 bg-dark-700 rounded animate-pulse" />
              </template>
            </ClientOnly>
          </div>
          <button
            v-if="!sidebarCollapsed"
            class="p-1.5 text-dark-400 hover:text-white rounded-lg hover:bg-dark-700 transition-colors"
            title="Log out"
            @click="logout"
          >
            <LogOut class="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div 
      :class="[
        'flex-1 flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'ml-[72px]' : 'ml-64'
      ]"
    >
      <!-- Top bar -->
      <header class="sticky top-0 z-30 flex h-16 items-center gap-4 px-6 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50">
        <!-- Search -->
        <button 
          class="flex items-center gap-3 h-10 px-4 flex-1 max-w-md bg-dark-800 rounded-xl border border-dark-700 text-dark-400 hover:border-dark-600 transition-colors"
          @click="toggleCommandPalette"
        >
          <Search class="h-4 w-4" />
          <span class="text-sm">Search artists, deliverables...</span>
          <div class="ml-auto flex items-center gap-1">
            <kbd class="px-1.5 py-0.5 text-2xs bg-dark-700 rounded text-dark-400">
              <Command class="h-3 w-3 inline" />
            </kbd>
            <kbd class="px-1.5 py-0.5 text-2xs bg-dark-700 rounded text-dark-400">K</kbd>
          </div>
        </button>

        <div class="flex-1" />

        <!-- Notifications -->
        <button class="relative p-2 text-dark-400 hover:text-white rounded-xl hover:bg-dark-800 transition-colors">
          <Bell class="h-5 w-5" />
          <span 
            v-if="notificationCount > 0"
            class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-2xs text-white font-medium"
          >
            {{ notificationCount }}
          </span>
        </button>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>

    <!-- Command Palette -->
    <ClientOnly>
      <LazyLayoutCommandPalette />
    </ClientOnly>

    <!-- Toast container -->
    <ClientOnly>
      <LayoutToastContainer />
    </ClientOnly>
  </div>
</template>
