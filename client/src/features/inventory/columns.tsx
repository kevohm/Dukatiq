import type { ColumnDef } from '../../components/data-table/types'
import { Badge, type BadgeColor } from '../../components/ui/Badge'
import { InventoryAdjustmentTypeEnum, InventoryTypeEnum, type Inventory, type InventoryEvent } from './types'

const typeLabels = {
    stock_in: 'Stock in',
    stock_out: 'Stock out',
    adjustment: 'Adjustment',
} as const

const typeColors: Record<InventoryEvent['type'], BadgeColor> = {
    stock_in: 'green',
    stock_out: 'red',
    adjustment: 'blue',
}

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('en-KE', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value))

export const inventoryColumns: ColumnDef<Inventory>[] = [
    {
        id: 'created_at',
        header: 'Date',
        sortable: true,
        sortValue: (row) => row.created_at,
        cell: (row) => formatDate(row.created_at),
    },
    {
        id: 'product',
        header: 'Product',
        sortable: true,
        sortValue: (row) => row.product?.name ?? '',
        cell: (row) => row.product?.name ?? '—',
    },

    {
        id: 'type',
        header: 'Movement',
        sortable: true,
        sortValue: (row) => row.type,
        cell: (row) => (
            <Badge color={typeColors[row.type]}>{typeLabels[row.type]}</Badge>
        ),
    },
    {
        id: 'quantity',
        header: 'Quantity',
        sortable: true,
        sortValue: (row) => row.quantity,
        cell: (row) => {
            const isDecrease =
                row.type === InventoryTypeEnum.STOCK_OUT ||
                row.adjustment_type === InventoryAdjustmentTypeEnum.OUT

            return (
                <span
                    className={
                        isDecrease
                            ? 'font-medium text-danger'
                            : 'font-medium text-green-600'
                    }
                >
                    {isDecrease ? '-' : '+'}
                    {row.quantity} {row.unit?.name ?? ''}
                </span>
            )
        },
    },
    {
        id: 'normalized_quantity',
        header: 'Stock Change',
        sortable: true,
        sortValue: (row) => row.normalized_quantity,
        cell: (row) => {
            const isDecrease =
                row.type === InventoryTypeEnum.STOCK_OUT ||
                row.adjustment_type === InventoryAdjustmentTypeEnum.OUT

            return (
                <span
                    className={
                        isDecrease
                            ? 'font-medium text-danger'
                            : 'font-medium text-green-600'
                    }
                >
                    {isDecrease ? '-' : '+'}
                    {row.normalized_quantity} base units
                </span>
            )
        },
    },
    {
        id: 'reference_type',
        header: 'Reference',
        sortable: true,
        sortValue: (row) => row.reference_type ?? '',
        cell: (row) => row.reference_type ?? '—',
    },
    {
        id: 'adjustment_type',
        header: 'Adjustment',
        sortable: true,
        sortValue: (row) => row.adjustment_type ?? '',
        cell: (row) => {
            if (row.type !== InventoryTypeEnum.ADJUSTMENT) {
                return '—'
            }

            const isDecrease =
                row.adjustment_type === InventoryAdjustmentTypeEnum.OUT

            return (
                <Badge color={isDecrease ? 'red' : 'green'}>
                    {isDecrease ? 'Decrease' : 'Increase'}
                </Badge>
            )
        },
    },
]
