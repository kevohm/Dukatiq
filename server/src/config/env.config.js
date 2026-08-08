import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const nodeEnv = process.env.NODE_ENV ?? 'development'

if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV: ${nodeEnv}`)
}

const fileName = nodeEnv === 'production' ? '.env' : `.env.${nodeEnv}`


dotenv.config({
    path: path.resolve(process.cwd(), fileName),
    override: true,
})

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
    url: requiredEnv('DATABASE_URL'),
    testUrl: env.isTest ? requiredEnv('DATABASE_URL_TEST') : undefined,
}

/**
 * CORS config
 */
const origins = getEnv('CORS_ORIGIN', '*')
    .split(',')
    .map((origin) => origin.trim())

export const corsConfig = {
    origin: origins,
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

export const authConfig = {
    accessToken: {
        secret: requiredEnv('ACCESS_TOKEN_SECRET'),
        duration: requiredEnv('ACCESS_TOKEN_DURATION'),
    },
    refreshToken: {
        duration: getEnv('REFRESH_TOKEN_DURATION', 7),
    },
}

export const b2Config = {
    endpoint: requiredEnv('B2_ENDPOINT'),
    region: requiredEnv('B2_REGION'),
    bucket: requiredEnv('B2_BUCKET_NAME'),

    credentials: {
        accessKeyId: requiredEnv('B2_KEY_ID'),
        secretAccessKey: requiredEnv('B2_APP_KEY'),
    },
    defaultFolder: getEnv('B2_DEFAULT_FOLDER', 'files'),

    signedUrl: {
        expiresIn: Number(getEnv('B2_SIGNED_URL_EXPIRES', 3600)), // seconds
    },
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
    b2: b2Config,
    auth:authConfig,
}
