import { baseProperties, idSchema, type BaseDoc } from '../base'

export interface ProductUnitDoc extends BaseDoc {
    id: string
    conversion_factor: number
    is_base_unit: boolean
    product_id: string
    unit_id: string
}

export const productUnits = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,

            conversion_factor: {
                type: 'number',
            },

            is_base_unit: {
                type: 'boolean',
            },

            product_id: idSchema,

            unit_id: idSchema,
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'conversion_factor',
            'is_base_unit',
            'product_id',
            'unit_id',
        ],

        indexes: ['product_id', 'unit_id'],
    },
}
