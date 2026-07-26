import { baseProperties, idSchema, type BaseDoc } from './base'

export interface LocalSessionDoc extends BaseDoc {
    id: string
    user_id: string
    last_verified_at: string
    expires_at: string
}

export const localSessions = {
    schema: {
        version: 0,
        primaryKey: 'id',
        type: 'object',

        properties: {
            ...baseProperties,

            user_id: idSchema,

            last_verified_at: {
                type: 'string',
                format: 'date-time',
            },

            expires_at: {
                type: 'string',
                format: 'date-time',
            },
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'user_id',
            'last_verified_at',
            'expires_at',
        ],

        indexes: ['user_id'],
    },
}
