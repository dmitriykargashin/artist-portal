import { z } from 'zod'
import { db, deliverables, deliverableComments, projects, activities } from '../../db'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'
import { randomUUID } from 'crypto'

const updateSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'review', 'revision', 'approved', 'cancelled']).optional(),
  comment: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const deliverableId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!deliverableId) {
    throw createError({
      statusCode: 400,
      message: 'Deliverable ID is required'
    })
  }

  const result = updateSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error?.issues[0]?.message ?? 'Validation failed'
    })
  }

  const { status, comment } = result.data

  // Get deliverable and verify access
  const deliverable = await db.select()
    .from(deliverables)
    .where(eq(deliverables.id, deliverableId))
    .get()

  if (!deliverable) {
    throw createError({
      statusCode: 404,
      message: 'Deliverable not found'
    })
  }

  // Get project to verify ownership
  const project = await db.select()
    .from(projects)
    .where(eq(projects.id, deliverable.projectId))
    .get()

  if (!project || (project.userId !== user.id && user.role !== 'admin')) {
    throw createError({
      statusCode: 403,
      message: 'Access denied'
    })
  }

  const now = new Date()

  // Update status if provided
  if (status) {
    db.update(deliverables)
      .set({
        status,
        completedAt: status === 'approved' ? now : null
      })
      .where(eq(deliverables.id, deliverableId))
      .run()

    // Log activity
    db.insert(activities).values({
      id: randomUUID(),
      userId: user.id,
      type: 'deliverable',
      action: status === 'approved' ? 'approved' : 'updated',
      entityType: 'deliverable',
      entityId: deliverableId,
      meta: { newStatus: status },
      createdAt: now
    } as any).run()

    // Update project progress
    const projectDeliverables = await db.select()
      .from(deliverables)
      .where(eq(deliverables.projectId, project.id))
      .all()

    const completedCount = projectDeliverables.filter(d => 
      d.id === deliverableId ? status === 'approved' : d.status === 'approved'
    ).length

    const progress = Math.round((completedCount / projectDeliverables.length) * 100)

    await db.update(projects)
      .set({ progress })
      .where(eq(projects.id, project.id))
      .run()
  }

  // Add comment if provided
  if (comment) {
    db.insert(deliverableComments).values({
      id: randomUUID(),
      deliverableId,
      authorId: user.id,
      content: comment,
      isInternal: false,
      createdAt: now
    }).run()
  }

  return {
    success: true,
    message: 'Deliverable updated successfully'
  }
})
