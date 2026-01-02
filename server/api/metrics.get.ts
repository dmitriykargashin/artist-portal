import { db, metrics } from '../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const type = query.type as string | undefined

  let allMetrics = db.select()
    .from(metrics)
    .where(eq(metrics.userId, user.id))
    .orderBy(metrics.date)
    .all()

  // Filter by type
  if (type) {
    allMetrics = allMetrics.filter(m => m.type === type)
  }

  return {
    success: true,
    metrics: allMetrics.map(m => ({
      ...m,
      meta: m.meta ?? {}
    }))
  }
})
