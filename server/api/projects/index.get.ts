import { db, projects, deliverables } from '../../db'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const query = getQuery(event)
  const status = query.status as string | undefined

  const projectQuery = db.select()
    .from(projects)
    .where(eq(projects.userId, user.id))

  const allProjects = projectQuery.orderBy(desc(projects.createdAt)).all()

  // Filter by status if provided
  const filteredProjects = status
    ? allProjects.filter(p => p.status === status)
    : allProjects

  // Get deliverables count for each project
  const projectsWithMeta = filteredProjects.map(project => {
    const projectDeliverables = db.select()
      .from(deliverables)
      .where(eq(deliverables.projectId, project.id))
      .all()

    const totalDeliverables = projectDeliverables.length
    const completedDeliverables = projectDeliverables.filter(d => d.status === 'approved').length

    return {
      ...project,
      meta: project.meta ?? {},
      totalDeliverables,
      completedDeliverables
    }
  })

  return {
    success: true,
    projects: projectsWithMeta
  }
})
