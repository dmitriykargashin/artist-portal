import { db, activities, users } from '../db'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 20

  // For artists, show their own activities
  // For admins, show all activities
  let allActivities = db.select({
    id: activities.id,
    type: activities.type,
    action: activities.action,
    entityType: activities.entityType,
    entityId: activities.entityId,
    meta: activities.meta,
    createdAt: activities.createdAt,
    userId: activities.userId,
    userName: users.name,
    userAvatar: users.avatarUrl,
    userRole: users.role
  })
    .from(activities)
    .leftJoin(users, eq(activities.userId, users.id))
    .orderBy(desc(activities.createdAt))
    .limit(limit)
    .all()

  if (user.role !== 'admin') {
    allActivities = allActivities.filter(a => a.userId === user.id)
  }

  return {
    success: true,
    activities: allActivities.map(a => ({
      ...a,
      meta: a.meta ?? {}
    }))
  }
})
