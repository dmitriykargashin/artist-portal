<script setup lang="ts">
import { Music, User, Shield, ArrowRight, Sparkles } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth'
})

const { login, loading } = useAuth()
const { addToast } = useToast()

const passcode = ref('')
const selectedUser = ref<string | null>(null)
const step = ref<'select' | 'passcode'>('select')
const error = ref('')

const demoUsers = [
  {
    id: 'user_artist_demo',
    email: 'artist@demo.com',
    name: 'Jordan Rivers',
    role: 'artist',
    icon: User,
    description: 'Experience the artist dashboard with projects, deliverables, and insights.',
    color: 'primary'
  },
  {
    id: 'user_admin_demo',
    email: 'admin@demo.com',
    name: 'Alex Morgan',
    role: 'admin',
    icon: Shield,
    description: 'Access the admin panel to manage artists, deliverables, and services.',
    color: 'accent'
  }
]

// Computed property to get the selected user object
const selectedUserData = computed(() => 
  demoUsers.find(u => u.id === selectedUser.value)
)

function selectUser(userId: string) {
  selectedUser.value = userId
  step.value = 'passcode'
  error.value = ''
}

function goBack() {
  step.value = 'select'
  passcode.value = ''
  error.value = ''
}

async function handleLogin() {
  if (!selectedUserData.value) return

  error.value = ''

  try {
    const result = await login(selectedUserData.value.id, passcode.value)
    
    if (result.success) {
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: `Signed in as ${selectedUserData.value.name}`
      })
      
      // Redirect based on role from the selected user
      const targetPath = selectedUserData.value.role === 'admin' ? '/admin' : '/app'
      
      // Use window.location for a full page reload to clear all cached state
      window.location.href = targetPath
    } else {
      error.value = result.error || 'Invalid passcode'
    }
  } catch {
    error.value = 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="flex items-center justify-center gap-3 mb-8">
      <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
        <Music class="h-6 w-6 text-white" />
      </div>
      <span class="text-2xl font-bold">Artist Portal</span>
    </div>

    <!-- Card -->
    <div class="bg-dark-900/50 border border-dark-800/50 rounded-3xl p-8 backdrop-blur-xl">
      <!-- Step 1: Select User -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 'select'" key="select">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold mb-2">Welcome to the Demo</h1>
            <p class="text-dark-400">Select a demo account to explore the platform</p>
          </div>

          <div class="space-y-4">
            <button
              v-for="user in demoUsers"
              :key="user.id"
              class="group w-full p-4 rounded-2xl border border-dark-700/50 hover:border-primary-500/50 bg-dark-800/50 hover:bg-dark-800 transition-all text-left"
              @click="selectUser(user.id)"
            >
              <div class="flex items-start gap-4">
                <div
                  :class="[
                    'h-12 w-12 rounded-xl flex items-center justify-center transition-colors',
                    user.color === 'primary' 
                      ? 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20'
                      : 'bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20'
                  ]"
                >
                  <component :is="user.icon" class="h-6 w-6" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold">{{ user.name }}</h3>
                    <span
                      :class="[
                        'px-2 py-0.5 text-xs rounded-full',
                        user.role === 'admin' 
                          ? 'bg-accent-500/10 text-accent-400'
                          : 'bg-primary-500/10 text-primary-400'
                      ]"
                    >
                      {{ user.role }}
                    </span>
                  </div>
                  <p class="text-sm text-dark-400">{{ user.description }}</p>
                  <p class="text-xs text-dark-500 mt-1">{{ user.email }}</p>
                </div>
                <ArrowRight class="h-5 w-5 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all mt-3" />
              </div>
            </button>
          </div>

          <div class="mt-6 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50">
            <div class="flex items-start gap-3">
              <Sparkles class="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-amber-300">Demo Passcode</p>
                <p class="text-sm text-dark-400 mt-1">
                  Use the passcode <code class="px-2 py-0.5 bg-dark-700 rounded text-amber-300">DEMO2026</code> to sign in.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Enter Passcode -->
        <div v-else key="passcode">
          <button
            class="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6"
            @click="goBack"
          >
            <ArrowRight class="h-4 w-4 rotate-180" />
            Back
          </button>

          <div class="text-center mb-8">
            <div
              :class="[
                'h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4',
                selectedUserData?.role === 'admin' 
                  ? 'bg-accent-500/10 text-accent-400'
                  : 'bg-primary-500/10 text-primary-400'
              ]"
            >
              <component 
                :is="selectedUserData?.icon || User" 
                class="h-8 w-8" 
              />
            </div>
            <h1 class="text-2xl font-bold mb-1">
              {{ selectedUserData?.role === 'admin' ? 'Admin Login' : 'Artist Login' }}
            </h1>
            <p class="text-dark-400">
              {{ selectedUserData?.email }}
            </p>
          </div>

          <form class="space-y-4" @submit.prevent="handleLogin">
            <div>
              <label class="block text-sm font-medium text-dark-300 mb-2">
                Demo Passcode
              </label>
              <input
                v-model="passcode"
                type="text"
                placeholder="Enter passcode"
                class="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                :class="{ 'border-red-500/50': error }"
                autofocus
              >
              <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
            </div>

            <UiButton
              type="submit"
              :loading="loading"
              class="w-full justify-center"
              size="lg"
            >
              Sign In
            </UiButton>
          </form>

          <p class="mt-6 text-center text-sm text-dark-500">
            Hint: The passcode is <code class="text-dark-400">DEMO2026</code>
          </p>
        </div>
      </Transition>
    </div>

    <!-- Footer -->
    <p class="text-center text-dark-500 text-sm mt-8">
      <NuxtLink to="/" class="hover:text-dark-300 transition-colors">
        ← Back to Home
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
