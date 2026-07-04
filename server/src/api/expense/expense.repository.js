import { QueryTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Expense } from './expense.model.js'
import { ExpenseCategoryRepository } from './category/expense.category.repository.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'

export class ExpenseRepository {
    // Get all expenses
    static async getAll() {
        return Expense.findAll()
    }

    // Get expense by ID
    static async getById(id) {
        const expense = await Expense.findByPk(id)
        if (!expense) {
            throw new AppError({
                message: 'Expense not found',
                code: ERROR_CODES.EXPENSE.NOT_FOUND,
                status: 404,
                meta: { resource: 'expense', id },
            })
        }
        return expense
    }

    // Create new expense
    static async create(data, transaction = null) {
        const category = await ExpenseCategoryRepository.findOrCreate(
            { name: data?.category },
            transaction
        )
        return await Expense.create(
            {
                ...data,
                category_id: category.id,
            },
            { transaction }
        )
    }

    // Update expense
    static async update(id, data) {
        const expense = await Expense.update(data, { where: { id } })
        return expense
    }
    static async delete(id) {
        const deleted = await Expense.destroy({ where: { id } })
        if (!deleted) {
            throw new AppError({
                message: 'Failed to delete expense',
                code: ERROR_CODES.EXPENSE.DELETE_FAILED,
                status: 500,
                meta: { resource: 'expense', id },
            })
        }
        return deleted
    }
}
