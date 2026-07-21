import { getRepositories } from '../../repositories'
import type { BrandRepository } from '../../repositories/catalog/product.brand.repository'
import { BaseService } from '../base.service'

export class BrandService extends BaseService<BrandRepository> {
    constructor() {
        super(async () => {
            const { brandRepository } = await getRepositories()

            return brandRepository
        })
    }

    async create(name: string) {
        const repository = await this.getRepository()
        return repository.findOrCreate(name)
    }
}
