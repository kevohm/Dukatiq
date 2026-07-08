import { ZodError } from 'zod'
import { logger } from '../config/logger.config.js'
import { StatusCodes } from 'http-status-codes'
import { config } from '../config/env.config.js'
import { AppError } from '../errors/app.error.js'

export function errorHandler(err, req, res, next) {
    if (!config.env.isProd) {
        console.log(
            err instanceof ZodError
                ? `(Zod Error) ${err?.issues[0]?.path} => ${err?.issues[0]?.message}`
                : err
        )
    }

    // if (err instanceof ZodError) {
    //     console.log(err?.issues)
    //     return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    //         success: false,
    //         message: err?.issues[0]?.message ?? 'Validation error',
    //         stack: config.env.isDev ? err.stack : undefined,
    //     })
    // }


if (err instanceof ZodError) {
    const errors = err.issues.reduce((acc, issue) => {
        const field = issue.path.join(".");

        // Keep the first error per field
        if (!acc[field]) {
            acc[field] = issue.message;
        }

        return acc;
    }, {});

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: "Validation error",
        errors,
        stack: config.env.isDev ? err.stack : undefined,
    });
}
    const statusCode =
        err?.statusCode || err?.status || StatusCodes.INTERNAL_SERVER_ERROR
    const message = err?.message || 'Internal Server Error'
    const payload = {
        success: false,
        message,
        stack: config.env.isDev ? err?.stack : undefined,
    }

    if (err instanceof AppError || err?.code) {
        payload.code = err.code
    }

    if (err instanceof AppError || err?.meta) {
        payload.meta = err.meta
    }

    return res.status(statusCode).json(payload)
}
