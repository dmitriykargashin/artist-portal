import { db, goals } from '../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const allGoals = db.select()
    .from(goals)
    .where(eq(goals.userId, user.id))
    .all()

  return {
    success: true,
    goals: allGoals
  }
})
