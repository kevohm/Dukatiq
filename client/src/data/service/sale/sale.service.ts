import { productUnitService } from '..'
import type { CreateSalePayload } from '../../../features/sales/types'
import { getRepositories } from '../../repositories'
import {
    InventoryReferenceTypeEnum,
    InventoryTypeEnum,
    type InventoryCreateInternaPayload,
} from '@/features/inventory/types'
import { inventoryService } from '../inventory/inventory.service'
import type { PaginationQuery } from '@/data/repositories/base.repository'
import { baseQueryBuilder } from '@/utils/pagination'
import type { MangoQuery } from 'rxdb'
import type { SaleDoc } from '@/data/models/sale/sales'

export class SaleService {
    async getAll(query: PaginationQuery = {}) {
        const {
            saleRepository,
            saleItemRepository,
            unitRepository,
            productRepository,
        } = await getRepositories()

        const mangoQuery: MangoQuery<SaleDoc> = {
            selector: {},
        }
        mangoQuery['selector'] = baseQueryBuilder(query)

        const saleData = await saleRepository.findAll({
            mangoQuery,
            query: {
                limit: query?.limit,
                page: query?.page,
            },
        })
        const sales = saleData?.data
        if (!sales.length) {
            return saleData
        }

        // Fetch sale items
        const saleIds = sales.map((sale) => sale.id)

        const saleItems = await saleItemRepository.findBySaleIds(saleIds)

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

        const results = sales.map((sale) => ({
            ...sale,
            saleItems: saleItemMap.get(sale?.id) ?? [],
        }))

        return {
            ...saleData,
            data: results,
        }
    }
    async getById(id?: string) {
        const { saleRepository } = await getRepositories()
        if (!id) {
            throw new Error('Sale does not exist')
        }
        const sale = await saleRepository.findDetailed(id)
        if (!sale) {
            throw new Error('Sale does not exist')
        }
        return sale
    }

    //TODO: implement a sale recording that created inventry record
    async create(payload: CreateSalePayload) {
        const { productRepository, saleRepository, saleItemRepository } =
            await getRepositories()

        let totalAmount = 0
        let totalProfit = 0

        const items = []
        let inventoryUpdate: InventoryCreateInternaPayload[] = []

        for (const item of payload?.items) {
            const product = await productRepository.findOrThrow(item.product_id)

            const productUnit = await productUnitService.getByProductAndUnit(
                item.product_id,
                item.unit_id
            )

            const quantity = item.quantity * productUnit?.conversion_factor
            const profit =
                (product?.selling_price - product?.cost_price) * quantity

            if (product?.stock_quantity < quantity) {
                continue
            }

            totalAmount += product.selling_price * quantity
            totalProfit += profit

            items.push({
                product_id: item.product_id,
                unit_id: item.unit_id,
                quantity: item.quantity,
                normalized_quantity: quantity,
                selling_price: product.selling_price,
                cost_price: product.cost_price,
                profit,
            })
        }

        if (items?.length === 0) {
            throw new Error('Insufficient stock')
        }

        const sale = await saleRepository.create({
            payment_method: payload.payment_method,
            total_amount: totalAmount,
            total_profit: totalProfit,
        })

        const body = items?.map((i) => ({ ...i, sale_id: sale?.id }))

        inventoryUpdate = items?.map((i) => ({
            type: InventoryTypeEnum.STOCK_OUT,
            quantity: i?.quantity,
            normalized_quantity: i?.normalized_quantity,
            reference_type: InventoryReferenceTypeEnum.SALE,
            reference_id: sale?.id,
            product_id: i?.product_id,
            unit_id: i?.unit_id,
        }))

        await saleItemRepository.bulkInsert(body)
        await inventoryService.bulkCreate(inventoryUpdate)
        return sale
    }
}
