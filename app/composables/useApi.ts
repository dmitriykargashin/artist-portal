import type { Plan, Addon, Project, Deliverable, Booking, Notification, Goal } from '~~/shared/types'

export const useApi = () => {
  // Plans
  async function getPlans() {
    const { data, error } = await useFetch<{ success: boolean; plans: Plan[] }>('/api/plans')
    if (error.value) throw new Error(error.value.message)
    return data.value?.plans || []
  }

  async function subscribe(planId: string) {
    const response = await $fetch<{ success: boolean; message: string }>('/api/subscribe', {
      method: 'POST',
      body: { planId }
    })
    return response
  }

  // Addons
  async function getAddons(category?: string) {
    const query = category ? `?category=${category}` : ''
    const { data, error } = await useFetch<{ success: boolean; addons: Addon[] }>(`/api/addons${query}`)
    if (error.value) throw new Error(error.value.message)
    return data.value?.addons || []
  }

  async function purchaseAddon(addonId: string) {
    const response = await $fetch<{ success: boolean; message: string; projectId: string }>('/api/purchase-addon', {
      method: 'POST',
      body: { addonId }
    })
    return response
  }

  // Projects
  async function getProjects(status?: string) {
    const query = status ? `?status=${status}` : ''
    const { data, error } = await useFetch<{ success: boolean; projects: Project[] }>(`/api/projects${query}`)
    if (error.value) throw new Error(error.value.message)
    return data.value?.projects || []
  }

  async function getProject(id: string) {
    const { data, error } = await useFetch<{ success: boolean; project: Project }>(`/api/projects/${id}`)
    if (error.value) throw new Error(error.value.message)
    return data.value?.project
  }

  // Deliverables
  async function getDeliverables(options?: { status?: string; projectId?: string }) {
    const params = new URLSearchParams()
    if (options?.status) params.append('status', options.status)
    if (options?.projectId) params.append('projectId', options.projectId)
    const query = params.toString() ? `?${params.toString()}` : ''
    
    const { data, error } = await useFetch<{ success: boolean; deliverables: Deliverable[] }>(`/api/deliverables${query}`)
    if (error.value) throw new Error(error.value.message)
    return data.value?.deliverables || []
  }

  async function updateDeliverable(id: string, updates: { status?: string; comment?: string }) {
    const response = await $fetch<{ success: boolean; message: string }>(`/api/deliverables/${id}`, {
      method: 'PATCH',
      body: updates
    })
    return response
  }

  // Bookings
  async function getBookings(options?: { status?: string; upcoming?: boolean }) {
    const params = new URLSearchParams()
    if (options?.status) params.append('status', options.status)
    if (options?.upcoming) params.append('upcoming', 'true')
    const query = params.toString() ? `?${params.toString()}` : ''

    const { data, error } = await useFetch<{ success: boolean; bookings: Booking[] }>(`/api/bookings${query}`)
    if (error.value) throw new Error(error.value.message)
    return data.value?.bookings || []
  }

  async function createBooking(booking: {
    sessionType: string
    title: string
    description?: string
    startAt: Date
    endAt: Date
  }) {
    const response = await $fetch<{ success: boolean; message: string; bookingId: string }>('/api/bookings', {
      method: 'POST',
      body: {
        ...booking,
        startAt: booking.startAt.toISOString(),
        endAt: booking.endAt.toISOString()
      }
    })
    return response
  }

  async function updateBooking(id: string, updates: {
    status?: string
    startAt?: Date
    endAt?: Date
    notes?: string
  }) {
    const body: Record<string, any> = { ...updates }
    if (updates.startAt) body.startAt = updates.startAt.toISOString()
    if (updates.endAt) body.endAt = updates.endAt.toISOString()

    const response = await $fetch<{ success: boolean; message: string }>(`/api/bookings/${id}`, {
      method: 'PATCH',
      body
    })
    return response
  }

  // Notifications
  async function getNotifications(unreadOnly = false) {
    const query = unreadOnly ? '?unread=true' : ''
    const { data, error } = await useFetch<{ success: boolean; notifications: Notification[] }>(`/api/notifications${query}`)
    if (error.value) throw new Error(error.value.message)
    return data.value?.notifications || []
  }

  // Goals
  async function getGoals() {
    const { data, error } = await useFetch<{ success: boolean; goals: Goal[] }>('/api/goals')
    if (error.value) throw new Error(error.value.message)
    return data.value?.goals || []
  }

  // Metrics
  async function getMetrics(type?: string) {
    const query = type ? `?type=${type}` : ''
    const { data, error } = await useFetch<{ success: boolean; metrics: any[] }>(`/api/metrics${query}`)
    if (error.value) throw new Error(error.value.message)
    return data.value?.metrics || []
  }

  // Activities
  async function getActivities(limit = 20) {
    const { data, error } = await useFetch<{ success: boolean; activities: any[] }>(`/api/activities?limit=${limit}`)
    if (error.value) throw new Error(error.value.message)
    return data.value?.activities || []
  }

  return {
    getPlans,
    subscribe,
    getAddons,
    purchaseAddon,
    getProjects,
    getProject,
    getDeliverables,
    updateDeliverable,
    getBookings,
    createBooking,
    updateBooking,
    getNotifications,
    getGoals,
    getMetrics,
    getActivities
  }
}
