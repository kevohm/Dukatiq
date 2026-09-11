import type { Product, Unit } from '../product/types'

export const InventoryAdjustmentTypeEnum = {
    IN: 'increase',
    OUT: 'decrease',
} as const

export type InventoryAdjustmentType =
    (typeof InventoryAdjustmentTypeEnum)[keyof typeof InventoryAdjustmentTypeEnum]

export const InventoryReferenceTypeEnum = {
    SALE: 'sale',
    PURCHASE: 'purchase',
    ADJUSTMENT: 'adjustment',
    TRANSFER: 'transfer',
} as const

export type InventoryReferenceType =
    (typeof InventoryReferenceTypeEnum)[keyof typeof InventoryReferenceTypeEnum]

export const InventoryTypeEnum = {
    STOCK_IN: 'stock_in',
    STOCK_OUT: 'stock_out',
    ADJUSTMENT: 'adjustment',
} as const

export type InventoryType =
    (typeof InventoryTypeEnum)[keyof typeof InventoryTypeEnum]

export type Inventory = {
    id: string
    type: InventoryType
    quantity: number
    normalized_quantity: number
    adjustment_type: InventoryAdjustmentType | null
    reference_type: InventoryReferenceType | null
    reference_id: string | null
    created_at: string
    updated_at: string
    product: Pick<Product, 'id' | 'name'> | null
    unit: Pick<Unit, 'id' | 'name'> | null
}

export type InventoryEvent = {
    id: string
    type: InventoryType
    quantity: number
    normalized_quantity: number
    adjustment_type: InventoryAdjustmentType | null
    reference_type: InventoryReferenceType | null
    reference_id: string | null
    product: Pick<Product, 'id' | 'name'> | null
    unit: Pick<Unit, "id" | "name"> | null
    created_at: string
    updated_at: string
}

export type InventoryCreatePayload = {
    product_id: string
    unit_id: string
    quantity: number
}

export type InventoryCreateInternaPayload = {
    type: InventoryType
    product_id: string
    unit_id: string
    quantity: number
    adjustment_type?: InventoryAdjustmentType | null
    reference_type: InventoryReferenceType | null
    reference_id: string | null
}

export type InventoryAdjustmentPayload = InventoryCreatePayload & {
    adjustment_type: InventoryAdjustmentType
}

export type ProductStockSummary = {
    stock: number
}
