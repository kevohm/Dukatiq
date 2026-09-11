import { baseProperties, type BaseDoc } from '../base'

export interface UserDoc extends BaseDoc {
    id: string
    full_name: string
    email: string
    is_active:boolean
}

export const users = {
    schema: {
        version: 0,
        primaryKey: 'id',
        type: 'object',

        properties: {
            ...baseProperties,
            full_name: {
                type: 'string',
            },

            email: {
                type: 'string',
                maxLength: 255,
            },
            is_active: {
                type: 'boolean',
                default: false
            },
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'full_name',
            'email',
        ],

        indexes: ['email'],
    },
}
