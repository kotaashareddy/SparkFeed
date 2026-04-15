import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const url = process.env.DATABASE_URL || 'file:rss.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

export const client = createClient({ 
  url, 
  authToken 
})

export const db = drizzle(client)