import { baseProperties, idSchema, type BaseDoc } from '../base'



export interface LocalAccessDoc extends BaseDoc {
    id: string
    user_id: string
    password: string // Stored Base64 Hash
    salt: string // Stored Base64 Salt
    iterations: number // Stored Iteration count
}

export const localAccess = {
    schema: {
        version: 0,
        primaryKey: 'id',
        type: 'object',

        properties: {
            ...baseProperties,

            user_id: idSchema,

            password: {
                type: 'string',
            },
            salt: {
                type: 'string',
            },

            iterations: {
                type: 'number',
            },

        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'user_id',
            'password',
            'salt',
            'iterations',
        ],

        indexes: ['user_id'],
    },
}
