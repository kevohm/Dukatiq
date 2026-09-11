import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { audit } from '../base.js'


export const syncCheckpoints = pgTable('sync_checkpoint', {
    ...audit,

    collection: varchar('collection').notNull().unique(),

    last_synced_at: timestamp('last_synced_at', {
        withTimezone: true,
    }).notNull(),

    last_synced_id: uuid('last_synced_id'),
})
