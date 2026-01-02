import { z } from 'zod'
import { db, bookings, activities } from '../../db'
import { requireAuth } from '../../utils/auth'
import { randomUUID } from 'crypto'

const createBookingSchema = z.object({
  sessionType: z.enum(['strategy', 'content_planning', 'branding_workshop', 'review', 'onboarding']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startAt: z.string().transform(s => new Date(s)),
  endAt: z.string().transform(s => new Date(s))
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const result = createBookingSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error?.issues[0]?.message ?? 'Validation failed'
    })
  }

  const { sessionType, title, description, startAt, endAt } = result.data
  const now = new Date()
  const bookingId = randomUUID()

  // Create booking
  db.insert(bookings).values({
    id: bookingId,
    userId: user.id,
    sessionType,
    title,
    description: description || null,
    startAt,
    endAt,
    status: 'scheduled',
    meetingUrl: `https://meet.example.com/artist-portal/${bookingId.slice(0, 8)}`,
    createdAt: now
  }).run()

  // Log activity
  db.insert(activities).values({
    id: randomUUID(),
    userId: user.id,
    type: 'booking',
    action: 'scheduled',
    entityType: 'booking',
    entityId: bookingId,
    createdAt: now
  }).run()

  return {
    success: true,
    message: 'Session booked successfully',
    bookingId
  }
})
