import express from 'express'
import * as authController from './auth.controller.js'
import { requireAuth } from '../../middleware/auth.middleware.js'

const router = express.Router()

router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.post('/logout', authController.logout)
router.get(
    '/me',
    requireAuth,
    authController.me
)

router.post('/refresh', requireAuth, authController.refresh)

export default router
