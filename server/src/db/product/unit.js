import { pgTable, varchar } from "drizzle-orm/pg-core";

import { audit } from '../base.js'

export const units = pgTable('unit', {
    ...audit,
    name: varchar('name').notNull(),
})
