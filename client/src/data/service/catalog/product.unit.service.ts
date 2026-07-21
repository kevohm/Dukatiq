import type {
    IProductUnitCreatePayload,
    IProductUnitUpdatePayload,
} from '@/features/product/product-unit/types'
import { getRepositories } from '../../repositories'

export class ProductUnitService {
    async getAll() {
        const { productUnitRepository } = await getRepositories()
        return productUnitRepository.findAll()
    }
    async getById(id?: string) {
        const { productUnitRepository } = await getRepositories()
        if (!id) {
            throw new Error('Product unit does not exist')
        }
        return productUnitRepository.findOrThrow(
            id,
            'Product unit does not exist'
        )
    }
    async getByProduct(productId?: string) {
        const { productUnitRepository, unitRepository } =
            await getRepositories()
        if (!productId) {
            throw new Error('Product unit does not exist')
        }
        const productUnits =
            await productUnitRepository.findByProductId(productId)
        if (!productUnits?.length) {
            throw new Error('Product unit does not exist')
        }

        const unitIds = productUnits?.map((p) => p?.unit_id)
        const units = await unitRepository.findByIds(unitIds)
        const unitMap = new Map(units.map((unit) => [unit.id, unit]))

        return productUnits?.map((p) => ({
            ...p,
            unit: unitMap.get(p?.unit_id),
        }))
    }

    async getByProducts(productIds?: string[]) {
        const { productUnitRepository, unitRepository } =
            await getRepositories()

        if (!productIds?.length) {
            throw new Error('Product ids are required')
        }

        const productUnits =
            await productUnitRepository.findByProductIds(productIds)

        if (!productUnits.length) {
            return []
        }

        const unitIds = [...new Set(productUnits.map((p) => p.unit_id))]

        const units = await unitRepository.findByIds(unitIds)

        const unitMap = new Map(units.map((unit) => [unit.id, unit]))

        return productUnits.map((productUnit) => ({
            ...productUnit,
            unit: unitMap.get(productUnit.unit_id),
        }))
    }
    async getByProductAndUnit(productId?: string, unitId?: string) {
        const { productUnitRepository } = await getRepositories()
        if (!unitId || !productId) {
            throw new Error('Product unit does not exist')
        }
        const productUnit = await productUnitRepository.findByProductAndUnit(
            productId,
            unitId
        )
        if (!productUnit) {
            throw new Error('Product unit does not exist')
        }
        return productUnit
    }

    async create(payload: IProductUnitCreatePayload) {
        const { productUnitRepository, unitRepository, productRepository } =
            await getRepositories()
        await productRepository.findOrThrow(payload?.product_id)
        await unitRepository.findOrThrow(payload?.unit_id)
        const existing = await productUnitRepository.findByProductAndUnit(
            payload?.product_id,
            payload?.unit_id
        )
        if (existing) {
            throw new Error('Product unit exists')
        }
        return await productUnitRepository.create(payload)
    }

    async update(id: string, payload: IProductUnitUpdatePayload) {
        const { productUnitRepository } = await getRepositories()
        await productUnitRepository.findOrThrow(id)

        if (payload.is_base_unit) {
            return productUnitRepository.setBaseUnit(id)
        }

        return productUnitRepository.update(id, payload)
    }

    async delete(id: string) {
        const { productUnitRepository } = await getRepositories()

        return productUnitRepository.delete(id)
    }
}
