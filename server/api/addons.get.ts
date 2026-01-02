import { db, addons } from '../db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string | undefined

  const queryBuilder = db.select().from(addons).where(eq(addons.active, true))

  const allAddons = queryBuilder.orderBy(addons.sortOrder).all()

  // Filter by category if provided
  const filteredAddons = category
    ? allAddons.filter(a => a.category === category)
    : allAddons

  return {
    success: true,
    addons: filteredAddons.map(addon => ({
      ...addon,
      scope: addon.scope ? JSON.parse(addon.scope as unknown as string) : [],
      requirements: addon.requirements ? JSON.parse(addon.requirements as unknown as string) : []
    }))
  }
})
