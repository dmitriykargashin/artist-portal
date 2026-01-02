import { db, notifications } from '../db'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const unreadOnly = query.unread === 'true'

  let allNotifications = await db.select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .all()

  // Filter unread only
  if (unreadOnly) {
    allNotifications = allNotifications.filter(n => !n.readAt)
  }

  return {
    success: true,
    notifications: allNotifications
  }
})
