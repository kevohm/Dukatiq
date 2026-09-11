import type {
    IFindAllReturnType,
    PaginationQuery,
} from '@/data/repositories/base.repository'
import { getRepositories } from '../../repositories'
import type { ProductCategoryRepository } from '../../repositories/catalog/product.category.repository'
import { BaseService } from '../base.service'
import type { ProductCategoryDoc } from '@/data/models/product/product.category'
import type { MangoQuery } from 'rxdb'
import { baseQueryBuilder } from '@/utils/pagination'

export class ProductCategoryService extends BaseService<ProductCategoryRepository> {
    constructor() {
        super(async () => {
            const { productCategoryRepository } = await getRepositories()
            return productCategoryRepository
        })
    }
    async findAll(
        query: PaginationQuery = {}
    ): Promise<IFindAllReturnType<ProductCategoryDoc>> {
        const productCategoryRepository = await this.getRepository()
        const mangoQuery: MangoQuery<ProductCategoryDoc> = {
            selector: {},
        }
        mangoQuery['selector'] = baseQueryBuilder(query, {
            search: {
                key: 'search',
                value: 'name.$regex',
            },
            filters: [
                {
                    key: 'category_id',
                    value: 'category_id.$eq',
                },
                {
                    key: 'brand_id',
                    value: 'brand_id.$eq',
                },
            ],
        })

        const productCategoryData = await productCategoryRepository.findAll({
            mangoQuery,
            query: {
                limit: query?.limit,
                page: query?.page,
            },
        })

        return productCategoryData
    }
    async getByName(name: string) {
        const { productCategoryRepository } = await getRepositories()
        const category = await productCategoryRepository.findByName(name)
        return category
    }

    async create(name: string) {
        const { productCategoryRepository } = await getRepositories()
        const repository = productCategoryRepository
        return repository.findOrCreate(name)?.then((d) => d.toJSON())
    }
}
