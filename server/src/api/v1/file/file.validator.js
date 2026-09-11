import { z } from 'zod'
import { paginationSchema } from '../base.validator.js'
import { config } from '../../../config/env.config.js'

export class FileValidator {
    // =========================
    // BASE FILE METADATA
    // =========================
    static baseSchema = z.object({
        key: z.string().min(1, 'File key is required'),
        originalName: z
            .string()
            .min(1, 'Original file name is required')
            .optional(),
        mimeType: z.string().min(1, 'Mime type is required').optional(),
        size: z
            .number()
            .positive('File size must be greater than 0')
            .optional(),
        url: z.string().url('Invalid file URL').optional(),
    })

    // =========================
    // UPLOAD
    // (file comes from multer, but metadata validated separately)
    // =========================
    static uploadSchema = z.object({
        file: z.any({
            required_error: 'File is required',
        }),
        folder: z.string().default(config.b2.defaultFolder),
    })

    // =========================
    // DELETE FILE
    // =========================
    static deleteSchema = this.baseSchema.pick({ key: true })
    // =========================
    // GET SIGNED URL
    // =========================
    static signedUrlSchema = this.baseSchema.pick({ key: true }).extend({
        expiresIn: z.coerce
            .number()
            .positive()
            .default(config.b2.signedUrl.expiresIn),
    })

    // =========================
    // FILTER / LIST FILES
    // =========================
    static filterSchema = paginationSchema.extend({
        key: z.string().optional(),
        mimeType: z.string().optional(),
        sort_by: z.enum(['key', 'createdAt', 'size']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
    })
}
