import { boolean, pgTable, varchar } from 'drizzle-orm/pg-core'
import { audit } from '../base.js'

export const users = pgTable('user', {
    ...audit,
    first_name: varchar('first_name').notNull(),
    last_name: varchar('last_name').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    has_local_access: boolean('has_local_access').default(false),
})
