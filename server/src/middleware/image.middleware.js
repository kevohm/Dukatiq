import multer from 'multer'

const storage = multer.memoryStorage()

/**
 * Dynamic upload middleware factory
 * @param {Object} options
 * @param {"single" | "array" | "fields"} options.type
 * @param {string} options.fieldName
 * @param {number} [options.maxCount]
 * @param {Array<{ name: string, maxCount: number }>} [options.fields]
 */
export function createUploadMiddleware({
    type = 'single',
    fieldName = 'file',
    maxCount = 5,
    fields = [],
} = {}) {
    const upload = multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB per file
        },
    })

    switch (type) {
        case 'single':
            return upload.single(fieldName)

        case 'array':
            return upload.array(fieldName, maxCount)

        case 'fields':
            return upload.fields(fields)

        default:
            throw new Error(`Invalid upload type: ${type}`)
    }
}
