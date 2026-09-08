import {
    baseProperties,
    idSchema,
    optionalIdSchema,
    type BaseDoc,
} from '../base'

export interface InventoryDoc extends BaseDoc {
    id: string
    type: string
    quantity: number
    normalized_quantity: number

    adjustment_type: string | null
    reference_type: string | null
    reference_id: string | null

    product_id: string
    unit_id: string
}

export const inventory = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,

            type: {
                type: 'string',
                enum: ['stock_in', 'stock_out', 'adjustment'],
            },

            quantity: {
                type: 'number',
            },

            normalized_quantity: {
                type: 'number',
            },

            adjustment_type: {
                type: ['string', 'null'],
                enum: ['increase', 'decrease', null],
            },

            reference_type: {
                type: ['string', 'null'],
                enum: ['sale', 'purchase', 'adjustment', 'transfer', null],
            },

            reference_id: optionalIdSchema,

            product_id: idSchema,

            unit_id: idSchema,
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'type',
            'quantity',
            'normalized_quantity',
            'product_id',
            'unit_id',
        ],

        indexes: ['product_id', 'created_at'],
    },
}
