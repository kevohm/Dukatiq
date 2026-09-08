import { baseProperties, type BaseDoc } from '../../base'

export interface AttributeDoc extends BaseDoc {
    id: string
    name: string
}

export const attribute = {
    schema: {
        version: 0,

        primaryKey: 'id',

        type: 'object',

        properties: {
            ...baseProperties,

            name: {
                type: 'string',
                maxLength: 100,
            },
        },

        required: ['id', 'created_at', 'updated_at', 'name'],

        indexes: ['name'],
    },
}
