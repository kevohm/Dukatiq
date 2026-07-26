import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core'
import { audit } from '../../base.js'
import { users } from '../user.js'
import { userLocalAccess } from './user-local-access.js'

export const userRecoveryQuestions = pgTable('user_recovery_question', {
    ...audit,

    user_local_access_id: uuid('user_local_access_id')
        .notNull()
        .references(() => userLocalAccess.id, {
            onDelete: 'cascade',
        }),

    question: varchar('question').notNull(),
    question_code: varchar('question_code').notNull(),

    answer: varchar('answer').notNull(),
})
