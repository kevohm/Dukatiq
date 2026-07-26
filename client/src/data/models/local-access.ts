import { baseProperties, idSchema, type BaseDoc } from './base'

export type LocalAccessQuestion = {
    question: string
    code: string
    answer: string
}

export interface LocalAccessDoc extends BaseDoc {
    id: string
    user_id: string
    password: string // Stored Base64 Hash
    salt: string // Stored Base64 Salt
    iterations: number // Stored Iteration count
    questions: LocalAccessQuestion[]
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

            questions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        question: {
                            type: 'string',
                        },

                        code: {
                            type: 'string',
                        },

                        answer: {
                            type: 'string',
                        },
                    },

                    required: ['question', 'code', 'answer'],
                },
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
            'questions',
        ],

        indexes: ['user_id'],
    },
}
