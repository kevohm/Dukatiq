import { doublePrecision, pgTable, varchar } from "drizzle-orm/pg-core";
import { audit } from '../base.js'


export const sales = pgTable('sale', {
    ...audit,
    total_amount: doublePrecision('total_amount').notNull(),
    total_profit: doublePrecision('total_profit').notNull(),
    payment_method: varchar('payment_method').default('cash').notNull(),
})
