import { z } from 'zod'
import { db, bookings, activities } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'
import { randomUUID } from 'crypto'

const updateBookingSchema = z.object({
  status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']).optional(),
  startAt: z.string().transform(s => new Date(s)).optional(),
  endAt: z.string().transform(s => new Date(s)).optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const bookingId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!bookingId) {
    throw createError({
      statusCode: 400,
      message: 'Booking ID is required'
    })
  }

  const result = updateBookingSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error?.issues[0]?.message ?? 'Validation failed'
    })
  }

  // Verify booking exists and belongs to user
  const booking = await db.select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .get()

  if (!booking) {
    throw createError({
      statusCode: 404,
      message: 'Booking not found'
    })
  }

  if (booking.userId !== user.id && user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Access denied'
    })
  }

  const { status, startAt, endAt, notes } = result.data
  const now = new Date()

  // Build update object
  const updates: Record<string, any> = {}
  if (status) updates.status = status
  if (startAt) updates.startAt = startAt
  if (endAt) updates.endAt = endAt
  if (notes !== undefined) updates.notes = notes

  db.update(bookings)
    .set(updates)
    .where(eq(bookings.id, bookingId))
    .run()

  // Log activity
  db.insert(activities).values({
    id: randomUUID(),
    userId: user.id,
    type: 'booking',
    action: status === 'cancelled' ? 'cancelled' : 'updated',
    entityType: 'booking',
    entityId: bookingId,
    createdAt: now
  }).run()

  return {
    success: true,
    message: status === 'cancelled' ? 'Booking cancelled' : 'Booking updated'
  }
})
