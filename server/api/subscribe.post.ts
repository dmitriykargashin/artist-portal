import { z } from 'zod'
import { db, subscriptions, plans, activities } from '../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../utils/auth'
import { randomUUID } from 'crypto'

const subscribeSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required')
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  const result = subscribeSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error?.issues[0]?.message ?? 'Validation failed'
    })
  }

  const { planId } = result.data

  // Verify plan exists
  const plan = db.select()
    .from(plans)
    .where(eq(plans.id, planId))
    .get()

  if (!plan) {
    throw createError({
      statusCode: 404,
      message: 'Plan not found'
    })
  }

  // Update or create subscription
  const existingSub = db.select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .get()

  const now = new Date()
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  if (existingSub) {
    db.update(subscriptions)
      .set({
        planId,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd
      })
      .where(eq(subscriptions.id, existingSub.id))
      .run()
  } else {
    db.insert(subscriptions).values({
      id: randomUUID(),
      userId: user.id,
      planId,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      createdAt: now
    }).run()
  }

  // Log activity
  db.insert(activities).values({
    id: randomUUID(),
    userId: user.id,
    type: 'subscription',
    action: existingSub ? 'upgraded' : 'subscribed',
    entityType: 'plan',
    entityId: planId,
    createdAt: now
  }).run()

  return {
    success: true,
    message: `Successfully ${existingSub ? 'upgraded to' : 'subscribed to'} ${plan.name} plan`
  }
})
