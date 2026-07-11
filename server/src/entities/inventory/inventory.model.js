import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const Inventory = new EntitySchema({
    name: 'Inventory',
    tableName: 'inventory',

    columns: {
        ...baseColumns,

        type: {
            type: 'varchar',
        },

        quantity: {
            type: 'float',
        },

        normalized_quantity: {
            type: 'float',
        },

        adjustment_type: {
            type: 'varchar',
            nullable: true,
        },

        reference_type: {
            type: 'varchar',
            nullable: true,
        },

        reference_id: {
            type: 'uuid',
            nullable: true,
        },
    },

    relations: {
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
