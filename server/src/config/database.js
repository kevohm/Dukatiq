import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../db/schema.js'
import { config } from './env.config.js'

const connectionString = config.db.url
if (!connectionString) throw new Error(`Missing required ${'DATABASE_URL'}`)

export const pool = new Pool({ connectionString, ssl: config.env.isProd ? { rejectUnauthorized: false } : undefined })

export const db = drizzle({ client: pool, schema })

export const closeDatabase = () => pool.end()
