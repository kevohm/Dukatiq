import { ExpenseCategory } from './expense.category.model.js'

export class ExpenseCategoryRepository {
    // Get all products
    static async getAll() {
        return ExpenseCategory.findAll()
    }

    // Get product by ID
    static async getById(id) {
        return await ExpenseCategory.findByPk(id)
    }

    static async getByName(name, transaction=null) {
        return await ExpenseCategory.findOne({where:{name}, transaction})
    }
    // Create new product
    static async create(data, transaction = null) {
        return await ExpenseCategory.create(data, { transaction })
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
        const product = await ExpenseCategory.update(data, { where: { id } })
        return product
    }
    static async delete(id) {
        return await ExpenseCategory.destroy({ where: { id } })
    }
}
