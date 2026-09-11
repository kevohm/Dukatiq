
export const idSchema = {
    type: 'string',
    maxLength: 36,

}

export const optionalIdSchema = {
    type: ['string', 'null'],
    maxLength: 36,
    default: null,
}

export const idForeignSchema = {
    type: 'string',
    maxLength: 36,
}



export interface BaseDoc {
    id: string
    created_at:string
    updated_at:string
}

export const baseProperties = {
    id: idSchema,
    created_at: {
        type: 'string',
        format: 'date-time',
        maxLength: 35,
    },

    updated_at: {
        type: 'string',
        format: 'date-time',
        maxLength: 35,
    },
    is_deleted: {
        type: 'boolean',
        default: false,
    },
}

