import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  role: text('role', { enum: ['artist', 'admin'] }).notNull().default('artist'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Artist profiles (extended info for artists)
export const artistProfiles = sqliteTable('artist_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  genre: text('genre'),
  bio: text('bio'),
  goals: text('goals', { mode: 'json' }).$type<string[]>(),
  socialLinks: text('social_links', { mode: 'json' }).$type<Record<string, string>>(),
  monthlyListeners: integer('monthly_listeners'),
  followers: integer('followers'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Plans table
export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  priceMonthly: real('price_monthly').notNull(),
  priceYearly: real('price_yearly'),
  features: text('features', { mode: 'json' }).$type<string[]>(),
  deliverables: text('deliverables', { mode: 'json' }).$type<{ name: string; count: number }[]>(),
  sessionsPerMonth: integer('sessions_per_month').default(0),
  responseSla: text('response_sla'),
  isPopular: integer('is_popular', { mode: 'boolean' }).default(false),
  active: integer('active', { mode: 'boolean' }).default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Subscriptions
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  planId: text('plan_id').notNull().references(() => plans.id),
  status: text('status', { enum: ['active', 'cancelled', 'past_due', 'trialing'] }).notNull().default('active'),
  currentPeriodStart: integer('current_period_start', { mode: 'timestamp' }),
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Add-on services
export const addons = sqliteTable('addons', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category', { enum: ['social', 'spotify', 'branding', 'pr', 'ads', 'content', 'strategy'] }).notNull(),
  description: text('description'),
  price: real('price').notNull(),
  deliveryDays: integer('delivery_days').notNull(),
  scope: text('scope', { mode: 'json' }).$type<string[]>(),
  requirements: text('requirements', { mode: 'json' }).$type<string[]>(),
  active: integer('active', { mode: 'boolean' }).default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Addon purchases
export const purchases = sqliteTable('purchases', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  addonId: text('addon_id').notNull().references(() => addons.id),
  projectId: text('project_id').references(() => projects.id),
  amount: real('amount').notNull(),
  status: text('status', { enum: ['pending', 'completed', 'refunded'] }).notNull().default('completed'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Projects
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type', { enum: ['subscription', 'addon', 'custom'] }).notNull(),
  status: text('status', { enum: ['active', 'completed', 'on_hold', 'cancelled'] }).notNull().default('active'),
  progress: integer('progress').default(0),
  startDate: integer('start_date', { mode: 'timestamp' }),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Deliverables
export const deliverables = sqliteTable('deliverables', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['not_started', 'in_progress', 'review', 'revision', 'approved', 'cancelled'] }).notNull().default('not_started'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  assignedTo: text('assigned_to').references(() => users.id),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Deliverable comments
export const deliverableComments = sqliteTable('deliverable_comments', {
  id: text('id').primaryKey(),
  deliverableId: text('deliverable_id').notNull().references(() => deliverables.id),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  isInternal: integer('is_internal', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Attachments
export const attachments = sqliteTable('attachments', {
  id: text('id').primaryKey(),
  deliverableId: text('deliverable_id').references(() => deliverables.id),
  projectId: text('project_id').references(() => projects.id),
  name: text('name').notNull(),
  url: text('url').notNull(),
  type: text('type'),
  size: integer('size'),
  uploadedBy: text('uploaded_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Bookings / Sessions
export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  sessionType: text('session_type', { enum: ['strategy', 'content_planning', 'branding_workshop', 'review', 'onboarding'] }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  startAt: integer('start_at', { mode: 'timestamp' }).notNull(),
  endAt: integer('end_at', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['scheduled', 'completed', 'cancelled', 'no_show'] }).notNull().default('scheduled'),
  meetingUrl: text('meeting_url'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Messages (project chat)
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  attachmentUrl: text('attachment_url'),
  readAt: integer('read_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Notifications
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['deliverable', 'message', 'booking', 'project', 'system'] }).notNull(),
  title: text('title').notNull(),
  content: text('content'),
  linkUrl: text('link_url'),
  readAt: integer('read_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Sessions table for auth
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Insights / Metrics (for charts)
export const metrics = sqliteTable('metrics', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['content_cadence', 'campaign_progress', 'completion_rate', 'engagement'] }).notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  value: real('value').notNull(),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Goals
export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  type: text('type', { enum: ['posts_per_week', 'deliverables_per_month', 'sessions_per_month', 'custom'] }).notNull(),
  target: integer('target').notNull(),
  current: integer('current').default(0),
  period: text('period', { enum: ['weekly', 'monthly', 'quarterly'] }).notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})

// Activity log
export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  type: text('type').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  meta: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
})
