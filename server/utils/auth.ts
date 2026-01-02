import { db, sessions, users } from '../db'
import { eq, and, gt } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import type { EventHandlerRequest, H3Event } from 'h3'

type AppEvent = H3Event<EventHandlerRequest>

const SESSION_COOKIE_NAME = 'artist-portal-session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession(userId: string, event: AppEvent) {
  const sessionId = randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  // Store session in database
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    createdAt: new Date()
  }).run()

  // Set cookie using Nuxt/Nitro setCookie
  setCookie(event, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/'
  })

  return sessionId
}

export async function getAppSession(event: AppEvent) {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)
  if (!sessionId) return null

  // Get session from database
  const session = await db.select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, sessionId),
        gt(sessions.expiresAt, new Date())
      )
    )
    .get()

  if (!session) {
    deleteCookie(event, SESSION_COOKIE_NAME)
    return null
  }

  return session
}

export async function getCurrentUser(event: AppEvent) {
  const session = await getAppSession(event)
  if (!session) return null

  const user = await db.select()
    .from(users)
    .where(eq(users.id, session.userId))
    .get()

  return user || null
}

export async function destroySession(event: AppEvent) {
  const sessionId = getCookie(event, SESSION_COOKIE_NAME)
  
  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId)).run()
  }
  
  deleteCookie(event, SESSION_COOKIE_NAME)
}

export async function requireAuth(event: AppEvent) {
  const user = await getCurrentUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  return user
}

export async function requireAdmin(event: AppEvent) {
  const user = await requireAuth(event)
  
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Admin access required'
    })
  }

  return user
}
