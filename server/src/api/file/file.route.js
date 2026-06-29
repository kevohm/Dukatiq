import express from 'express'
import * as fileController from './file.controller.js'
import { createUploadMiddleware } from '../../middleware/image.middleware.js'

const router = express.Router()

router.post(
    '/upload',
    createUploadMiddleware({
        type: 'single',
        fieldName: 'file',
    }),
    fileController.uploadSingleFile
)

router.delete('/delete', fileController.deleteSingleFile)

router.get('/url', fileController.getFileUrl)

export default router
