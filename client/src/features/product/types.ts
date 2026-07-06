export type ProductUnit = {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    product_unit: {
        conversion_factor: number
        is_base_unit: boolean
    }
}

export type Product = {
    id: string
    name: string

    cost_price: number
    selling_price: number
    stock_quantity: number
    low_stock_threshold: number

    image_url: string | null
    image_key: string | null

    category_id: string

    units: ProductUnit[]

    createdAt: string
    updatedAt: string
}
