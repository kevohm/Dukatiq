import express from 'express'
import * as recoveryController from './recovery.controller.js'
import { requireAuth } from '../../../middleware/auth.middleware.js'

const router = express.Router()


router.post(
    '/',
    requireAuth,
    recoveryController.addQuestions
)

export default router
