import { baseProperties, type BaseDoc } from "./base";

export interface UserDoc extends BaseDoc {
    id: string
    full_name: string
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
            full_name: {
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
            'full_name',
            'email',
            'password',
        ],

        indexes: ['email'],
    },
}