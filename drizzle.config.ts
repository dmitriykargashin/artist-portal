import type { Config } from 'drizzle-kit'

export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || 'file:server/db/dev.sqlite',
    authToken: process.env.TURSO_AUTH_TOKEN
  }
} satisfies Config
