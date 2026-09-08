import { baseProperties, idSchema, type BaseDoc } from '../../base'

export interface VariantAttributeValueDoc extends BaseDoc {
    id: string
    variant_id: string
    attribute_value_id:string
}

export const variantAttributeValue = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,
            variant_id: idSchema,
            attribute_value_id: idSchema,
        },

        required: [
            'id',
            'created_at',
            'updated_at',
            'variant_id',
            'attribute_value_id',
        ],

        indexes: ['variant_id', 'attribute_value_id'],
    },
}
