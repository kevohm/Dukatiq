export function buildInventoryEntry({
    product_id,
    unit_id,
    type,
    quantity,
    normalized_quantity,
    reference_type = null,
    reference_id = null,
    adjustment_type = null,
}) {
    const entry = {
        product_id,
        unit_id,
        type,
        quantity,
        normalized_quantity,
        reference_type,
        reference_id,
    }

    // Only include adjustment_type for adjustments
    if (type === 'adjustment') {
        entry.adjustment_type = adjustment_type
    }

    return entry
}
export function calculateStockChange({
    type,
    normalized_quantity,
    adjustment_type,
}) {
    switch (type) {
        case 'stock_in':
            return normalized_quantity

        case 'stock_out':
            return -normalized_quantity

        case 'adjustment':
            if (!adjustment_type) {
                throw new Error('ADJUSTMENT_TYPE_REQUIRED_FOR_ADJUSTMENT')
            }

            return adjustment_type === 'decrease'
                ? -normalized_quantity
                : normalized_quantity

        default:
            throw new Error(`INVALID_INVENTORY_TYPE: ${type}`)
    }
}
