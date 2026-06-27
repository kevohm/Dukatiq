import { Category } from './product.category.model.js'

export class ProductCategoryRepository {
    // Get all products
    static async getAll() {
        return Category.findAll()
    }

    // Get product by ID
    static async getById(id) {
        return await Category.findByPk(id)
    }

    static async getByName(name, transaction=null) {
        return await Category.findOne({where:{name}, transaction})
    }
    // Create new product
    static async create(data, transaction = null) {
        return await Category.create(data, { transaction })
    }

    static async findOrCreate(data, transaction = null) {
        const category = await this.getByName(data?.name, transaction);
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
        return await Category.destroy({ where: { id } })
    }
}
