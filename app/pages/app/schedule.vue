<script setup lang="ts">
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Video,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'

definePageMeta({
  layout: 'app',
  middleware: 'auth'
})

const { getBookings } = useApi()
const { data: bookings, pending } = await useAsyncData('bookings', () => getBookings())

// Calendar state
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

const monthName = computed(() => 
  currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

// Generate calendar days
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startPadding = firstDay.getDay()
  const days: Array<{ date: Date; isCurrentMonth: boolean; isToday: boolean; hasBooking: boolean }> = []

  // Previous month padding
  for (let i = startPadding - 1; i >= 0; i--) {
    const date = new Date(currentYear.value, currentMonth.value, -i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      hasBooking: hasBookingOnDate(date)
    })
  }

  // Current month
  const today = new Date()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(currentYear.value, currentMonth.value, i)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      hasBooking: hasBookingOnDate(date)
    })
  }

  // Next month padding
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      hasBooking: hasBookingOnDate(date)
    })
  }

  return days
})

function hasBookingOnDate(date: Date) {
  if (!bookings.value) return false
  return bookings.value.some(b => {
    const bookingDate = new Date(b.startAt)
    return bookingDate.toDateString() === date.toDateString()
  })
}

function getBookingsForDate(date: Date) {
  if (!bookings.value) return []
  return bookings.value.filter(b => {
    const bookingDate = new Date(b.startAt)
    return bookingDate.toDateString() === date.toDateString()
  })
}

function previousMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

function selectDate(date: Date) {
  selectedDate.value = date
}

function formatTime(dateStr: string | Date) {
  return new Date(dateStr).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

// Selected date bookings
const selectedBookings = computed(() => {
  if (!selectedDate.value) return []
  return getBookingsForDate(selectedDate.value)
})

// Upcoming bookings (next 7 days)
const upcomingBookings = computed(() => {
  if (!bookings.value) return []
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  return bookings.value
    .filter(b => {
      const date = new Date(b.startAt)
      return date >= today && date <= nextWeek
    })
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
})

// Booking type icons
const typeIcons: Record<string, any> = {
  strategy: Phone,
  content_planning: Video,
  branding_workshop: MapPin,
  review: Video,
  onboarding: Phone
}

const typeColors: Record<string, string> = {
  strategy: 'bg-blue-500/10 text-blue-400',
  content_planning: 'bg-purple-500/10 text-purple-400',
  branding_workshop: 'bg-emerald-500/10 text-emerald-400',
  review: 'bg-amber-500/10 text-amber-400',
  onboarding: 'bg-primary-500/10 text-primary-400'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold mb-1">Schedule</h1>
        <p class="text-dark-400">Manage your meetings, calls, and sessions</p>
      </div>
      <UiButton class="gap-2">
        <Plus class="h-4 w-4" />
        New Booking
      </UiButton>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Calendar -->
      <UiCard class="lg:col-span-2">
        <UiCardHeader>
          <div class="flex items-center justify-between">
            <UiCardTitle>{{ monthName }}</UiCardTitle>
            <div class="flex items-center gap-2">
              <UiButton variant="ghost" size="sm" @click="previousMonth">
                <ChevronLeft class="h-4 w-4" />
              </UiButton>
              <UiButton variant="ghost" size="sm" @click="nextMonth">
                <ChevronRight class="h-4 w-4" />
              </UiButton>
            </div>
          </div>
        </UiCardHeader>
        <UiCardContent>
          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
              :key="day"
              class="text-center text-sm text-dark-400 py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="[
                'relative aspect-square p-2 rounded-xl text-sm transition-all',
                day.isCurrentMonth ? 'hover:bg-dark-800' : 'text-dark-600 hover:bg-dark-800/50',
                day.isToday ? 'bg-primary-500/10 text-primary-300 ring-1 ring-primary-500/30' : '',
                selectedDate?.toDateString() === day.date.toDateString() ? 'bg-primary-500 text-white' : ''
              ]"
              @click="selectDate(day.date)"
            >
              <span>{{ day.date.getDate() }}</span>
              <div
                v-if="day.hasBooking"
                class="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-accent-400"
              />
            </button>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Selected Date -->
        <UiCard v-if="selectedDate">
          <UiCardHeader>
            <UiCardTitle class="text-base">
              {{ selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}
            </UiCardTitle>
          </UiCardHeader>
          <UiCardContent class="p-0">
            <div v-if="selectedBookings.length === 0" class="p-4">
              <p class="text-dark-400 text-sm text-center">No bookings for this day</p>
            </div>
            <div v-else class="divide-y divide-dark-800">
              <div
                v-for="booking in selectedBookings"
                :key="booking.id"
                class="p-4 hover:bg-dark-800/50 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <div :class="['h-10 w-10 rounded-xl flex items-center justify-center', typeColors[booking.sessionType] || 'bg-dark-700']">
                    <component :is="typeIcons[booking.sessionType] || CalendarIcon" class="h-5 w-5" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium">{{ booking.title }}</h4>
                    <div class="flex items-center gap-2 mt-1 text-sm text-dark-400">
                      <Clock class="h-3 w-3" />
                      <span>{{ formatTime(booking.startAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UiCardContent>
        </UiCard>

        <!-- Upcoming -->
        <UiCard>
          <UiCardHeader>
            <UiCardTitle class="text-base">Upcoming This Week</UiCardTitle>
          </UiCardHeader>
          <UiCardContent class="p-0">
            <div v-if="pending" class="p-4 space-y-3">
              <UiSkeleton v-for="i in 3" :key="i" class="h-16 w-full" />
            </div>
            <div v-else-if="upcomingBookings.length === 0" class="p-4">
              <p class="text-dark-400 text-sm text-center">No upcoming bookings</p>
            </div>
            <div v-else class="divide-y divide-dark-800">
              <div
                v-for="booking in upcomingBookings"
                :key="booking.id"
                class="p-4 hover:bg-dark-800/50 transition-colors cursor-pointer"
                @click="selectDate(new Date(booking.startAt))"
              >
                <div class="flex items-start gap-3">
                  <div :class="['h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0', typeColors[booking.sessionType] || 'bg-dark-700']">
                    <component :is="typeIcons[booking.sessionType] || CalendarIcon" class="h-5 w-5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium truncate">{{ booking.title }}</h4>
                    <div class="flex items-center gap-2 mt-1 text-sm text-dark-400">
                      <span>{{ new Date(booking.startAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }}</span>
                      <span>•</span>
                      <span>{{ formatTime(booking.startAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UiCardContent>
        </UiCard>
      </div>
    </div>
  </div>
</template>
