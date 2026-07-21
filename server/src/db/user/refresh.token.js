import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { audit } from '../base.js'
import { users } from "./user.js";


export const refreshTokens = pgTable('refresh_token', {
    ...audit,
    token_hash: varchar('token_hash').notNull().unique(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    revoked_at: timestamp('revoked_at', { withTimezone: true }),
    user_agent: varchar('user_agent'),
    ip: varchar('ip'),
    user_id: uuid('user_id').references(() => users.id, {
        onDelete: 'set null',
        onUpdate: 'cascade',
    }),
})