import { Sale } from './sale.model.js'
import { SaleItem } from './saleItem/sale.item.model.js'

export class SaleRepository {
    static async create(data, transaction) {
        return Sale.create(data, { transaction })
    }

    static async update(id, data, transaction) {
        return Sale.update(data, { where: { id }, transaction })
    }

    static async findById(id) {
        return Sale.findByPk(id, {
            include: [
                {
                    model: SaleItem,
                    as: 'items',
                },
            ],
        })
    }

    static async getAll() {
        return Sale.findAll({
            order: [['createdAt', 'DESC']],
        })
    }
}
