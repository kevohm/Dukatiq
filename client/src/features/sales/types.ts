
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

export type soldProduct = {
    id: string
    unit_id: string
    name: string
    cost_price: number
    selling_price: number
    stock_quantity: number
    conversion_factor: number
    is_base_unit: boolean
    unit_name: string
}

export type CartItem = {
    product: soldProduct
    product_id: string
    unit_id: string
    quantity: number
}
