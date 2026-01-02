import { db, plans } from '../db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const allPlans = await db.select()
    .from(plans)
    .where(eq(plans.active, true))
    .orderBy(plans.sortOrder)
    .all()

  return {
    success: true,
    plans: allPlans.map(plan => ({
      ...plan,
      features: parseJsonField(plan.features),
      deliverables: parseJsonField(plan.deliverables)
    }))
  }
})
