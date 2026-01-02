<script setup lang="ts">
import { Check, Zap, Star, Crown, ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const { getPlans, subscribe } = useApi()
const { addToast } = useToast()
const { user, fetchUser } = useAuth()

const { data: plans, pending } = await useAsyncData('plans', () => getPlans())
const subscribing = ref(false)
const selectedPlan = ref<string | null>(null)

// Get current subscription
const currentPlanId = computed(() => user.value?.subscription?.planId)

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

async function handleSubscribe(planId: string) {
  if (subscribing.value) return
  
  selectedPlan.value = planId
  subscribing.value = true
  
  try {
    const result = await subscribe(planId)
    
    if (result.success) {
      addToast({
        type: 'success',
        title: 'Subscription Updated!',
        message: 'Your plan has been successfully updated.'
      })
      await fetchUser()
    } else {
      addToast({
        type: 'error',
        title: 'Subscription Failed',
        message: 'Could not update subscription.'
      })
    }
  } catch {
    addToast({
      type: 'error',
      title: 'Error',
      message: 'Something went wrong. Please try again.'
    })
  } finally {
    subscribing.value = false
    selectedPlan.value = null
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Choose Your Plan</h1>
      <p class="text-xl text-dark-400 max-w-2xl mx-auto">
        Select the plan that best fits your career goals. Upgrade or downgrade anytime.
      </p>
    </div>

    <!-- Current Plan Banner -->
    <div v-if="currentPlanId" class="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20">
      <div class="flex items-center justify-center gap-2 text-primary-300">
        <Check class="h-5 w-5" />
        <span>You're currently on the <strong>{{ user?.subscription?.plan?.name }}</strong> plan</span>
      </div>
    </div>

    <!-- Plans Grid -->
    <div v-if="pending" class="grid md:grid-cols-3 gap-6">
      <UiCard v-for="i in 3" :key="i" class="p-6">
        <UiSkeleton class="h-12 w-12 rounded-xl mb-4" />
        <UiSkeleton class="h-6 w-24 mb-2" />
        <UiSkeleton class="h-10 w-32 mb-4" />
        <UiSkeleton class="h-4 w-full mb-2" />
        <UiSkeleton class="h-4 w-3/4 mb-6" />
        <div class="space-y-2">
          <UiSkeleton v-for="j in 5" :key="j" class="h-4 w-full" />
        </div>
      </UiCard>
    </div>

    <div v-else class="grid md:grid-cols-3 gap-6">
      <UiCard
        v-for="plan in plans"
        :key="plan.id"
        :class="`relative overflow-hidden transition-all ${plan.name === 'Growth' ? 'border-primary-500/50 ring-1 ring-primary-500/20' : ''} ${currentPlanId === plan.id ? 'border-emerald-500/50' : ''}`"
      >
        <!-- Popular Badge -->
        <div
          v-if="plan.name === 'Growth'"
          class="absolute top-4 right-4 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full"
        >
          Most Popular
        </div>

        <!-- Current Badge -->
        <div
          v-if="currentPlanId === plan.id"
          class="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full"
        >
          Current Plan
        </div>

        <UiCardContent class="p-6">
          <!-- Icon -->
          <div
            :class="[
              'h-14 w-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br',
              planColors[plan.name] || 'from-primary-500 to-accent-500'
            ]"
          >
            <component
              :is="planIcons[plan.name] || Zap"
              class="h-7 w-7 text-white"
            />
          </div>

          <!-- Name & Price -->
          <h3 class="text-2xl font-bold mb-1">{{ plan.name }}</h3>
          <div class="flex items-baseline gap-1 mb-4">
            <span class="text-4xl font-bold">${{ plan.priceMonthly }}</span>
            <span class="text-dark-400">/month</span>
          </div>

          <!-- Description -->
          <p class="text-dark-400 mb-6">
            {{ plan.description }}
          </p>

          <!-- Features -->
          <ul class="space-y-3 mb-8">
            <li
              v-for="(feature, index) in (plan.features || [])"
              :key="index"
              class="flex items-start gap-3"
            >
              <div class="h-5 w-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check class="h-3 w-3 text-primary-400" />
              </div>
              <span class="text-dark-300">{{ feature }}</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <UiButton
            v-if="currentPlanId !== plan.id"
            :variant="plan.name === 'Growth' ? 'default' : 'outline'"
            :loading="subscribing && selectedPlan === plan.id"
            class="w-full justify-center gap-2"
            @click="handleSubscribe(plan.id)"
          >
            <span v-if="currentPlanId && currentPlanId > plan.id">Downgrade</span>
            <span v-else-if="currentPlanId && currentPlanId < plan.id">Upgrade</span>
            <span v-else>Get Started</span>
            <ArrowRight class="h-4 w-4" />
          </UiButton>
          
          <UiButton
            v-else
            variant="secondary"
            disabled
            class="w-full justify-center"
          >
            <Check class="h-4 w-4 mr-2" />
            Current Plan
          </UiButton>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- FAQ Section -->
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Frequently Asked Questions</UiCardTitle>
      </UiCardHeader>
      <UiCardContent class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-semibold mb-2">Can I change plans anytime?</h4>
          <p class="text-dark-400 text-sm">
            Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
          </p>
        </div>
        <div>
          <h4 class="font-semibold mb-2">What payment methods do you accept?</h4>
          <p class="text-dark-400 text-sm">
            We accept all major credit cards, PayPal, and bank transfers for annual plans.
          </p>
        </div>
        <div>
          <h4 class="font-semibold mb-2">Is there a free trial?</h4>
          <p class="text-dark-400 text-sm">
            Yes, all new accounts start with a 14-day free trial of the Growth plan.
          </p>
        </div>
        <div>
          <h4 class="font-semibold mb-2">Can I cancel my subscription?</h4>
          <p class="text-dark-400 text-sm">
            You can cancel anytime. You'll retain access until the end of your billing period.
          </p>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
