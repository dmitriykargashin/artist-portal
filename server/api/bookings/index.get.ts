import { db, bookings } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const status = query.status as string | undefined
  const upcoming = query.upcoming === 'true'

  let allBookings = db.select()
    .from(bookings)
    .where(eq(bookings.userId, user.id))
    .orderBy(bookings.startAt)
    .all()

  // Filter by status
  if (status) {
    allBookings = allBookings.filter(b => b.status === status)
  }

  // Filter upcoming only
  if (upcoming) {
    const now = new Date()
    allBookings = allBookings.filter(b => new Date(b.startAt) >= now)
  }

  return {
    success: true,
    bookings: allBookings
  }
})
