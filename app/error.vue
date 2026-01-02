<script setup lang="ts">
import { AlertCircle, Home, RefreshCw } from 'lucide-vue-next'

defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message?: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-dark-950 flex items-center justify-center px-6">
    <div class="noise-overlay" />
    
    <div class="relative max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="mx-auto w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
        <AlertCircle class="w-10 h-10 text-red-400" />
      </div>

      <!-- Error Code -->
      <div class="text-7xl font-bold text-white mb-2">
        {{ error.statusCode }}
      </div>

      <!-- Error Message -->
      <h1 class="text-xl font-semibold text-white mb-2">
        {{ error.statusMessage || 'Something went wrong' }}
      </h1>
      
      <p class="text-dark-400 mb-8">
        {{ error.message || "We couldn't process your request. Please try again." }}
      </p>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-4">
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-dark-800 hover:bg-dark-700 text-white rounded-xl transition-colors"
          @click="$router.back()"
        >
          <RefreshCw class="w-4 h-4" />
          Go Back
        </button>
        
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
          @click="handleError"
        >
          <Home class="w-4 h-4" />
          Home
        </button>
      </div>
    </div>
  </div>
</template>
