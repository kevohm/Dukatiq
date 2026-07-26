import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core'

import { audit } from '../../base.js'
import { users } from '../user.js'

export const userLocalAccess = pgTable('user_local_access', {
    ...audit,

    user_id: uuid('user_id')
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
        }),

    local_password: varchar('local_password').notNull(),
})
