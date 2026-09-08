import type { Unit } from "../unit/types"

export type ProductUnit = {
    id: string
    conversion_factor: number
    is_base_unit: boolean
    created_at: string
    updated_at: string
    unit: Unit
}


export interface IProductUnitCreatePayload {
    conversion_factor: number
    is_base_unit: boolean
    product_id: string
    unit_id: string
}

export interface IProductUnitUpdatePayload {
    conversion_factor: number
    is_base_unit: boolean
}
