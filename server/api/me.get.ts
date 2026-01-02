import { getCurrentUser } from '../utils/auth'
import { db, artistProfiles, subscriptions, plans } from '../db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  
  if (!user) {
    return {
      success: true,
      user: null
    }
  }

  // Get additional data based on role
  let profile = null
  let subscription = null

  if (user.role === 'artist') {
    profile = await db.select()
      .from(artistProfiles)
      .where(eq(artistProfiles.userId, user.id))
      .get()

    const sub = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .get()

    if (sub?.planId) {
      const plan = await db.select()
        .from(plans)
        .where(eq(plans.id, sub.planId))
        .get()
      
      subscription = {
        ...sub,
        plan
      }
    }
  }

  return {
    success: true,
    user: {
      ...user,
      profile,
      subscription
    }
  }
})
