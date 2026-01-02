import { db, users } from '../../db'

export default defineEventHandler(async () => {
  // Get all demo users for the auth selection screen
  const demoUsers = db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    avatarUrl: users.avatarUrl,
    role: users.role
  })
    .from(users)
    .all()

  return {
    success: true,
    users: demoUsers
  }
})
