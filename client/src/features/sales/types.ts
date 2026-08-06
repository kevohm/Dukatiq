
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
    created_at: string
    updated_at: string
    total_amount: number
    total_profit: number
    payment_method: SalePaymentMethod
    saleItems: SaleItem[]
}


type SaleItem = {
    id: string
    normalized_quantity: number
    quantity: number
    product_id: string
    unit_id: string
    sale_id: string
    // generated
    selling_price: number
    cost_price: number
    profit: number
    created_at: string
    updated_at: string

    unit: {
        id: string
        name: string
    }
    product: {
        id: string
        name: string
        image_url: string | null
        image_key: string | null
    }
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

export interface CartItem {
    product_id: string
    name: string
    cost_price: number
    selling_price: number
    stock_quantity: number
    quantity: number
    normalized_quantity: number,
    conversion_factor: number
    is_base_unit: boolean
    unit_id: string
    unit_name: string
}

export interface Cart {
    id: string
    total_cost: number
    total_amount: number
    items: CartItem[]
}