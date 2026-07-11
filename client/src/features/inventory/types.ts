import type { Product, Unit } from '../product/types'

export type InventoryEventType = 'stock_in' | 'stock_out' | 'adjustment'
export type InventoryAdjustmentType = 'increase' | 'decrease'

export type InventoryEvent = {
    id: string
    type: InventoryEventType
    quantity: number
    normalized_quantity: number
    adjustment_type: InventoryAdjustmentType | null
    reference_type: string | null
    reference_id: string | null
    product: Pick<Product, 'id' | 'name'> | null
    unit: Unit | null
    created_at: string
    updated_at: string
}

export type InventoryMovementPayload = {
    product_id: string
    unit_id: string
    quantity: number
    reference_type?: string
    reference_id?: string
}

export type InventoryAdjustmentPayload = InventoryMovementPayload & {
    adjustment_type: InventoryAdjustmentType
}

export type ProductStockSummary = {
    stock: number
}
