import { getRepositories } from '../../repositories'
import type { ProductCategoryRepository } from '../../repositories/catalog/product.category.repository'
import { BaseService } from '../base.service'

export class ProductCategoryService extends BaseService<ProductCategoryRepository> {
    constructor() {
        super(async () => {
            const { productCategoryRepository } = await getRepositories()
            return productCategoryRepository
        })
    }
    async getByName(name: string) {
        const { productCategoryRepository } = await getRepositories()
        const category = await productCategoryRepository.findByName(name)
        return category
    }
}
