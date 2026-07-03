import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import { s3 } from '../../config/b2.js'
import { config } from '../../config/env.config.js'
import { StatusCodes } from 'http-status-codes'
import { success } from 'zod'
import { FileValidator } from './file.validator.js'
import { generateFileKey } from '../../utils/file/index.js'

export class FileService {
    static async upload(body) {
        if(!body.file){
              return {
                  status: StatusCodes.BAD_REQUEST,
                  success: false,
                  message: 'No file provided',
              }
        }
        const data = await FileValidator.uploadSchema.safeParseAsync(body)
        if (!data.success) {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: 'Invalid file upload',
            }
        }
        const { file, folder } = data.data
        if (file?.buffer?.length === 0) {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: 'Empty file buffer',
            }
        }

        const key = generateFileKey(folder, file?.originalname)
     
        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.B2_BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentLength: file.buffer.length,
            })
        )
        const response = await FileService.getSignedFileUrl({key})

        if (!response.success) {
            return response
        }

        return {
            status: StatusCodes.CREATED,
            success: true,
            message: 'file uploaded',
            data: {
                ...response.data,
                key,
            },
        }
    }
    static async deleteFile(body) {
        const parsedData = await FileValidator.deleteSchema.safeParseAsync(body)
        if (!parsedData.success) {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: 'key is required',
            }
        }

        const {key} = parsedData.data

        const data = await s3.send(
            new DeleteObjectCommand({
                Bucket: config.b2.bucket,
                Key: key,
            })
        )

        return {
            status: StatusCodes.NO_CONTENT,
            success: true,
            message: 'File deleted',
            data,
        }
    }

    static async getSignedFileUrl(body) {
        const data = await FileValidator.signedUrlSchema.safeParseAsync(body)
        if (!data.success) {
            return {
                status: StatusCodes.BAD_REQUEST,
                success: false,
                message: 'key is required',
            }
        }
        const {key, expiresIn} = data.data

        const command = new GetObjectCommand({
            Bucket: config.b2.bucket,
            Key: key,
        })

        const signedUrl = await getSignedUrl(s3, command, {
            expiresIn, // seconds (default 1 hour)
        })

        return {
            status: StatusCodes.OK,
            success: true,
            message: 'Url generated',
            data: { url: signedUrl, expires_in: expiresIn },
        }
    }
}
