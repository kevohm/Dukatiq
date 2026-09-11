import type { ProductCategoryDoc } from '../../models/product/product.category'
import { BaseRepository } from '../base.repository'

export class ProductCategoryRepository extends BaseRepository<ProductCategoryDoc> {
    findByName(name: string) {
        return this.collection
            .findOne({
                selector: {
                    name,
                },
            })
            .exec()
    }

    async findOrCreate(name: string) {
        const existing = await this.findByName(name)

        if (existing) {
            return existing
        }

        return this.create({
            name: name.toLowerCase(),
        })
    }
}
