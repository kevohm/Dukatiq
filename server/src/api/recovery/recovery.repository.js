import { eq } from 'drizzle-orm'
import argon2 from 'argon2'

import { db } from '../../config/database.js'
import { recoveryQuestions } from '../../db/schema.js'
import { hashPassword } from '../../utils/auth/password.js'
import z from 'zod'
import { RecoveryValidator } from './recovery.validator.js'

export class RecoveryRepository {
    static async findByUser(client = db, userId) {
        return client
            .select()
            .from(recoveryQuestions)
            .where(eq(recoveryQuestions.user_id, userId))
    }

    static async bulkAdd(client = db, data) {
        await client
            .delete(recoveryQuestions)
            .where(eq(recoveryQuestions.user_id, data.user_id))

        const payload = await Promise.all(
            data?.questions.map(async (item) => ({
                user_id: data?.user_id,
                question: item.question,
                question_code: item.code,
                answer: await hashPassword(item.answer),
            }))
        )

        await client.insert(recoveryQuestions).values(payload)

        return this.findByUser(client, data?.user_id)
    }
}
