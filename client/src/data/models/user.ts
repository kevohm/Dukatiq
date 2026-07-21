import { baseProperties, type BaseDoc } from "./base";

export interface UserDoc extends BaseDoc {
    id: string
    first_name: string
    last_name: string
    email: string
    password: string
}

export const users = {
    schema: {
        version: 0,
        primaryKey: 'id',
        type: 'object',

        properties: {
            ...baseProperties,

            first_name: {
                type: 'string',
            },

            last_name: {
                type: 'string',
            },

            email: {
                type: 'string',
                maxLength: 255,
            },

            password: {
                type: 'string',
            },
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'first_name',
            'last_name',
            'email',
            'password',
        ],

        indexes: ['email'],
    },
}