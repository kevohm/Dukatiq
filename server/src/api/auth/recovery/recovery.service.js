import { StatusCodes } from 'http-status-codes'

import { db } from '../../../config/database.js'

import { RecoveryRepository } from './recovery.repository.js'
import { RecoverySerializer } from './recovery.serializer.js'
import { RecoveryValidator } from './recovery.validator.js'

export class RecoveryService {
    static async setLocalAccess(userId, body, client = db) {
        const data = await RecoveryValidator.baseSchema.parseAsync(body)

        return client.transaction(async (tx) => {
            const localAccess = await RecoveryRepository.addLocalPassword(
                tx,
                {
                    password: data.password,
                    userId,
                }
            )

            const questions = await RecoveryRepository.bulkAddRecoveryQuestions(
                tx,
                {
                    localAccessId:localAccess?.id,
                    recoveryQuestions: data.recoveryQuestions,
                }
            )

            return {
                status: StatusCodes.CREATED,
                success: true,
                data: RecoverySerializer.baseSerializer({
                    ...localAccess,
                    questions,
                }),
                message: 'Local access configured successfully',
            }
        })
    }
}
