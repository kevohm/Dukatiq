import { baseProperties, type BaseDoc } from '../base'

export interface SaleDoc extends BaseDoc {
    id: string
    total_amount: number
    total_profit: number
    payment_method: string
}

export const sales = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,

            total_amount: {
                type: 'number',
            },

            total_profit: {
                type: 'number',
            },

            payment_method: {
                type: 'string',
            },
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'total_amount',
            'total_profit',
            'payment_method',
        ],
    },
}
