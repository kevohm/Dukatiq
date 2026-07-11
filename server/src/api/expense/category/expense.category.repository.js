import { db } from '../../../config/database.js'
import {ExpenseCategory} from '../../../entities/expense/expense.category.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ExpenseCategoryRepository {
    static repo = db.getRepository(ExpenseCategory)

    // Get all categories
    static async getAll() {
        return this.repo.find()
    }

    // Get category by ID
    static async getById(id) {
        const category = await this.repo.findOne({
            where: { id },
        })

        if (!category) {
            throw new AppError({
                message: 'Category not found',
                code: ERROR_CODES.EXPENSE_CATEGORY.NOT_FOUND,
                status: 404,
                meta: {
                    resource: 'expense_category',
                    id,
                },
            })
        }

        return category
    }

    // Get category by name
    static async getByName(name, manager = this.repo.manager) {
        return manager.findOne(ExpenseCategory, {
            where: { name },
        })
    }

    // Create category
    static async create(data, manager = this.repo.manager) {
        const category = manager.create(ExpenseCategory, data)
        return manager.save(ExpenseCategory, category)
    }

    // Find or create category
    static async findOrCreate(data, manager = this.repo.manager) {
        const category = await this.getByName(data.name, manager)

        if (!category) {
            return this.create(data, manager)
        }

        return category
    }

    // Update category
    static async update(id, data) {
        await this.repo.update(id, data)
        return this.getById(id)
    }

    // Delete category
    static async delete(id) {
        const result = await this.repo.delete(id)

        if (!result.affected) {
            throw new AppError({
                message: 'Failed to delete category',
                code: ERROR_CODES.EXPENSE_CATEGORY.DELETE_FAILED,
                status: 500,
                meta: {
                    resource: 'expense_category',
                    id,
                },
            })
        }

        return result
    }
}
