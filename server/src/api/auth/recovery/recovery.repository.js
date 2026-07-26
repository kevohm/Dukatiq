import { eq } from 'drizzle-orm'
import argon2 from 'argon2'

import { db } from '../../../config/database.js'

import { userLocalAccess } from '../../../db/user/recovery/user-local-access.js'
import { userRecoveryQuestions } from '../../../db/user/recovery/question.recovery.js'

export const hashPassword = async (password) => {
    return argon2.hash(password)
}

export class RecoveryRepository {
    static async addLocalPassword(client = db, { password, userId }) {
        const localPassword = await hashPassword(password)

        const rows = await client.select().from(userLocalAccess).where(eq(userLocalAccess.user_id, userId)).limit(1)
        const existing = rows?.[0]
        if (existing) {
            await client
                .update(userLocalAccess)
                .set({
                    local_password: localPassword,
                    updated_at: new Date(),
                })
                .where(eq(userLocalAccess.id, existing.id))

            return existing
        }

        const [localAccess] = await client
            .insert(userLocalAccess)
            .values({
                user_id: userId,
                local_password: localPassword,
            })
            .returning({
                id: userLocalAccess.id,
            })

        return localAccess
    }

    static async findRecoveryQuestionsByLocalAccess(
        client = db,
        localAccessId
    ) {
        return client
            .select()
            .from(userRecoveryQuestions)
            .where(
                eq(userRecoveryQuestions.user_local_access_id, localAccessId)
            )
    }

    static async bulkAddRecoveryQuestions(
        client = db,
        { recoveryQuestions = [], localAccessId }
    ) {
        await client
            .delete(userRecoveryQuestions)
            .where(
                eq(userRecoveryQuestions.user_local_access_id, localAccessId)
            )

        const questions = await Promise.all(
            recoveryQuestions.map(async (item) => ({
                user_local_access_id: localAccessId,
                question: item.question,
                question_code: item.code,
                answer: await hashPassword(item.answer),
            }))
        )

        await client.insert(userRecoveryQuestions).values(questions)

        return this.findRecoveryQuestionsByLocalAccess(client, localAccessId)
    }
}
