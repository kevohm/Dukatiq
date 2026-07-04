import { StatusCodes } from 'http-status-codes'

export const validateDataAndReturn = async (schema, body) => {
    if (!schema || !body) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: 'Please provide required args',
        }
    }
    const parsedData = await schema.safeParseAsync(body)
    if (!parsedData?.success) {
        return {
            status: StatusCodes.BAD_REQUEST,
            success: false,
            message:
                parsedData?.error?.issues[0]?.message ?? 'Validation error',
        }
    }
    return {
        status: StatusCodes.OK,
        success: true,
        data: parsedData?.data,
        message: 'Validation error',
    }
}
