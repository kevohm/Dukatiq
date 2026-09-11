import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '../db/schema.js'
import { config } from './env.config.js'

export const pool = new Pool({
    connectionString: config.db.url,
    ssl: config.env.isProd ? { rejectUnauthorized: false } : undefined,
})

export const db = drizzle({ client: pool, schema })

export const resetDb = async () => {
    await db.transaction(async(tx)=>{
        await tx.delete(schema.users)
        await tx.delete(schema.refreshTokens)

        await tx.delete(schema.expenses)
        await tx.delete(schema.expenseCategories)
        
        await tx.delete(schema.productUnits)
        await tx.delete(schema.products)
        await tx.delete(schema.productCategories)
        await tx.delete(schema.brands)
        await tx.delete(schema.units)

    })

    //    await db.delete(schema.)
}
export const closeDatabase = () => pool.end()
