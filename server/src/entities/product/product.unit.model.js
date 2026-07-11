import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const ProductUnit = new EntitySchema({
    name: 'ProductUnit',
    tableName: 'product_unit',

    columns: {
        ...baseColumns,

        conversion_factor: {
            type: 'float',
        },

        is_base_unit: {
            type: Boolean,
            default: false,
        },
    },

    relations: {
        product: {
            type: 'many-to-one',
            target: 'Product',
            joinColumn: {
                name: 'product_id',
            },
            nullable: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },

        unit: {
            type: 'many-to-one',
            target: 'Unit',
            joinColumn: {
                name: 'unit_id',
            },
            nullable: false,
            onDelete: 'RESTRICT', // or 'NO ACTION'
            onUpdate: 'CASCADE',
        },
    },
})
