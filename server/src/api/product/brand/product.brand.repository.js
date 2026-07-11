import { db } from '../../../config/database.js'
import { Brand } from '../../../entities/product/brand.model.js'
import { AppError, ERROR_CODES } from '../../../errors/app.error.js'

export class ProductBrandRepository {
    static repo = db.getRepository(Brand)

    // Get all brands
    static async getAll() {
        return this.repo.find()
    }

    // Get brand by ID
    static async getById(id) {
        const brand = await this.repo.findOne({
            where: { id },
        })

        if (!brand) {
            throw new AppError({
                message: 'Brand not found',
                code: ERROR_CODES.PRODUCT_CATEGORY.NOT_FOUND,
                status: 404,
                meta: { resource: 'product_brand', id },
            })
        }

        return brand
    }

    // Get brand by name
    static async getByName(name) {
        return this.repo.findOne({
            where: { name },
        })
    }

    // Create brand
    static async create(data, manager = this.repo.manager) {
        const brand = manager.create(Brand, data)
        return manager.save(Brand, brand)
    }

    // Find or create brand
    static async findOrCreate(data, manager = this.repo.manager) {
        const brand = await this.getByName(data.name)

        if (!brand) {
            return this.create(data, manager)
        }

        return brand
    }

    // Update brand
    static async update(id, data) {
        await this.repo.update(id, data)
        return this.getById(id)
    }

    // Delete brand
    static async delete(id) {
        const result = await this.repo.delete(id)

        if (!result.affected) {
            throw new AppError({
                message: 'Failed to delete brand',
                code: ERROR_CODES.PRODUCT_CATEGORY.DELETE_FAILED,
                status: 500,
                meta: { resource: 'product_brand', id },
            })
        }

        return result
    }
}
