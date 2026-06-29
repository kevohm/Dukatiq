import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import { s3 } from '../../config/b2.js'
import { config } from '../../config/env.config.js'

export class FileService {
    static async upload(file, folder = 'uploads') {
        if (!file || !file.buffer) {
            throw new Error('Invalid file upload')
        }

        if (file.buffer.length === 0) {
            throw new Error('Empty file buffer')
        }

        const key = `${folder}/${crypto.randomUUID()}-${file.originalname}`

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.B2_BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentLength: file.buffer.length,
            })
        )

        return key
    }
    static async deleteFile(key) {
        if (!key) throw new Error('File key is required')

        await s3.send(
            new DeleteObjectCommand({
                Bucket: config.b2.bucket,
                Key: key,
            })
        )

        return true
    }

    static async getSignedFileUrl(key, expiresIn = 3600) {
        if (!key) throw new Error('File key is required')

        const command = new GetObjectCommand({
            Bucket: config.b2.bucket,
            Key: key,
        })

        const signedUrl = await getSignedUrl(s3, command, {
            expiresIn, // seconds (default 1 hour)
        })

        return signedUrl
    }
}
