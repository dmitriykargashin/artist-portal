import { db, addons } from '../db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string | undefined

  const queryBuilder = db.select().from(addons).where(eq(addons.active, true))

  const allAddons = await queryBuilder.orderBy(addons.sortOrder).all()

  // Filter by category if provided
  const filteredAddons = category
    ? allAddons.filter(a => a.category === category)
    : allAddons

  return {
    success: true,
    addons: filteredAddons.map(addon => ({
      ...addon,
      scope: parseJsonField(addon.scope),
      requirements: parseJsonField(addon.requirements)
    }))
  }
})
