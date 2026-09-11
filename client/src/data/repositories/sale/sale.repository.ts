import { getRepositories } from '..'
import type { SaleDoc } from '../../models/sale/sales'
import { BaseRepository } from '../base.repository'
export class SaleRepository extends BaseRepository<SaleDoc> {
    async findDetailed(id: string) {
        const { saleItemRepository, unitRepository, productRepository } =
            await getRepositories()

        const saleFound = await this.findById(id)

        if (!saleFound) {
            return null
        }

        const sale = saleFound?.toJSON()

        const saleItems = await saleItemRepository.findBySaleId(sale?.id)

        // Fetch units
        const unitIds = [
            ...new Set(saleItems.map((saleItem) => saleItem.unit_id)),
        ]

        const units = await unitRepository.findByIds(unitIds)

        const unitMap = new Map(
            units.map((unit) => [unit.id, { id: unit.id, name: unit.name }])
        )

        // Fetch brands
        const productIds = [
            ...new Set(
                saleItems
                    .map((saleItem) => saleItem?.product_id)
                    .filter(Boolean)
            ),
        ]

        const products = await productRepository.findByIds(productIds)

        const productMap = new Map(
            products.map((product) => [
                product.id,
                {
                    id: product?.id,
                    name: product?.name,
                    image_url: product?.image_url,
                    image_key: product?.image_key,
                },
            ])
        )

        // Group product units by product
        const saleItemMap = new Map<string, any[]>()

        for (const saleItem of saleItems) {
            const current = saleItemMap.get(saleItem.sale_id) ?? []

            current.push({
                ...saleItem,
                unit: unitMap.get(saleItem?.unit_id),
                product: productMap.get(saleItem?.product_id),
            })

            saleItemMap.set(saleItem?.sale_id, current)
        }

        return {
            ...sale,
            saleItems: saleItemMap.get(sale?.id) ?? [],
        }
    }
}
