import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * __dirname equivalent for ES modules
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Environment helpers
 */
const getEnv = (key, fallback = undefined) => {
    const value = process.env[key]
    return value ?? fallback
}

const requiredEnv = (key) => {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
}

/**
 * Core environment flags
 */

const nodeEnv = getEnv('NODE_ENV', 'development')
export const env = {
    isProd: nodeEnv === 'production',
    isDev: nodeEnv === 'development',
    isTest: nodeEnv === 'test',
    nodeEnv,
}

/**
 * Database config
 */
export const dbConfig = {
    path: getEnv('DB_PATH', path.join(__dirname, '../database/shop.sqlite')),
}

/**
 * CORS config
 */
export const corsConfig = {
    origin: getEnv('CORS_ORIGIN', '*'),
    credentials: true,
}

/**
 * Cookie/session config
 */
export const cookieConfig = {
    secret: requiredEnv('COOKIE_SECRET'),
    options: {
        httpOnly: true,
        secure: env.isProd,
        sameSite: env.isProd ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day (fix comment mismatch)
        signed: true,
    },
}

/**
 * Server config
 */
export const serverConfig = {
    port: Number(getEnv('PORT', 5000)),
    name: getEnv(process.env.APP_NAME, 'Dukatiq'),
}

/**
 * Optional: grouped export (best for large apps)
 */
export const config = {
    env,
    db: dbConfig,
    cors: corsConfig,
    cookie: cookieConfig,
    server: serverConfig,
}
