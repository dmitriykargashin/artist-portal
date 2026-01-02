import { db, deliverables, projects } from '../../db'
import { eq, inArray } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const status = query.status as string | undefined
  const projectId = query.projectId as string | undefined

  // Get user's projects first
  const userProjects = await db.select({ id: projects.id })
    .from(projects)
    .where(eq(projects.userId, user.id))
    .all()

  const projectIds = userProjects.map(p => p.id)

  if (projectIds.length === 0) {
    return {
      success: true,
      deliverables: []
    }
  }

  // Get deliverables for user's projects
  let allDeliverables = await db.select({
    id: deliverables.id,
    projectId: deliverables.projectId,
    title: deliverables.title,
    description: deliverables.description,
    status: deliverables.status,
    priority: deliverables.priority,
    dueDate: deliverables.dueDate,
    completedAt: deliverables.completedAt,
    assignedTo: deliverables.assignedTo,
    sortOrder: deliverables.sortOrder,
    createdAt: deliverables.createdAt,
    projectTitle: projects.title
  })
    .from(deliverables)
    .leftJoin(projects, eq(deliverables.projectId, projects.id))
    .where(inArray(deliverables.projectId, projectIds))
    .orderBy(deliverables.dueDate)
    .all()

  // Filter by status
  if (status) {
    allDeliverables = allDeliverables.filter(d => d.status === status)
  }

  // Filter by project
  if (projectId) {
    allDeliverables = allDeliverables.filter(d => d.projectId === projectId)
  }

  return {
    success: true,
    deliverables: allDeliverables
  }
})
