import { Category } from './product.category.model.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ProductCategoryRepository {
    // Get all products
    static async getAll() {
        return Category.findAll()
    }

    // Get product by ID
    static async getById(id) {
        const category = await Category.findByPk(id)
        if (!category) {
            throw new AppError({
                message: 'Category not found',
                code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND,
                status: 404,
                meta: { resource: 'product_category', id },
            })
        }
        return category
    }

    static async getByName(name, transaction = null) {
        return await Category.findOne({ where: { name }, transaction })
    }
    // Create new product
    static async create(data, transaction = null) {
        return await Category.create(data, { transaction })
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
        const product = await Category.update(data, { where: { id } })
        return product
    }
    static async delete(id) {
        const deleted = await Category.destroy({ where: { id } })
        if (!deleted) {
            throw new AppError({
                message: 'Failed to delete category',
                code: ERROR_CODES.PRODUCT_CATEGORY.DELETE_FAILED,
                status: 500,
                meta: { resource: 'product_category', id },
            })
        }
        return deleted
    }
}
