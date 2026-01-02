import { createClient, type Client } from '@libsql/client'
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql'
import * as schema from './schema'

// Lazy initialization to ensure env vars are loaded
let client: Client | null = null
let _db: LibSQLDatabase<typeof schema> | null = null

function getClient(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || 'file:server/db/dev.sqlite',
      authToken: process.env.TURSO_AUTH_TOKEN
    })
  }
  return client
}

export const db = new Proxy({} as LibSQLDatabase<typeof schema>, {
  get(_, prop) {
    if (!_db) {
      _db = drizzle(getClient(), { schema })
    }
    return (_db as any)[prop]
  }
})

export * from './schema'
