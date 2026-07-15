import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../db/schema.js'
import { config } from './env.config.js'

const connectionString = config.env.isTest ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL
if (!connectionString) throw new Error(`Missing required ${config.env.isTest ? 'DATABASE_URL_TEST' : 'DATABASE_URL'}`)

export const pool = new Pool({ connectionString, ssl: config.env.isProd ? { rejectUnauthorized: false } : undefined })

export const db = drizzle({ client: pool, schema })

export const closeDatabase = () => pool.end()
