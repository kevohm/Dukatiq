import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export  const Brand = new EntitySchema({
    name: 'Brand',
    tableName: 'product_brand',

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
            inverseSide: 'brand',
        },
    },
})
