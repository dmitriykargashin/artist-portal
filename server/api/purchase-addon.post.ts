import { z } from 'zod'
import { db, addons, purchases, projects, deliverables, activities } from '../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../utils/auth'
import { randomUUID } from 'crypto'

const purchaseSchema = z.object({
  addonId: z.string().min(1, 'Addon ID is required')
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const result = purchaseSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error?.issues[0]?.message ?? 'Validation failed'
    })
  }

  const { addonId } = result.data

  // Get addon
  const addon = await db.select()
    .from(addons)
    .where(eq(addons.id, addonId))
    .get()

  if (!addon) {
    throw createError({
      statusCode: 404,
      message: 'Add-on not found'
    })
  }

  const now = new Date()
  const dueDate = new Date(now.getTime() + addon.deliveryDays * 24 * 60 * 60 * 1000)

  // Create project for this addon
  const projectId = randomUUID()
  await db.insert(projects).values({
    id: projectId,
    userId: user.id,
    title: addon.name,
    description: addon.description,
    type: 'addon',
    status: 'active',
    progress: 0,
    startDate: now,
    dueDate,
    meta: { addonId: addon.id },
    createdAt: now
  }).run()

  // Create deliverables based on addon scope
  const scope = parseJsonField(addon.scope) as string[]
  for (let i = 0; i < scope.length; i++) {
    const title = scope[i]
    if (!title) continue
    await db.insert(deliverables).values({
      id: randomUUID(),
      projectId,
      title,
      status: 'not_started',
      priority: 'medium',
      dueDate,
      sortOrder: i,
      createdAt: now
    }).run()
  }

  // Record purchase
  await db.insert(purchases).values({
    id: randomUUID(),
    userId: user.id,
    addonId,
    projectId,
    amount: addon.price,
    status: 'completed',
    createdAt: now
  }).run()

  // Log activity
  await db.insert(activities).values({
    id: randomUUID(),
    userId: user.id,
    type: 'purchase',
    action: 'purchased',
    entityType: 'addon',
    entityId: addonId,
    createdAt: now
  }).run()

  return {
    success: true,
    message: `Successfully purchased ${addon.name}`,
    projectId
  }
})
