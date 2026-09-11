import type {
    IProductCreatePayload,
    IProductUpdatePayload,
} from '@/features/product/types'
import { getRepositories } from '../../repositories'
import type { ProductDoc, ProductQuery } from '@/data/models/product/product'
import type { MangoQuery } from 'rxdb'
import { baseQueryBuilder } from '@/utils/pagination'

export class ProductService {
    async getAll(query?: ProductQuery) {
        const {
            productRepository,
            productUnitRepository,
            unitRepository,
            productCategoryRepository,
            brandRepository,
        } = await getRepositories()

        const mangoQuery: MangoQuery<ProductDoc> = {
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

        const productData = await productRepository.findAll({
            mangoQuery,
            query: {
                limit: query?.limit,
                page: query?.page,
            },
        })

        const { data, ...rest } = productData
        const products = data
        const pagination = rest
        // Fetch product units
        const productIds = products.map((product) => product.id)

        const productUnits =
            await productUnitRepository.findByProductIds(productIds)

        // Fetch units
        const unitIds = [
            ...new Set(productUnits.map((productUnit) => productUnit.unit_id)),
        ]

        const units = await unitRepository.findByIds(unitIds)

        const unitMap = new Map(
            units.map((unit) => [unit.id, { id: unit.id, name: unit.name }])
        )

        // Fetch categories
        const categoryIds = [
            ...new Set(
                products.map((product) => product.category_id).filter(Boolean)
            ),
        ]

        const categories =
            await productCategoryRepository.findByIds(categoryIds)

        const categoryMap = new Map(
            categories.map((category) => [
                category.id,
                { id: category?.id, name: category?.name },
            ])
        )

        // Fetch brands
        const brandIds = [
            ...new Set(
                products.map((product) => product.brand_id).filter(Boolean)
            ),
        ]

        const brands = await brandRepository.findByIds(brandIds)

        const brandMap = new Map(
            brands.map((brand) => [
                brand.id,
                { id: brand?.id, name: brand?.name },
            ])
        )

        // Group product units by product
        const productUnitMap = new Map<string, any[]>()

        for (const productUnit of productUnits) {
            const current = productUnitMap.get(productUnit.product_id) ?? []

            current.push({
                conversion_factor: productUnit?.conversion_factor,
                is_base_unit: productUnit?.is_base_unit,
                id: productUnit?.id,
                unit: unitMap.get(productUnit.unit_id),
            })

            productUnitMap.set(productUnit.product_id, current)
        }

        const results = products.map((product) => ({
            ...product,
            category: product.category_id
                ? (categoryMap.get(product.category_id) ?? null)
                : null,

            brand: product.brand_id
                ? (brandMap.get(product.brand_id) ?? null)
                : null,
            productUnits: productUnitMap.get(product.id) ?? [],
        }))
        // console.log(results)
        return {
            ...pagination,
            data: results,
        }
    }
    async getById(id?: string) {
        const { productRepository } = await getRepositories()
        if (!id) {
            throw new Error('Product does not exist')
        }
        return productRepository.findDetailed(id)
    }

    async create(payload: IProductCreatePayload) {
        const {
            productRepository,
            productCategoryRepository,
            brandRepository,
            unitRepository,
            productUnitRepository,
            productVariantRepository,
        } = await getRepositories()

        const {
            category: categoryName,
            brand: brandName,
            units,
            variants,
            ...data
        } = payload

        const category =
            await productCategoryRepository.findOrCreate(categoryName)

        const brand = await brandRepository.findOrCreate(brandName)

        const product = await productRepository.create({
            ...data,

            stock_quantity: 0,

            low_stock_threshold: 10,

            image_url: payload.image_url ?? null,

            image_key: payload.image_key ?? null,

            category_id: category.id,

            brand_id: brand.id,
        })

        for (const unit of units) {
            const existingUnit = await unitRepository.findOrCreate(
                unit.unit_name
            )

            await productUnitRepository.create({
                product_id: product.id,
                unit_id: existingUnit.id,
                conversion_factor: unit.conversion_factor,
                is_base_unit: unit.is_base_unit ?? false,
            })
        }

        for (const variant of variants) {
            try {
                
                await productVariantRepository.create({
                    product_id: product.id,
                    selling_price: variant.selling_price,
                    cost_price: variant.cost_price,
                    attributes: variant.attributes,
                })
            } catch{}
        }

        return product
    }

    async update(id: string, payload: IProductUpdatePayload) {
        const {
            productRepository,
            productCategoryRepository,
            brandRepository,
        } = await getRepositories()
        if (payload?.category_id) {
            await productCategoryRepository.findOrThrow(
                payload.category_id,
                'Category does not exist'
            )
        }
        if (payload?.brand_id) {
            await brandRepository.findOrThrow(
                payload.brand_id,
                'Brand does not exist'
            )
        }

        return productRepository.update(id, payload)
    }

    async delete(id: string) {
        const { productRepository } = await getRepositories()

        return productRepository.delete(id)
    }
}
