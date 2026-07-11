import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const ProductCategory = new EntitySchema({
    name: 'Category',
    tableName: 'product_category',

    columns: {
        ...baseColumns,

        name: {
            type: String,
            unique: true,
        },
    },

    relations: {
        products: {
            type: 'one-to-many',
            target: 'Product',
            inverseSide: 'category',
        },
    },
})
