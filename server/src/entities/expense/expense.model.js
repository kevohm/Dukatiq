import { EntitySchema } from 'typeorm'
import {baseColumns} from "../base.model.js"
export const Expense = new EntitySchema({
    name: 'Expense',
    tableName: 'expense',

    columns: {
        ...baseColumns,

        name: {
            type: String,
        },

        amount: {
            type: 'float',
        },
    },

    relations: {
        category: {
            type: 'many-to-one',
            target: 'ExpenseCategory',
            joinColumn: {
                name: 'category_id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    },
})
