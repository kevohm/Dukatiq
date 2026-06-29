import { QueryTypes } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Product } from './product.model.js'
import { ProductCategoryRepository } from './category/product.category.repository.js'

export class ProductRepository {
    // Get all products
    static async getAll() {
        return Product.findAll()
    }

    // Get product by ID
    static async getById(id) {
        return await Product.findByPk(id)
    }

    // Create new product
    static async create(data, transaction = null) {
        const category = await ProductCategoryRepository.findOrCreate(
            { name: data?.category }, transaction
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
        return await Product.destroy({ where: { id } })
    }

}
