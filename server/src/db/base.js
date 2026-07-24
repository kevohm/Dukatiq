import { boolean, timestamp, uuid } from 'drizzle-orm/pg-core'

const id = () => uuid('id').defaultRandom().primaryKey()
export const audit = {
    id: id(),
    created_at: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    is_deleted: boolean().default(false)
}
