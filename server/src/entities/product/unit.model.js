import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const Unit = new EntitySchema({
    name: 'Unit',
    tableName: 'unit',

    columns: {
        ...baseColumns,
        name: {
            type: String,
        },
    },

    relations: {
        productUnits: {
            type: 'one-to-many',
            target: 'ProductUnit',
            inverseSide: 'unit',
        },
    },
})
