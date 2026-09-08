import { pgTable, varchar } from "drizzle-orm/pg-core";
import { audit } from '../base.js'


export const expenseCategories = pgTable('expense_category', {
    ...audit,
    name: varchar('name').notNull().unique(),
})
