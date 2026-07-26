
import { defineConfig } from 'drizzle-kit'
import { config } from './src/config/env.config.js'

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schema.js',
    out: './src/migrations',
    dbCredentials: { url: config.db.url},
})
