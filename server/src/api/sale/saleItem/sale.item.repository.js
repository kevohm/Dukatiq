import { EntityManager } from 'typeorm'
import { db } from '../../../config/database.js'
import { SaleItem } from './sale.item.model.js'

export class SaleItemRepository {
    static repo = db.getRepository(SaleItem)

    // -----------------------------
    // CREATE SINGLE ITEM
    // -----------------------------
    static async create(
        data,
        manager = this.repo.manager
    ) {
        const saleItem = manager.create(SaleItem, data)
        return manager.save(saleItem)
    }

    // -----------------------------
    // BULK CREATE
    // -----------------------------
    static async bulkCreate(
        items,
        manager = this.repo.manager
    ) {
        const saleItems = manager.create(SaleItem, items)
        return manager.save(saleItems)
    }

    // -----------------------------
    // UPDATE ITEM
    // -----------------------------
    static async update(
        id,
        data,
        manager = this.repo.manager
    ) {
        await manager.update(SaleItem, id, data)
        return this.findById(id, manager)
    }

    // -----------------------------
    // DELETE ITEM
    // -----------------------------
    static async delete(
        id,
        manager = this.repo.manager
    ) {
        return manager.delete(SaleItem, id)
    }

    // -----------------------------
    // FIND BY ID
    // -----------------------------
    static async findById(
        id,
        manager = this.repo.manager
    ) {
        return manager.findOne(SaleItem, {
            where: { id },
        })
    }

    // -----------------------------
    // FIND ALL ITEMS FOR A SALE
    // -----------------------------
    static async findBySaleId(
        sale_id,
        manager = this.repo.manager
    ) {
        return manager.find(SaleItem, {
            where: { sale_id },
            order: {
                createdAt: 'ASC',
            },
        })
    }

    // -----------------------------
    // DELETE ALL ITEMS FOR A SALE
    // -----------------------------
    static async deleteBySaleId(
        sale_id,
        manager = this.repo.manager
    ) {
        return manager.delete(SaleItem, {
            sale_id,
        })
    }
}