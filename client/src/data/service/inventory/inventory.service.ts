import {
    InventoryTypeEnum,
    type Inventory,
    type InventoryAdjustmentType,
    type InventoryCreateInternaPayload,
    type InventoryCreatePayload,
    type InventoryReferenceType,
    type InventoryType,
} from '@/features/inventory/types'
import { getRepositories } from '../../repositories'
import { productUnitService } from '..'
import type { MangoQuery } from 'rxdb'
import type { InventoryDoc } from '@/data/models/inventory/inventory'
import { baseQueryBuilder } from '@/utils/pagination'
import type {
    IFindAllReturnType,
    PaginationQuery,
} from '@/data/repositories/base.repository'

function calculateStockChange({
    type,
    normalized_quantity,
    adjustment_type,
}: {
    type: InventoryType
    normalized_quantity: number
    adjustment_type?: InventoryAdjustmentType | null
}) {
    switch (type) {
        case 'stock_in':
            return normalized_quantity

        case 'stock_out':
            return -normalized_quantity

        case 'adjustment':
            return adjustment_type === 'increase'
                ? normalized_quantity
                : -normalized_quantity
        default:
            throw new Error('Invalid adjustment type')
    }
}

function assertSufficientStock({
    currentStock,
    change,
}: {
    currentStock: number
    change: number
}) {
    if (currentStock + change < 0) {
        throw new Error('Insufficient stock')
    }
}

export class InventoryService {
    static defaults = {
        adjustment_type: null,
        reference_type: null,
        reference_id: null,
    }
    async getAll(
        query: PaginationQuery = {}
    ): Promise<IFindAllReturnType<Inventory>> {
        const { inventoryRepository, productRepository, unitRepository } =
            await getRepositories()
        const mangoQuery: MangoQuery<InventoryDoc> = {
            selector: {},
        }
        mangoQuery['selector'] = baseQueryBuilder(query)
        const inventoryData = await inventoryRepository.findAll({
            mangoQuery,
            query: {
                limit: query?.limit,
                page: query?.page,
            },
        })

        const inventory = inventoryData?.data

        if (!inventory.length) {
            return {
                ...inventoryData,
                data: [],
            }
        }

        const productIds = [
            ...new Set(inventory.map((item) => item.product_id)),
        ]

        const unitIds = [...new Set(inventory.map((item) => item.unit_id))]

        const products = await productRepository.findByIds(productIds)

        const units = await unitRepository.findByIds(unitIds)

        const productMap = new Map(
            products.map((product) => [product.id, product])
        )

        const unitMap = new Map(units.map((unit) => [unit.id, unit]))
        const results = inventory.map((item) => {
            const product = productMap.get(item.product_id)
            const unit = unitMap.get(item.unit_id)
            return {
                ...item,
                type: item.type as InventoryType,
                adjustment_type:
                    item?.adjustment_type as InventoryAdjustmentType,
                reference_type: item.reference_type as InventoryReferenceType,
                product: product
                    ? {
                          id: product?.id,
                          name: product?.name,
                      }
                    : null,
                unit: unit
                    ? {
                          id: unit?.id,
                          name: unit?.name,
                      }
                    : null,
            }
        })
        return {
            ...inventoryData,
            data: results,
        }
    }

    async getById(id?: string) {
        if (!id) {
            throw new Error('Inventory does not exist')
        }

        const { inventoryRepository } = await getRepositories()
        return inventoryRepository.findOrThrow(id, 'Inventory does not exist')
    }
    async getStock(productId?: string) {
        if (!productId) {
            throw new Error('Product does not exist')
        }
        const { inventoryRepository, productRepository } =
            await getRepositories()
        await productRepository.findOrThrow(productId)
        return inventoryRepository.getStock(productId)
    }

