export default defineNuxtRouteMiddleware(async (to) => {
  // Skip auth check for public routes
  const publicRoutes = ['/', '/auth']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Only run on client-side - SSR doesn't have access to cookies set by browser
  if (import.meta.server) {
    return
  }

  // Check if user is authenticated
  const { user, fetchUser } = useAuth()
  
  // Try to fetch user if not already loaded
  if (!user.value) {
    await fetchUser()
  }

  // If still no user, redirect to auth
  if (!user.value) {
    return navigateTo('/auth')
  }

  // Check admin routes
  if (to.path.startsWith('/admin') && user.value.role !== 'admin') {
    return navigateTo('/app')
  }
})
