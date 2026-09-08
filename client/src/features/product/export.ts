// features/product/export.ts

import type { Product } from "./types"



export function mapProductForExport(product: Product) {
    const baseUnit = product.productUnits.find((u) => u.is_base_unit)

    return {
        Name: product.name,
        Category: product.category?.name,
        Brand: product.brand?.name,

        'Cost Price': product.cost_price,
        'Selling Price': product.selling_price,

        Stock: product.stock_quantity,
        'Low Stock Threshold': product.low_stock_threshold,

        'Base Unit': baseUnit?.unit.name ?? '',
    }
}


export function mapProductForMigration(product: Product) {
    return {
        name: product.name,

        cost_price: product.cost_price,
        selling_price: product.selling_price,
        stock_quantity: product.stock_quantity,
        low_stock_threshold: product.low_stock_threshold,

        category: product.category?.name,

        brand: product.brand?.name,

        units: JSON.stringify(
            product.productUnits.map((item) => ({
                unit_name: item.unit.name,
                conversion_factor: item.conversion_factor,
                is_base_unit: item.is_base_unit,
            }))
        ),

        image_url: product.image_url ?? '',
        image_key: product.image_key ?? '',
    }
}

export function mapProductsForExport(products: Product[]) {
    return products.map(mapProductForMigration)
}
