import type { User, ArtistProfile, Subscription, Plan } from '~~/shared/types'

interface AuthUser extends User {
  profile?: ArtistProfile | null
  subscription?: (Subscription & { plan?: Plan }) | null
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const loading = useState('auth-loading', () => true)
  const error = useState<string | null>('auth-error', () => null)

  const isAuthenticated = computed(() => !!user.value)
  const isArtist = computed(() => user.value?.role === 'artist')
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function fetchUser() {
    loading.value = true
    error.value = null
    
    try {
      // $fetch automatically includes credentials (cookies) on client-side
      const data = await $fetch('/api/me', {
        credentials: 'include'
      })
      
      if (data?.success && data.user) {
        user.value = data.user as unknown as AuthUser
      } else {
        user.value = null
      }
    } catch (e: any) {
      error.value = e.message
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function login(userId: string, passcode?: string) {
    loading.value = true
    error.value = null
    
    // Clear existing user data before logging in as new user
    user.value = null

    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { userId, passcode }
      })
      
      if (response.success) {
        await fetchUser()
        return { success: true, user: user.value }
      }
      
      return { success: false, error: 'Login failed' }
    } catch (e: any) {
      error.value = e.data?.message || e.message
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      // Clear any cached state
      clearNuxtState('auth-user')
      await navigateTo('/auth')
    } catch (e: any) {
      error.value = e.message
    }
  }

  // Fetch user on init if not already loaded
  if (import.meta.client && !user.value && loading.value) {
    fetchUser()
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isArtist,
    isAdmin,
    fetchUser,
    login,
    logout
  }
}
