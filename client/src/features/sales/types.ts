import type { Product } from "../product/types"

export type SalePaymentMethod = 'cash' | 'mpesa' | 'card' | 'credit'

export type SaleItemPayload = {
    product_id: string
    unit_id: string
    quantity: number
}

export type CreateSalePayload = {
    items: SaleItemPayload[]
    payment_method: SalePaymentMethod
}

export type Sale = {
    id: string
    payment_method: SalePaymentMethod
    totals: {
        total_amount: number
        total_profit: number
    }
    created_at: string
    updated_at: string
    items: Array<{
        id: string
        product_id: string
        unit_id: string
        quantity: number
        selling_price: number
        cost_price: number
        profit: number
    }>
}

export type CartItem = {
    product: Product
    unitId: string
    quantity: number
}
