import { baseProperties, idSchema, type BaseDoc } from '../../base'

export interface AttributeValueDoc extends BaseDoc {
    id: string
    attribute_id: string
    name: string
}

export const attributeValue = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,
            attribute_id: idSchema,
            name: {
                type: 'string',
                maxLength: 100,
            },
        },

        required: ['id', 'created_at', 'updated_at', 'name','attribute_id'],

        indexes: ['name','attribute_id'],
    },
}
