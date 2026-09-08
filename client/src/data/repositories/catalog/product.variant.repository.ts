import type { ProductVariantDoc } from '@/data/models/product/variants/product.variant'
import { BaseRepository } from '../base.repository'
import type { IProductVariantCreatePayload } from '@/features/product/types'

export class ProductVariantRepository extends BaseRepository<ProductVariantDoc> {
    // async findDetailed(id: string) {
    //     const product = await this.findOrThrow(id)

    //     const {
    //         productCategoryRepository,
    //         brandRepository,
    //         productUnitRepository,
    //         unitRepository,
    //     } = await getRepositories()

    //     const [category, brand, productUnits] = await Promise.all([
    //         productCategoryRepository.findOrThrow(product.category_id),
    //         brandRepository.findOrThrow(product.brand_id),
    //         productUnitRepository.findByProductId(product.id),
    //     ])

    //     const unitIds = productUnits.map((productUnit) => productUnit.unit_id)

    //     const units = await unitRepository.findByIds(unitIds)

    //     const unitMap = new Map(units.map((unit) => [unit.id, unit]))

    //     const detailedProductUnits = productUnits.map((productUnit) => ({
    //         ...productUnit,
    //         unit: unitMap.get(productUnit.unit_id),
    //     }))

    //     return {
    //         ...product,
    //         category,
    //         brand,
    //         productUnits: detailedProductUnits,
    //     }
    // }

    create(doc: IProductVariantCreatePayload) {
        const base = this.generate()
        return this.collection.insert({
            ...doc,
            ...base,
        })
    }
}
