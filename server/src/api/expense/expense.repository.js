import { eq } from 'drizzle-orm'
import { db } from '../../config/database.js'
import { expenseCategories, expenses } from '../../db/schema.js'
import { ExpenseCategoryRepository } from './category/expense.category.repository.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'

const selectExpense = {
    id: expenses.id,
    created_at: expenses.created_at,
    updated_at: expenses.updated_at,
    name: expenses.name,
    amount: expenses.amount,
    category_id: expenses.category_id,
    category: expenseCategories,
}
export class ExpenseRepository {
    static async getAll() {
        return db
            .select(selectExpense)
            .from(expenses)
            .leftJoin(
                expenseCategories,
                eq(expenses.category_id, expenseCategories.id)
            )
    }
    static async getById(id) {
        const [row] = await db
            .select(selectExpense)
            .from(expenses)
            .leftJoin(
                expenseCategories,
                eq(expenses.category_id, expenseCategories.id)
            )
            .where(eq(expenses.id, id))
        if (!row)
            throw new AppError({
                message: 'Expense not found',
                code: ERROR_CODES.EXPENSE.NOT_FOUND,
                status: 404,
                meta: { resource: 'expense', id },
            })
        return row
    }
    static async create(data, client = db) {
        const category = await ExpenseCategoryRepository.findOrCreate(
            { name: data.category },
            client
        )
        const { category: _category, ...values } = data
        const [row] = await client
            .insert(expenses)
            .values({ ...values, category_id: category.id })
            .returning()
        return row
    }
    static async update(id, data) {
        const values = { ...data, updated_at: new Date() }
        if (data.category) {
            const category = await ExpenseCategoryRepository.findOrCreate({
                name: data.category,
            })
            values.category_id = category.id
            delete values.category
        }
        await db.update(expenses).set(values).where(eq(expenses.id, id))
        return this.getById(id)
    }
    static async delete(id) {
        const row = await db
            .delete(expenses)
            .where(eq(expenses.id, id))
            .returning({ id: expenses.id })
        if (!row.length)
            throw new AppError({
                message: 'Failed to delete expense',
                code: ERROR_CODES.EXPENSE.DELETE_FAILED,
                status: 500,
                meta: { resource: 'expense', id },
            })
        return row[0]
    }
}
