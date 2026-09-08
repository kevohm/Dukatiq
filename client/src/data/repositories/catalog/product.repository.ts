import type { ProductDoc } from '../../models/product/product'
import { BaseRepository } from '../base.repository'
import { getRepositories } from '..'

export class ProductRepository extends BaseRepository<ProductDoc> {
    
    async findDetailed(id: string) {
        const product = await this.findOrThrow(id)

        const {
            productCategoryRepository,
            brandRepository,
            productUnitRepository,
            unitRepository,
        } = await getRepositories()

        const [category, brand, productUnits] = await Promise.all([
            productCategoryRepository.findOrThrow(product.category_id),
            brandRepository.findOrThrow(product.brand_id),
            productUnitRepository.findByProductId(product.id),
        ])

        const unitIds = productUnits.map((productUnit) => productUnit.unit_id)

        const units = await unitRepository.findByIds(unitIds)

        const unitMap = new Map(units.map((unit) => [unit.id, unit]))

        const detailedProductUnits = productUnits.map((productUnit) => ({
            ...productUnit,
            unit: unitMap.get(productUnit.unit_id),
        }))

        return {
            ...product,
            category,
            brand,
            productUnits: detailedProductUnits,
        }
    }

    async adjustStock(id: string, quantity: number) {
        const product = await this.findById(id)

        if (!product) return

        return product.incrementalModify((doc) => {
            doc.stock_quantity += quantity
            return doc
        })
    }
}
