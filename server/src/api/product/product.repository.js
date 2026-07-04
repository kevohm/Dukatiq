import { QueryTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Product } from './product.model.js'
import { ProductCategoryRepository } from './category/product.category.repository.js'
import { AppError, ERROR_CODES } from '../../errors/app.error.js'
import { Unit } from './unit/unit.model.js'
import { ProductUnit } from './product-unit/product.unit.model.js'

export class ProductRepository {
    // Get all products
    static async getAll() {
        return Product.findAll({
            include: [
                {
                    model: Unit,
                    through: {
                        attributes: ['conversion_factor', 'is_base_unit'],
                    },
                },
            ],
        })
    }

    // Get product by ID
    static async getById(id) {
        const product = await Product.findByPk(id)
        if (!product) {
            throw new AppError({
                message: 'Product not found',
                code: ERROR_CODES.PRODUCT.NOT_FOUND,
                status: 404,
                meta: { resource: 'product', id },
            })
        }
        return product
    }

    // Create new product
    static async create(data, transaction = null) {
        const category = await ProductCategoryRepository.findOrCreate(
            { name: data?.category },
            transaction
        )
        return await Product.create(
            {
                ...data,
                category_id: category.id,
            },
            { transaction }
        )
    }

    // Update product
    static async update(id, data) {
        const product = await Product.update(data, { where: { id } })
        return product
    }
    static async delete(id) {
        const deleted = await Product.destroy({ where: { id } })
        if (!deleted) {
            throw new AppError({
                message: 'Failed to delete product',
                code: ERROR_CODES.PRODUCT.DELETE_FAILED,
                status: 500,
                meta: { resource: 'product', id },
            })
        }
        return deleted
    }

    // stock
    static async applyStockChange({ id, quantity, transaction = null }) {
        return Product.increment(
            { stock_quantity: quantity },
            { where: { id }, transaction }
        )
    }
}
