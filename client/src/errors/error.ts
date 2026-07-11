
import { AxiosError, isAxiosError } from 'axios'

export interface ApiError {
    message: string
    status?: number
    errors?: Record<string, string>
}

export type ErrorResponse = AxiosError<ApiError>

export function parseError(error: unknown): ApiError {
    if (isAxiosError(error)) {
        return {
            message:
                error.response?.data?.message ??
                error.message ??
                'An unexpected error occurred.',
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
