import { baseProperties, idSchema, type BaseDoc } from '../base'

export interface ExpenseDoc extends BaseDoc {
    id: string
    name: string
    amount: number
    category_id: string
}

export const expenses = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,

            name: {
                type: 'string',
                maxLength: 255,
            },

            category_id: idSchema,

            amount: {
                type: 'number',
            },
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'name',
            'amount',
            'category_id',
        ],

        indexes: ['name', 'category_id'],
    },
}
