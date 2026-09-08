import { StatusCodes } from 'http-status-codes'
import { config } from '../../config/env.config.js'
import { FileService } from './file.service.js'


export async function uploadSingleFile(req, res) {
  
    const response = await FileService.upload({ file: req.file, ...req.body }, 'files')

    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export async function deleteSingleFile(req, res) {
   const response =  await FileService.deleteFile(req.body)
    
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}

export async function getFileUrl(req, res) {
    const response = await FileService.getSignedFileUrl(req.query)
    res.status(response.status).json({
        success: response.success,
        data: response?.data,
        message: response?.message,
    })
}
