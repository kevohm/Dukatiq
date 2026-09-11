import { InventoryTypeEnum } from '@/features/inventory/types'
import type { InventoryDoc } from '../../models/inventory/inventory'
import { BaseRepository } from '../base.repository'

export class InventoryRepository extends BaseRepository<InventoryDoc> {
    async findByProduct(productId: string) {
        return this.collection
            .find({
                selector: {
                    product_id: productId,
                },
                sort: [{ created_at: 'desc' }],
            })
            .exec()
    }

    async getStock(productId: string) {
        const entries = await this.collection
            .find({
                selector: {
                    product_id: productId,
                },
            })
            .exec()

        return entries.reduce(
            (total, entry) => total + entry.normalized_quantity,
            0
        )
    }

    async getLowStockProducts(productRepository: {
        findAll(): Promise<any[]>
    }) {
        const products = await productRepository.findAll()

        const lowStock = []

        for (const product of products) {
            const stock = await this.getStock(product.id)

            if (stock <= product.low_stock_threshold) {
                lowStock.push({
                    product,
                    stock,
                })
            }
        }

        return lowStock
    }

    async adjustStock({
        product_id,
        unit_id,
        quantity,
        normalized_quantity,
        reference_type = null,
    }: {
        product_id: string
        unit_id: string
        quantity: number
        normalized_quantity: number
        reference_type?: InventoryDoc['reference_type']
    }) {
        const base = this.generate()
        return this.create({
            ...base,
            product_id,
            unit_id,
            quantity,
            normalized_quantity,
            type: InventoryTypeEnum.ADJUSTMENT,
            adjustment_type: null,
            reference_type,
            reference_id: null,
        } as InventoryDoc)
    }
}