    static async create(payload: InventoryCreateInternaPayload) {
        const { inventoryRepository, productRepository } =
            await getRepositories()
        const productUnit = await productUnitService.getByProductAndUnit(
            payload.product_id,
            payload.unit_id
        )
        if (!productUnit) {
            throw new Error('Product unit not found')
        }
        const normalizedQuantity =
            productUnit.conversion_factor * payload.quantity
        const data = {
            ...InventoryService.defaults,
            ...payload,
            product_id: payload?.product_id,
            quantity: payload?.quantity,
            unit_id: payload?.unit_id,
            type: payload?.type,
            normalized_quantity: normalizedQuantity,
        }
        const inventory = await inventoryRepository.create(data)

        const stockQuantity = calculateStockChange({
            type: payload?.type,
            adjustment_type: payload?.adjustment_type ?? null,
            normalized_quantity: normalizedQuantity,
        })
        await productRepository.adjustStock(payload?.product_id, stockQuantity)

        return inventory
    }
    async stockIn(payload: InventoryCreatePayload) {
        return InventoryService.create({
            ...InventoryService.defaults,
            ...payload,
            type: InventoryTypeEnum.STOCK_IN,
        })
    }

    async stockOut(payload: InventoryCreatePayload) {
        const { productRepository } = await getRepositories()

        const productUnit = await productUnitService.getByProductAndUnit(
            payload.product_id,
            payload.unit_id
        )

        if (!productUnit) {
            throw new Error('Product unit not found')
        }

        const normalized_quantity =
            payload.quantity * productUnit.conversion_factor

        const product = await productRepository.findOrThrow(
            payload.product_id,
            'Product not found'
        )

        const change = calculateStockChange({
            type: 'stock_out',
            normalized_quantity,
        })

        assertSufficientStock({
            currentStock: product.stock_quantity,
            change,
        })

        return InventoryService.create({
            ...InventoryService.defaults,
            ...payload,
            type: InventoryTypeEnum.STOCK_OUT,
        })
    }

    async adjust(
        payload: InventoryCreatePayload & {
            adjustment_type: InventoryAdjustmentType
        }
    ) {
        // console.log(payload)
        const { productRepository } = await getRepositories()

        const productUnit = await productUnitService.getByProductAndUnit(
            payload.product_id,
            payload.unit_id
        )

        if (!productUnit) {
            throw new Error('Product unit not found')
        }

        const normalized_quantity =
            payload.quantity * productUnit.conversion_factor

        const product = await productRepository.findOrThrow(
            payload.product_id,
            'Product not found'
        )

        const change = calculateStockChange({
            type: 'adjustment',
            normalized_quantity,
            adjustment_type: payload.adjustment_type,
        })

        assertSufficientStock({
            currentStock: product.stock_quantity,
            change,
        })

        return InventoryService.create({
            ...InventoryService.defaults,
            ...payload,
            type: InventoryTypeEnum.ADJUSTMENT,
        })
    }

    async bulkCreate(payloads: InventoryCreateInternaPayload[]) {
        const { inventoryRepository, productRepository } =
            await getRepositories()

        const inventoryData = []
        const stockChanges = new Map<string, number>()

        for (const payload of payloads) {
            const productUnit = await productUnitService.getByProductAndUnit(
                payload.product_id,
                payload.unit_id
            )

            if (!productUnit) {
                throw new Error(
                    `Product unit not found for product ${payload.product_id}`
                )
            }

            const normalizedQuantity =
                payload.quantity * productUnit.conversion_factor

            const change = calculateStockChange({
                type: payload.type,
                normalized_quantity: normalizedQuantity,
                adjustment_type: payload.adjustment_type,
            })

            stockChanges.set(
                payload.product_id,
                (stockChanges.get(payload.product_id) ?? 0) + change
            )

            inventoryData.push({
                ...InventoryService.defaults,
                product_id: payload.product_id,
                quantity: payload.quantity,
                unit_id: payload.unit_id,
                type: payload.type,
                adjustment_type: payload.adjustment_type ?? null,
                reference_type: payload.reference_type ?? null,
                reference_id: payload.reference_id ?? null,
                normalized_quantity: normalizedQuantity,
            })
        }

        // Validate all stock changes before writing
        for (const [productId, change] of stockChanges) {
            const product = await productRepository.findOrThrow(
                productId,
                'Product not found'
            )

            assertSufficientStock({
                currentStock: product.stock_quantity,
                change,
            })
        }

        const inventories = await inventoryRepository.bulkInsert(inventoryData)

        for (const [productId, change] of stockChanges) {
            await productRepository.adjustStock(productId, change)
        }

        return inventories
    }
}

export const inventoryService = new InventoryService()
