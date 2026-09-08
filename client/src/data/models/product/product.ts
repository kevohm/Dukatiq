import { baseProperties, idSchema, type BaseDoc } from '../base'

export interface ProductDoc extends BaseDoc {
    id: string
    name: string
    category_id: string
    brand_id: string
    cost_price: number
    selling_price: number
    stock_quantity: number
    low_stock_threshold: number
    image_url: string | null
    image_key: string | null
}


export type ProductQuery = {
    search?: string
    category_id?: string
    brand_id?: string
    limit?: number
    page?: number
}

export const products = {
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

            brand_id: idSchema,

            cost_price: {
                type: 'number',
            },

            selling_price: {
                type: 'number',
            },

            stock_quantity: {
                type: 'number',
                default: 0,
            },

            low_stock_threshold: {
                type: 'number',
                default: 10,
            },

            image_url: {
                type: ['string', 'null'],
            },

            image_key: {
                type: ['string', 'null'],
            },
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'name',
            'cost_price',
            'selling_price',
            'stock_quantity',
            'low_stock_threshold',
            'category_id',
            'brand_id',
        ],

        indexes: ['name', 'category_id', 'brand_id'],
    },
}
