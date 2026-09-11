import { baseProperties, idSchema, type BaseDoc } from '../../base'

export interface ProductVariantDoc extends BaseDoc {
    id: string

    product_id: string
    cost_price: number
    selling_price: number
    stock_quantity?: number
    sku?:string
    low_stock_threshold?: number
    image_url?: string | null
    image_key?: string | null
    attributes: Record<string, string[]>
    
}

export const productVariants = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,
            product_id: idSchema,

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
            attributes: {
                type: ['object'],
                default: {},
            },
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'cost_price',
            'selling_price',
            'attributes',
            'product_id',
        ],

        indexes: ['product_id'],
    },
}
