import { db, plans } from '../db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const allPlans = db.select()
    .from(plans)
    .where(eq(plans.active, true))
    .orderBy(plans.sortOrder)
    .all()

  return {
    success: true,
    plans: allPlans.map(plan => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features as unknown as string) : [],
      deliverables: plan.deliverables ? JSON.parse(plan.deliverables as unknown as string) : []
    }))
  }
})
