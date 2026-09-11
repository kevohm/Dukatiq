import express from 'express'
import * as syncController from './sync.controller.js'

const router = express.Router()

router.post('/pull', syncController.pull)
router.post('/push', syncController.push)

export default router
