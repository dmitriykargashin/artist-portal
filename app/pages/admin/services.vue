<script setup lang="ts">
import { 
  Plus, 
  Edit, 
  Trash2, 
  Zap, 
  Star, 
  Crown,
  Music2,
  Instagram,
  Palette,
  Newspaper,
  Target,
  Lightbulb,
  DollarSign,
  Check
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { getPlans, getAddons } = useApi()
const { addToast } = useToast()

const { data: plans, pending: plansPending } = await useAsyncData('admin-plans', () => getPlans())
const { data: addons, pending: addonsPending } = await useAsyncData('admin-addons', () => getAddons())

const activeTab = ref<'plans' | 'addons'>('plans')

// Plan icons
const planIcons: Record<string, any> = {
  Starter: Zap,
  Growth: Star,
  Pro: Crown
}

const planColors: Record<string, string> = {
  Starter: 'from-blue-500 to-cyan-500',
  Growth: 'from-primary-500 to-pink-500',
  Pro: 'from-amber-500 to-orange-500'
}

// Addon category icons
const categoryIcons: Record<string, any> = {
  social: Instagram,
  spotify: Music2,
  branding: Palette,
  pr: Newspaper,
  ads: Target,
  strategy: Lightbulb
}

const categoryNames: Record<string, string> = {
  social: 'Social Media',
  spotify: 'Spotify',
  branding: 'Branding',
  pr: 'PR & Press',
  ads: 'Advertising',
  strategy: 'Strategy'
}

// Group addons by category
const addonsByCategory = computed(() => {
  if (!addons.value) return {}
  
  return addons.value.reduce((acc, addon) => {
    const category = addon.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category]!.push(addon)
    return acc
  }, {} as Record<string, typeof addons.value>)
})

function handleEdit(type: string, id: string) {
  addToast({
    type: 'info',
    title: 'Edit Mode',
    message: `Editing ${type} #${id} (demo only)`
  })
}

function handleDelete(_type: string, _id: string) {
  addToast({
    type: 'warning',
    title: 'Delete Disabled',
    message: 'Delete is disabled in demo mode'
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-1">Services Editor</h1>
        <p class="text-dark-400">Manage subscription plans and add-on services</p>
      </div>
      <UiButton class="gap-2">
        <Plus class="h-4 w-4" />
        Add {{ activeTab === 'plans' ? 'Plan' : 'Service' }}
      </UiButton>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 p-1 bg-dark-800 rounded-xl w-fit">
      <button
        :class="[
          'px-6 py-2 rounded-lg text-sm font-medium transition-all',
          activeTab === 'plans'
            ? 'bg-accent-500 text-white'
            : 'text-dark-400 hover:text-white'
        ]"
        @click="activeTab = 'plans'"
      >
        Subscription Plans
      </button>
      <button
        :class="[
          'px-6 py-2 rounded-lg text-sm font-medium transition-all',
          activeTab === 'addons'
            ? 'bg-accent-500 text-white'
            : 'text-dark-400 hover:text-white'
        ]"
        @click="activeTab = 'addons'"
      >
        Add-on Services
      </button>
    </div>

    <!-- Plans Tab -->
    <div v-if="activeTab === 'plans'" class="space-y-6">
      <div v-if="plansPending" class="grid md:grid-cols-3 gap-6">
        <UiCard v-for="i in 3" :key="i" class="p-6">
          <UiSkeleton class="h-12 w-12 rounded-xl mb-4" />
          <UiSkeleton class="h-6 w-24 mb-2" />
          <UiSkeleton class="h-10 w-32 mb-4" />
          <UiSkeleton class="h-4 w-full mb-6" />
          <div class="space-y-2">
            <UiSkeleton v-for="j in 5" :key="j" class="h-4 w-full" />
          </div>
        </UiCard>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-6">
        <UiCard
          v-for="plan in plans"
          :key="plan.id"
          class="group hover:border-accent-500/30 transition-all"
        >
          <UiCardContent class="p-6">
            <!-- Icon -->
            <div class="flex items-center justify-between mb-4">
              <div
                :class="[
                  'h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br',
                  planColors[plan.name] || 'from-primary-500 to-accent-500'
                ]"
              >
                <component
                  :is="planIcons[plan.name] || Zap"
                  class="h-7 w-7 text-white"
                />
              </div>
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                  @click="handleEdit('plan', plan.id)"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  class="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-red-400 transition-colors"
                  @click="handleDelete('plan', plan.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Name & Price -->
            <h3 class="text-2xl font-bold mb-1">{{ plan.name }}</h3>
            <div class="flex items-baseline gap-1 mb-4">
              <span class="text-3xl font-bold">${{ plan.priceMonthly }}</span>
              <span class="text-dark-400">/month</span>
            </div>

            <!-- Description -->
            <p class="text-dark-400 mb-6">
              {{ plan.description }}
            </p>

            <!-- Features -->
            <ul class="space-y-2">
              <li
                v-for="(feature, index) in (plan.features || [])"
                :key="index"
                class="flex items-start gap-2 text-sm"
              >
                <Check class="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span class="text-dark-300">{{ feature }}</span>
              </li>
            </ul>
          </UiCardContent>
        </UiCard>
      </div>
    </div>

    <!-- Addons Tab -->
    <div v-else class="space-y-8">
      <div v-if="addonsPending" class="grid md:grid-cols-3 gap-6">
        <UiCard v-for="i in 6" :key="i" class="p-6">
          <UiSkeleton class="h-12 w-12 rounded-xl mb-4" />
          <UiSkeleton class="h-6 w-32 mb-2" />
          <UiSkeleton class="h-4 w-full mb-4" />
          <UiSkeleton class="h-8 w-24" />
        </UiCard>
      </div>

      <template v-else>
        <div
          v-for="(categoryAddons, category) in addonsByCategory"
          :key="category"
          class="space-y-4"
        >
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
              <component
                :is="categoryIcons[category] || Lightbulb"
                class="h-4 w-4 text-accent-400"
              />
            </div>
            <h2 class="text-lg font-semibold">{{ categoryNames[category] || category }}</h2>
            <span class="text-dark-500 text-sm">({{ categoryAddons.length }} services)</span>
          </div>

          <div class="grid md:grid-cols-3 gap-4">
            <UiCard
              v-for="addon in categoryAddons"
              :key="addon.id"
              class="group hover:border-accent-500/30 transition-all"
            >
              <UiCardContent class="p-4">
                <div class="flex items-start justify-between mb-3">
                  <h4 class="font-semibold">{{ addon.name }}</h4>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      class="p-1.5 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
                      @click="handleEdit('addon', addon.id)"
                    >
                      <Edit class="h-3.5 w-3.5" />
                    </button>
                    <button
                      class="p-1.5 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-red-400 transition-colors"
                      @click="handleDelete('addon', addon.id)"
                    >
                      <Trash2 class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p class="text-sm text-dark-400 line-clamp-2 mb-3">
                  {{ addon.description }}
                </p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1 text-emerald-400 font-semibold">
                    <DollarSign class="h-4 w-4" />
                    {{ addon.price }}
                  </div>
                  <UiBadge class="bg-dark-700 text-dark-300 text-xs">
                    one-time
                  </UiBadge>
                </div>
              </UiCardContent>
            </UiCard>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
