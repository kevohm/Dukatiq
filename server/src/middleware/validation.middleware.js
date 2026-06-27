import { StatusCodes } from "http-status-codes"

export const validate =
    (schemas = {}) =>
    (req, res, next) => {
        try {
            const validated = {}

            const sources = ['body', 'query', 'params']

            const errors = []

            for (const source of sources) {
                const schema = schemas[source]
                if (!schema) continue

                const result = schema.safeParse(req[source])

                if (!result.success) {
                    errors.push(
                        ...result.error.errors.map((err) => ({
                            source,
                            path: err.path.join('.'),
                            message: err.message,
                        }))
                    )
                } else {
                    validated[source] = result.data
                }
            }

            if (errors.length > 0) {
                return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                    success: false,
                    message: 'Validation failed',
                    errors,
                })
            }

            // overwrite request with validated + transformed data
            Object.assign(req, validated)

            next()
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Validation middleware error',
            })
        }
    }
