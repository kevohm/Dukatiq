import { SaleItem } from './sale.item.model.js'

export class SaleItemRepository {
    // -----------------------------
    // CREATE SINGLE ITEM
    // -----------------------------
    static async create(data, transaction) {
        return SaleItem.create(data, { transaction })
    }

    // -----------------------------
    // BULK CREATE (🔥 important for performance)
    // -----------------------------
    static async bulkCreate(items, transaction) {
        return SaleItem.bulkCreate(items, { transaction })
    }

    // -----------------------------
    // UPDATE ITEM
    // -----------------------------
    static async update(id, data, transaction) {
        return SaleItem.update(data, {
            where: { id },
            transaction,
        })
    }

    // -----------------------------
    // DELETE ITEM
    // -----------------------------
    static async delete(id, transaction) {
        return SaleItem.destroy({
            where: { id },
            transaction,
        })
    }

    // -----------------------------
    // FIND BY ID
    // -----------------------------
    static async findById(id) {
        return SaleItem.findByPk(id)
    }

    // -----------------------------
    // FIND ALL ITEMS FOR A SALE
    // -----------------------------
    static async findBySaleId(sale_id) {
        return SaleItem.findAll({
            where: { sale_id },
            order: [['createdAt', 'ASC']],
        })
    }

    // -----------------------------
    // DELETE ALL ITEMS FOR A SALE
    // -----------------------------
    static async deleteBySaleId(sale_id, transaction) {
        return SaleItem.destroy({
            where: { sale_id },
            transaction,
        })
    }
}
