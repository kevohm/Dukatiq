import { EntitySchema } from 'typeorm'
import { baseColumns } from '../../base.model.js'

export const SaleItem = new EntitySchema({
    name: 'SaleItem',
    tableName: 'sale_item',

    columns: {
        ...baseColumns,

        quantity: {
            type: 'integer',
        },

        selling_price: {
            type: 'float',
        },

        cost_price: {
            type: 'float',
        },

        profit: {
            type: 'float',
        }
    },

    relations: {
        sale: {
            type: 'many-to-one',
            target: 'Sale',
            joinColumn: {
                name: 'sale_id',
            },
            inverseSide: 'items',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },

        product: {
            type: 'many-to-one',
            target: 'Product',
            joinColumn: {
                name: 'product_id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        unit: {
            type: 'many-to-one',
            target: 'Unit',
            joinColumn: {
                name: 'unit_id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    },
})
