<script setup lang="ts">
import { 
  Search, 
  LayoutDashboard, 
  Rocket, 
  ShoppingBag, 
  FolderKanban, 
  ClipboardList,
  Calendar,
  BarChart3,
  Users,
  Settings,
  ArrowRight
} from 'lucide-vue-next'

const { isOpen, search, close } = useCommandPalette()
const { isAdmin } = useAuth()
const router = useRouter()

const searchInput = ref<HTMLInputElement>()

const commands = computed(() => {
  const base = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/app', keywords: 'home main overview' },
    { id: 'plans', name: 'Plans & Upgrades', icon: Rocket, href: '/app/plans', keywords: 'subscription pricing tier' },
    { id: 'marketplace', name: 'Marketplace', icon: ShoppingBag, href: '/app/marketplace', keywords: 'addons services buy' },
    { id: 'projects', name: 'Projects', icon: FolderKanban, href: '/app/projects', keywords: 'work campaigns' },
    { id: 'deliverables', name: 'Deliverables', icon: ClipboardList, href: '/app/deliverables', keywords: 'tasks kanban board' },
    { id: 'schedule', name: 'Schedule', icon: Calendar, href: '/app/schedule', keywords: 'booking sessions calls' },
    { id: 'insights', name: 'Insights', icon: BarChart3, href: '/app/insights', keywords: 'analytics stats metrics' }
  ]

  if (isAdmin.value) {
    base.push(
      { id: 'admin', name: 'Admin Overview', icon: LayoutDashboard, href: '/admin', keywords: 'admin panel' },
      { id: 'admin-artists', name: 'Manage Artists', icon: Users, href: '/admin/artists', keywords: 'admin users clients' },
      { id: 'admin-deliverables', name: 'Deliverables Queue', icon: ClipboardList, href: '/admin/deliverables', keywords: 'admin work queue' },
      { id: 'admin-services', name: 'Services Editor', icon: Settings, href: '/admin/services', keywords: 'admin plans addons pricing' }
    )
  }

  return base
})

const filteredCommands = computed(() => {
  if (!search.value) return commands.value
  const query = search.value.toLowerCase()
  return commands.value.filter(cmd => 
    cmd.name.toLowerCase().includes(query) ||
    cmd.keywords.toLowerCase().includes(query)
  )
})

function navigate(href: string) {
  close()
  router.push(href)
}

// Focus input when opened
watch(isOpen, (open) => {
  if (open) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
          @click="close"
        />

        <!-- Command palette -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: -20 }"
          :enter="{ opacity: 1, scale: 1, y: 0 }"
          class="relative w-full max-w-xl bg-dark-900 border border-dark-700/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          <!-- Search input -->
          <div class="flex items-center gap-3 px-4 border-b border-dark-700/50">
            <Search class="h-5 w-5 text-dark-400" />
            <input
              ref="searchInput"
              v-model="search"
              type="text"
              placeholder="Search for pages, actions..."
              class="flex-1 h-14 bg-transparent text-white placeholder:text-dark-400 focus:outline-none"
            >
            <kbd class="px-2 py-1 text-xs bg-dark-800 rounded text-dark-400">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="max-h-80 overflow-y-auto py-2">
            <div v-if="filteredCommands.length === 0" class="px-4 py-8 text-center text-dark-400">
              No results found
            </div>
            
            <button
              v-for="cmd in filteredCommands"
              :key="cmd.id"
              class="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-dark-800 transition-colors group"
              @click="navigate(cmd.href)"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-800 text-dark-300 group-hover:bg-primary-500/20 group-hover:text-primary-300 transition-colors">
                <component :is="cmd.icon" class="h-5 w-5" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-white">{{ cmd.name }}</p>
              </div>
              <ArrowRight class="h-4 w-4 text-dark-500 group-hover:text-primary-400 transition-colors" />
            </button>
          </div>

          <!-- Footer -->
          <div class="px-4 py-3 border-t border-dark-700/50 flex items-center justify-between text-xs text-dark-500">
            <div class="flex items-center gap-4">
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-dark-800 rounded">↵</kbd>
                to select
              </span>
              <span class="flex items-center gap-1">
                <kbd class="px-1.5 py-0.5 bg-dark-800 rounded">↑</kbd>
                <kbd class="px-1.5 py-0.5 bg-dark-800 rounded">↓</kbd>
                to navigate
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.15s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
