<script setup lang="ts">
import { 
  ShoppingCart, 
  Check, 
  Filter,
  Music2,
  Instagram,
  Palette,
  Newspaper,
  Target,
  Lightbulb,
  Search
} from 'lucide-vue-next'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const { getAddons, purchaseAddon } = useApi()
const { addToast } = useToast()
const { fetchUser } = useAuth()

const { data: addons, pending } = await useAsyncData('addons', () => getAddons())
const purchasing = ref(false)
const selectedAddon = ref<string | null>(null)
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)

// Categories with icons
const categories = [
  { id: 'social', name: 'Social Media', icon: Instagram },
  { id: 'spotify', name: 'Spotify', icon: Music2 },
  { id: 'branding', name: 'Branding', icon: Palette },
  { id: 'pr', name: 'PR & Press', icon: Newspaper },
  { id: 'ads', name: 'Advertising', icon: Target },
  { id: 'strategy', name: 'Strategy', icon: Lightbulb }
]

// Filter addons
const filteredAddons = computed(() => {
  if (!addons.value) return []
  
  let result = addons.value
  
  if (selectedCategory.value) {
    result = result.filter(a => a.category === selectedCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a => 
      a.name.toLowerCase().includes(query) ||
      a.description?.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Check if addon is purchased (simplified - would track via API in production)
const purchasedAddonIds = ref<string[]>([])

function isPurchased(addonId: string) {
  return purchasedAddonIds.value.includes(addonId)
}

// Category icon helper
function getCategoryIcon(category: string) {
  const cat = categories.find(c => c.id === category)
  return cat?.icon || Lightbulb
}

async function handlePurchase(addonId: string) {
  if (purchasing.value || isPurchased(addonId)) return
  
  selectedAddon.value = addonId
  purchasing.value = true
  
  try {
    const result = await purchaseAddon(addonId)
    
    if (result.success) {
      purchasedAddonIds.value.push(addonId)
      addToast({
        type: 'success',
        title: 'Service Added!',
        message: 'The service has been added to your account.'
      })
      await fetchUser()
    } else {
      addToast({
        type: 'error',
        title: 'Purchase Failed',
        message: 'Could not complete purchase.'
      })
    }
  } catch {
    addToast({
      type: 'error',
      title: 'Error',
      message: 'Something went wrong. Please try again.'
    })
  } finally {
    purchasing.value = false
    selectedAddon.value = null
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-4xl font-bold mb-4">Service Marketplace</h1>
      <p class="text-xl text-dark-400">
        Enhance your growth with premium add-on services. One-time purchases to boost your career.
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Search -->
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search services..."
          class="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
        >
      </div>

      <!-- Category Filter -->
      <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        <button
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
            !selectedCategory
              ? 'bg-primary-500 text-white'
              : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
          ]"
          @click="selectedCategory = null"
        >
          <Filter class="h-4 w-4" />
          All
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
            selectedCategory === category.id
              ? 'bg-primary-500 text-white'
              : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
          ]"
          @click="selectedCategory = category.id"
        >
          <component :is="category.icon" class="h-4 w-4" />
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UiCard v-for="i in 6" :key="i" class="p-6">
        <UiSkeleton class="h-12 w-12 rounded-xl mb-4" />
        <UiSkeleton class="h-6 w-32 mb-2" />
        <UiSkeleton class="h-4 w-full mb-2" />
        <UiSkeleton class="h-4 w-3/4 mb-4" />
        <UiSkeleton class="h-10 w-full" />
      </UiCard>
    </div>

    <!-- Empty State -->
    <UiEmptyState
      v-else-if="filteredAddons.length === 0"
      title="No services found"
      description="Try adjusting your search or filter criteria"
      :icon="Search"
    />

    <!-- Addons Grid -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UiCard
        v-for="addon in filteredAddons"
        :key="addon.id"
        :class="`group transition-all ${isPurchased(addon.id) ? 'border-emerald-500/30' : 'hover:border-primary-500/30'}`"
      >
        <UiCardContent class="p-6">
          <!-- Category Icon -->
          <div class="flex items-start justify-between mb-4">
            <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
              <component
                :is="getCategoryIcon(addon.category)"
                class="h-6 w-6 text-primary-300"
              />
            </div>
            <UiBadge v-if="isPurchased(addon.id)" class="bg-emerald-500/10 text-emerald-400">
              <Check class="h-3 w-3 mr-1" />
              Purchased
            </UiBadge>
            <UiBadge v-else class="bg-dark-700 text-dark-300">
              {{ addon.category }}
            </UiBadge>
          </div>

          <!-- Name & Price -->
          <h3 class="text-xl font-semibold mb-1">{{ addon.name }}</h3>
          <div class="flex items-baseline gap-1 mb-3">
            <span class="text-2xl font-bold text-primary-400">${{ addon.price }}</span>
            <span class="text-dark-500 text-sm">one-time</span>
          </div>

          <!-- Description -->
          <p class="text-dark-400 text-sm mb-6 line-clamp-2">
            {{ addon.description }}
          </p>

          <!-- CTA -->
          <UiButton
            v-if="!isPurchased(addon.id)"
            :loading="purchasing && selectedAddon === addon.id"
            class="w-full justify-center gap-2"
            @click="handlePurchase(addon.id)"
          >
            <ShoppingCart class="h-4 w-4" />
            Add to Account
          </UiButton>
          <UiButton
            v-else
            variant="secondary"
            disabled
            class="w-full justify-center"
          >
            <Check class="h-4 w-4 mr-2" />
            Already Purchased
          </UiButton>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
