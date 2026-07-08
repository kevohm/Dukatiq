export type ProductUnit = {
    id: string
    product_id: string
    unit_id: string
    conversion_factor: number
    is_base_unit: boolean
}
export type Unit = {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    product_unit: Pick<ProductUnit, 'conversion_factor' | 'is_base_unit'>
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

    units: Unit[]

    createdAt: string
    updatedAt: string
}
