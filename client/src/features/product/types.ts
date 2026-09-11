
export type ProductUnit = {
    id: string
    conversion_factor: number
    is_base_unit: boolean
    created_at: string
    updated_at: string
    unit: Unit
}
export type Unit = {
    id: string
    name: string
    created_at: string
    updated_at: string
}

export type ProductBrand = {
    id: string
    name: string
    created_at: string
    updated_at: string
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
    brand_id: string
    category: { id: string; name: string } | null
    brand: { id: string; name: string } | null

    productUnits: ProductUnit[]

    created_at: string
    updated_at: string
}

interface UnitPayload {
    unit_name: string
    conversion_factor: number
    is_base_unit: boolean
}

export type IProductVariantCreatePayload = {
    product_id: string
    cost_price: number
    selling_price: number
    attributes: Record<string, string[]>
    // optional
    stock_quantity?: number
    sku?: string
    low_stock_threshold?: number
    image_url?: string | null
    image_key?: string | null
}


type ProductVariantPayload = {
    cost_price: number
    selling_price: number
    attributes: Record<string, string[]>
}


export interface IProductCreatePayload {
    name: string
    category: string
    brand: string
    cost_price: number
    selling_price: number
    units:  UnitPayload[]
    variants: ProductVariantPayload[]
    image_url?: string
    image_key?: string
}

export interface IProductUpdatePayload {
    name?: string
    category_id?: string
    brand_id?: string
    cost_price?: number
    selling_price?: number
}
