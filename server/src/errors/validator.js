import { StatusCodes } from 'http-status-codes'
import { AppError, ERROR_CODES } from './app.error.js'
import { ZodType } from 'zod'
import { logger } from '../config/logger.config.js'

export const validateData = async ({ schema, body }) => {
    if (schema instanceof ZodType) {
        const { data, error, success } = await schema.safeParseAsync(body)
        if (!success) {
            throw new AppError({
                message: error?.issues[0]?.message ?? 'Validation Error',
                code: ERROR_CODES.VALIDATION.INVALID_DATA_PROVIDED,
                status: StatusCodes.UNPROCESSABLE_ENTITY,
                meta: { resource: error?.issues[0]?.path[0] ?? 'auth' },
            })
        }
        return data
    }
    logger.error('invalid validation schema provided')
    throw new AppError({
        message: 'internal server error',
        code: ERROR_CODES.VALIDATION.INVALID_SCHEMA,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        meta: { resource: error?.issues[0]?.path[0] ?? 'auth' },
    })
}
