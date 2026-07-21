export const SyncCollections = {
    PRODUCT: 'product',
    BRAND: 'brand',
    UNIT: 'unit',
    CATEGORY: 'product-category',
    PRODUCTUNIT: 'product-unit',
    SALE: 'sale',
    SALEITEM: 'sale-item',
    INVENTORY: 'inventory',
} as const

export type SyncCollectionName =
    (typeof SyncCollections)[keyof typeof SyncCollections]
