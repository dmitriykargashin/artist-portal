import { db, projects, deliverables, messages, attachments, users } from '../../db'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const projectId = getRouterParam(event, 'id')

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  const project = await db.select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .get()

  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found'
    })
  }

  // Check access
  if (project.userId !== user.id && user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Access denied'
    })
  }

  // Get deliverables
  const projectDeliverables = await db.select()
    .from(deliverables)
    .where(eq(deliverables.projectId, projectId))
    .orderBy(deliverables.sortOrder)
    .all()

  // Get messages
  const projectMessages = await db.select({
    id: messages.id,
    content: messages.content,
    attachmentUrl: messages.attachmentUrl,
    createdAt: messages.createdAt,
    authorId: messages.authorId,
    authorName: users.name,
    authorAvatar: users.avatarUrl,
    authorRole: users.role
  })
    .from(messages)
    .leftJoin(users, eq(messages.authorId, users.id))
    .where(eq(messages.projectId, projectId))
    .orderBy(messages.createdAt)
    .all()

  // Get attachments
  const projectAttachments = await db.select()
    .from(attachments)
    .where(eq(attachments.projectId, projectId))
    .orderBy(desc(attachments.createdAt))
    .all()

  return {
    success: true,
    project: {
      ...project,
      meta: project.meta ?? {},
      deliverables: projectDeliverables.map(d => ({
        ...d,
        meta: d.meta ?? {}
      })),
      messages: projectMessages,
      attachments: projectAttachments
    }
  }
})
