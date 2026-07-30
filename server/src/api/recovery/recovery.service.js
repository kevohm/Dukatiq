import { StatusCodes } from 'http-status-codes'

import { RecoverySerializer } from './recovery.serializer.js'
import { RecoveryValidator } from './recovery.validator.js'
import { AuthRepository } from '../auth/auth.repository.js'
import { RecoveryRepository } from './recovery.repository.js'
import { db } from '../../config/database.js'

export class RecoveryService {
    static async addQuestions(client = db, body) {
        const data = await RecoveryValidator.baseSchema.parseAsync(body)

        return client.transaction(async (tx) => {
            const questions = await RecoveryRepository.bulkAdd(tx, {
                questions: data.questions,
                user_id: data?.user_id,
            })

            return {
                status: StatusCodes.CREATED,
                success: true,
                data: RecoverySerializer.baseSerializer({
                    questions,
                }),
                message: 'Recovery questions configured successfully',
            }
        })
    }
}
