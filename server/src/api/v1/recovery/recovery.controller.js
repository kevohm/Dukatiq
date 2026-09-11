import { db } from '../../../config/database.js'
import { RecoveryService } from './recovery.service.js'

export const addQuestions = async (req, res) => {
    const response = await db.transaction(async (tx) => {
        const userId = req.user?.id
        return await RecoveryService.addQuestions(tx, {
            ...req.body,
            user_id: userId,
        })
    })

    res.status(response.status).json({
        success: response.success,
        data: response.data,
        message: response.message,
    })
}
