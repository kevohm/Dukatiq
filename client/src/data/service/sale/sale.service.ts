import { productUnitService } from '..'
import type { CreateSalePayload } from '../../../features/sales/types'
import { getRepositories } from '../../repositories'
import { InventoryReferenceTypeEnum, InventoryTypeEnum, type InventoryCreateInternaPayload } from '@/features/inventory/types'
import { inventoryService } from '../inventory/inventory.service'

export class SaleService {
    //TODO: implement a sale recording that created inventry record
    async create(payload: CreateSalePayload) {
        const { productRepository, saleRepository, saleItemRepository} =
            await getRepositories()

        let totalAmount = 0
        let totalProfit = 0

        const items = []
        let inventoryUpdate:InventoryCreateInternaPayload[] = []
        for (const item of payload?.items) {
            const product = await productRepository.findOrThrow(item.product_id)

            const productUnit = await productUnitService.getByProductAndUnit(
                item.product_id,
                item.unit_id
            )

            const quantity = item.quantity * productUnit?.conversion_factor
            const profit =
                (product?.selling_price - product?.cost_price) * quantity

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
