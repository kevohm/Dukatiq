import { EntitySchema } from 'typeorm'
import { baseColumns } from '../base.model.js'

export const ExpenseCategory = new EntitySchema({
    name: 'ExpenseCategory',
    tableName: 'expense_category',

    columns: {
        ...baseColumns,

        name: {
            type: String,
            unique: true,
        },
    },

    relations: {
        expenses: {
            type: 'one-to-many',
            target: 'Expense',
            inverseSide: 'category',
        },
    },
})
