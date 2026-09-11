import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '../../../config/b2.js'
import { config } from '../../../config/env.config.js'
import { StatusCodes } from 'http-status-codes'
import { FileValidator } from './file.validator.js'
import { generateFileKey } from '../../../utils/file/index.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class FileService {
    static async upload(body) {
        if (!body.file) {
            throw new AppError({
                message: 'No file provided',
                code: ERROR_CODES.FILE.NO_FILE_PROVIDED,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'file' },
            })
        }
        const data = await FileValidator.uploadSchema.safeParseAsync(body)
        if (!data.success) {
            throw new AppError({
                message: 'Invalid file upload',
                code: ERROR_CODES.FILE.INVALID_UPLOAD,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'file' },
            })
        }
        const { file, folder } = data.data
        if (file?.buffer?.length === 0) {
            throw new AppError({
                message: 'Empty file buffer',
                code: ERROR_CODES.FILE.EMPTY_FILE_BUFFER,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'file' },
            })
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
        const response = await FileService.getSignedFileUrl({ key })

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
            throw new AppError({
                message: 'key is required',
                code: ERROR_CODES.FILE.KEY_REQUIRED,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'file' },
            })
        }

        const { key } = parsedData.data

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
            throw new AppError({
                message: 'key is required',
                code: ERROR_CODES.FILE.KEY_REQUIRED,
                status: StatusCodes.BAD_REQUEST,
                meta: { resource: 'file' },
            })
        }
        const { key, expiresIn } = data.data

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
