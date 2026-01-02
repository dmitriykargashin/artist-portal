// User types
export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  role: 'artist' | 'admin'
  createdAt: Date
}

export interface ArtistProfile {
  id: string
  userId: string
  genre: string | null
  bio: string | null
  goals: string[] | null
  socialLinks: Record<string, string> | null
  monthlyListeners: number | null
  followers: number | null
  createdAt: Date
}

// Plan types
export interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  priceMonthly: number
  priceYearly: number | null
  features: string[] | null
  deliverables: { name: string; count: number }[] | null
  sessionsPerMonth: number
  responseSla: string | null
  isPopular: boolean
  active: boolean
  sortOrder: number
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  createdAt: Date
}

// Addon types
export type AddonCategory = 'social' | 'spotify' | 'branding' | 'pr' | 'ads' | 'content' | 'strategy'

export interface Addon {
  id: string
  name: string
  slug: string
  category: AddonCategory
  description: string | null
  price: number
  deliveryDays: number
  scope: string[] | null
  requirements: string[] | null
  active: boolean
  sortOrder: number
  createdAt: Date
}

export interface Purchase {
  id: string
  userId: string
  addonId: string
  projectId: string | null
  amount: number
  status: 'pending' | 'completed' | 'refunded'
  createdAt: Date
}

// Project types
export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'cancelled'
export type ProjectType = 'subscription' | 'addon' | 'custom'

export interface Project {
  id: string
  userId: string
  title: string
  description: string | null
  type: ProjectType
  status: ProjectStatus
  progress: number
  startDate: Date | null
  dueDate: Date | null
  completedAt: Date | null
  meta: Record<string, unknown> | null
  createdAt: Date
}

// Deliverable types
export type DeliverableStatus = 'not_started' | 'in_progress' | 'review' | 'revision' | 'approved' | 'cancelled'
export type DeliverablePriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Deliverable {
  id: string
  projectId: string
  title: string
  description: string | null
  status: DeliverableStatus
  priority: DeliverablePriority
  dueDate: Date | null
  completedAt: Date | null
  assignedTo: string | null
  meta: Record<string, unknown> | null
  sortOrder: number
  createdAt: Date
}

export interface DeliverableComment {
  id: string
  deliverableId: string
  authorId: string
  content: string
  isInternal: boolean
  createdAt: Date
}

export interface Attachment {
  id: string
  deliverableId: string | null
  projectId: string | null
  name: string
  url: string
  type: string | null
  size: number | null
  uploadedBy: string | null
  createdAt: Date
}

// Booking types
export type SessionType = 'strategy' | 'content_planning' | 'branding_workshop' | 'review' | 'onboarding'
export type BookingStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'

export interface Booking {
  id: string
  userId: string
  sessionType: SessionType
  title: string
  description: string | null
  startAt: Date
  endAt: Date
  status: BookingStatus
  meetingUrl: string | null
  notes: string | null
  createdAt: Date
}

// Message types
export interface Message {
  id: string
  projectId: string
  authorId: string
  content: string
  attachmentUrl: string | null
  readAt: Date | null
  createdAt: Date
}

// Notification types
export type NotificationType = 'deliverable' | 'message' | 'booking' | 'project' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  content: string | null
  linkUrl: string | null
  readAt: Date | null
  createdAt: Date
}

// Metrics types
export type MetricType = 'content_cadence' | 'campaign_progress' | 'completion_rate' | 'engagement'

export interface Metric {
  id: string
  userId: string
  type: MetricType
  date: Date
  value: number
  meta: Record<string, unknown> | null
  createdAt: Date
}

// Goal types
export type GoalType = 'posts_per_week' | 'deliverables_per_month' | 'sessions_per_month' | 'custom'
export type GoalPeriod = 'weekly' | 'monthly' | 'quarterly'

export interface Goal {
  id: string
  userId: string
  title: string
  type: GoalType
  target: number
  current: number
  period: GoalPeriod
  startDate: Date | null
  endDate: Date | null
  createdAt: Date
}

// Activity types
export interface Activity {
  id: string
  userId: string | null
  type: string
  action: string
  entityType: string | null
  entityId: string | null
  meta: Record<string, unknown> | null
  createdAt: Date
}

// Session (auth) types
export interface Session {
  id: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Extended types with relations
export interface ProjectWithDeliverables extends Project {
  deliverables: Deliverable[]
  user?: User
}

export interface DeliverableWithRelations extends Deliverable {
  project?: Project
  comments?: DeliverableComment[]
  attachments?: Attachment[]
  assignee?: User
}

export interface UserWithProfile extends User {
  profile?: ArtistProfile
  subscription?: Subscription & { plan?: Plan }
}
