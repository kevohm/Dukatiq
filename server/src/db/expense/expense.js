import { doublePrecision, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { audit } from '../base.js'
import { expenseCategories } from "./expense.category.js";


export const expenses = pgTable('expense', {
    ...audit,
    name: varchar('name').notNull(),
    amount: doublePrecision('amount').notNull(),
    category_id: uuid('category_id').references(() => expenseCategories.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})
