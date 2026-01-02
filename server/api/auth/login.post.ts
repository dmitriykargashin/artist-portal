import { z } from 'zod'
import { db, users } from '../../db'
import { eq } from 'drizzle-orm'
import { createSession } from '../../utils/auth'

const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  passcode: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error?.issues[0]?.message ?? 'Validation failed'
    })
  }

  const { userId, passcode } = result.data

  // Optional: Verify demo passcode
  if (passcode && passcode !== 'DEMO2026') {
    throw createError({
      statusCode: 401,
      message: 'Invalid passcode'
    })
  }

  // Find user
  const user = db.select()
    .from(users)
    .where(eq(users.id, userId))
    .get()

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  // Create session
  await createSession(userId, event)

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role
    }
  }
})
