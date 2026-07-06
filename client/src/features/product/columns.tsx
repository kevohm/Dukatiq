import type { ColumnDef } from '../../components/data-table/types'
import type { Product } from './types'

export const productColumns: ColumnDef<Product>[] = [
    {
        id: 'name',
        header: 'Product',
        sortable: true,
        sortValue: (row: Product) => row.name,
        cell: (row: Product) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.name}</span>
                {row.category?.name && (
                    <span className="text-xs text-muted">
                        {row.category.name}
                    </span>
                )}
            </div>
        ),
    },

    {
        id: 'selling_price',
        header: 'Selling Price',
        sortable: true,
        sortValue: (row: Product) => row.selling_price,
        cell: (row: Product) => `KSh ${row.selling_price}`,
    },

    {
        id: 'cost_price',
        header: 'Cost Price',
        sortable: true,
        sortValue: (row: Product) => row.cost_price,
        cell: (row: Product) => `KSh ${row.cost_price}`,
    },

    {
        id: 'stock_quantity',
        header: 'Stock',
        sortable: true,
        sortValue: (row: Product) => row.stock_quantity,
        cell: (row: Product) => {
            const low = row.stock_quantity <= row.low_stock_threshold

            return (
                <span
                    className={
                        low ? 'text-red-500 font-medium' : 'text-green-600'
                    }
                >
                    {row.stock_quantity}
                </span>
            )
        },
    },
]
