import { AxiosError, isAxiosError } from 'axios'

export interface ApiError {
    message: string
    status?: number
    errors?: Record<string, string>
}

export type ErrorResponse = AxiosError<ApiError>

export function parseError(error: unknown, isOffline: boolean): ApiError {
    if (isAxiosError(error)) {
        console.error({
            message: error.response?.data?.message ?? error.message,
            status: error.response?.status,
            errors: error.response?.data?.errors,
        })
        const message = isOffline
            ? 'You seem to be offline'
            : (error.response?.data?.message ?? error.message)

        return {
            message: message ?? 'An unexpected error occurred.',
            status: error.response?.status,
            errors: error.response?.data?.errors,
        }
    }

    if (error instanceof Error) {
        return {
            message: error.message,
        }
    }

    return {
        message: 'An unexpected error occurred.',
    }
}
