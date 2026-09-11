import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core'
import { audit } from '../../base.js'
import { users } from '../user.js'

export const recoveryQuestions = pgTable('recovery_question', {
    ...audit,

    user_id: uuid('user_id')
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
        }),

    question: varchar('question').notNull(),
    question_code: varchar('question_code').notNull(),

    answer: varchar('answer').notNull(),
})
