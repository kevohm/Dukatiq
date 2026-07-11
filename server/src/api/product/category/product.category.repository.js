import { db } from '../../../config/database.js'
import { ProductCategory } from '../../../entities/product/category.model.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ProductCategoryRepository {
    static repo = db.getRepository(ProductCategory)

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
                code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND,
                status: 404,
                meta: { resource: 'product_category', id },
            })
        }

        return category
    }

    // Get category by name
    static async getByName(name) {
        return this.repo.findOne({
            where: { name },
        })
    }

    // Create new category
    static async create(data, manager = this.repo.manager) {
        const category = manager.create(ProductCategory, data)
        return manager.save(ProductCategory, category)
    }

    // Find or create category
    static async findOrCreate(data, manager = this.repo.manager) {
        const category = await this.getByName(data.name)

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
                code: ERROR_CODES.PRODUCT_CATEGORY.DELETE_FAILED,
                status: 500,
                meta: { resource: 'product_category', id },
            })
        }

        return result
    }
}
