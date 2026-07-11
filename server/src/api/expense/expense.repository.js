import { db } from '../../config/database.js'
import {Expense} from '../../entities/expense/expense.model.js'
import { ExpenseCategoryRepository } from './category/expense.category.repository.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'

export class ExpenseRepository {
    static repo = db.getRepository(Expense)

    // Get all expenses
    static async getAll() {
        return this.repo.find({
            relations: {
                category: true,
            },
        })
    }

    // Get expense by ID
    static async getById(id) {
        const expense = await this.repo.findOne({
            where: { id },
            relations: {
                category: true,
            },
        })

        if (!expense) {
            throw new AppError({
                message: 'Expense not found',
                code: ERROR_CODES.EXPENSE.NOT_FOUND,
                status: 404,
                meta: {
                    resource: 'expense',
                    id,
                },
            })
        }

        return expense
    }

    // Create expense
    static async create(data, manager = this.repo.manager) {
        const category = await ExpenseCategoryRepository.findOrCreate(
            { name: data.category },
            manager
        )

        const expense = manager.create(Expense,{
            ...data,
            category,
        })

        return manager.save(Expense, expense)
    }

    // Update expense
    static async update(id, data) {
        if (data.category) {
            const category = await ExpenseCategoryRepository.findOrCreate({
                name: data.category,
            })

            data.category = category
        }

        await this.repo.update(id, data)

        return this.getById(id)
    }

    // Delete expense
    static async delete(id) {
        const result = await this.repo.delete(id)

        if (!result.affected) {
            throw new AppError({
                message: 'Failed to delete expense',
                code: ERROR_CODES.EXPENSE.DELETE_FAILED,
                status: 500,
                meta: {
                    resource: 'expense',
                    id,
                },
            })
        }

        return result
    }
}
