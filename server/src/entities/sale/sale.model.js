import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const Sale =  new EntitySchema({
    name: 'Sale',
    tableName: 'sale',

    columns: {
        ...baseColumns,

        total_amount: {
            type: 'float',
        },

        total_profit: {
            type: 'float',
        },

        payment_method: {
            type: 'varchar',
            default: 'cash',
        },
    },

    relations: {
        items: {
            type: 'one-to-many',
            target: 'SaleItem',
            inverseSide: 'sale',
        },
    },
})
