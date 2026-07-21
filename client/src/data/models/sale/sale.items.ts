import { baseProperties, idSchema, type BaseDoc } from '../base'

export interface SaleItemDoc extends BaseDoc {
    id: string
    normalized_quantity: number
    quantity: number
    product_id: string
    unit_id: string
    sale_id: string
    // generated
    selling_price: number
    cost_price: number
    profit: number
    created_at: string
    updated_at: string
}

export const saleItems = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,

            quantity: {
                type: 'number',
            },
            normalized_quantity: {
                type: 'number',
            },

            selling_price: {
                type: 'number',
            },

            cost_price: {
                type: 'number',
            },

            profit: {
                type: 'number',
            },

            sale_id: idSchema,

            product_id: idSchema,

            unit_id: idSchema,
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'quantity',
            'selling_price',
            'cost_price',
            'profit',
            'sale_id',
            'product_id',
        ],

        indexes: ['sale_id', 'product_id'],
    },
}
