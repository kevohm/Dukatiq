import { ExpenseCategory } from './expense.category.model.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ExpenseCategoryRepository {
    // Get all products
    static async getAll() {
        return ExpenseCategory.findAll()
    }

    // Get product by ID
    static async getById(id) {
        const category = await ExpenseCategory.findByPk(id)
        if (!category) {
            throw new AppError({
                message: 'Category not found',
                code: ERROR_CODES.EXPENSE_CATEGORY.NOT_FOUND,
                status: 404,
                meta: { resource: 'expense_category', id },
            })
        }
        return category
    }

    static async getByName(name, transaction = null) {
        return await ExpenseCategory.findOne({ where: { name }, transaction })
    }
    // Create new product
    static async create(data, transaction = null) {
        return await ExpenseCategory.create(data, { transaction })
    }

    static async findOrCreate(data, transaction = null) {
        const category = await this.getByName(data?.name, transaction)
        if (!category) {
            return await this.create(data, transaction)
        }
        return category
    }

    // Update product
    static async update(id, data) {
        const product = await ExpenseCategory.update(data, { where: { id } })
        return product
    }
    static async delete(id) {
        const deleted = await ExpenseCategory.destroy({ where: { id } })
        if (!deleted) {
            throw new AppError({
                message: 'Failed to delete category',
                code: ERROR_CODES.EXPENSE_CATEGORY.DELETE_FAILED,
                status: 500,
                meta: { resource: 'expense_category', id },
            })
        }
        return deleted
    }
}
