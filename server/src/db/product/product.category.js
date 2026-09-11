import { pgTable, varchar } from "drizzle-orm/pg-core";
import { audit } from '../base.js'

export const productCategories = pgTable('product_category', {
    ...audit,
    name: varchar('name').notNull().unique(),
})
