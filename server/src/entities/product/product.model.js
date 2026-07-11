import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const Product = new EntitySchema({
    name: 'Product',
    tableName: 'product',

    columns: {
        ...baseColumns,
        name: {
            type: String,
        },

        cost_price: {
            type: 'float',
        },

        selling_price: {
            type: 'float',
        },

        stock_quantity: {
            type: Number,
            default: 0,
        },

        low_stock_threshold: {
            type: Number,
            default: 5,
        },

        image_url: {
            type: String,
            nullable: true,
        },

        image_key: {
            type: String,
            nullable: true,
        },
    },

    relations: {
        category: {
            type: 'many-to-one',
            target: 'Category',
            joinColumn: {
                name: 'category_id',
            },
            nullable: true,
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },

        brand: {
            type: 'many-to-one',
            target: 'Brand',
            joinColumn: {
                name: 'brand_id',
            },
            nullable: true,
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },

        productUnits: {
            type: 'one-to-many',
            target: 'ProductUnit',
            inverseSide: 'product',
        
        },
    },
})
