import { QueryTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Expense } from './expense.model.js'
import { ExpenseCategoryRepository } from './category/expense.category.repository.js'

export class ExpenseRepository {
    // Get all expenses
    static async getAll() {
        return Expense.findAll()
    }

    // Get expense by ID
    static async getById(id) {
        return await Expense.findByPk(id)
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
        return await Expense.destroy({ where: { id } })
    }
}
