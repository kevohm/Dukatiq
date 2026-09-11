import { describe, expect, it, vi } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import { AppError, ERROR_CODES } from '../../../src/errors/app.error.js'
import { errorHandler } from '../../../src/middleware/error.middleware.js'

describe('AppError', () => {
    it('returns structured error details through the error middleware', () => {
        const req = {}
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        }
        const next = vi.fn()

        const error = new AppError({
            message: 'Product not found',
            code: ERROR_CODES.PRODUCT.NOT_FOUND,
            status: StatusCodes.NOT_FOUND,
            meta: { resource: 'product' },
        })

        errorHandler(error, req, res, next)

        expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                message: 'Product not found',
                code: ERROR_CODES.PRODUCT.NOT_FOUND,
                meta: { resource: 'product' },
            })
        )
    })
})
