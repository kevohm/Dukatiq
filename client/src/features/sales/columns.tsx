import { Eye} from 'lucide-react'
import type { ColumnDef } from '@/components/data-table/types'
import { Button } from '@/components/ui/Button'
import { Link } from '@tanstack/react-router'


import type { Sale } from './types'
import { formatCurrency } from '@/utils/currency'
import { Badge, type BadgeColor } from '@/components/ui/Badge'
import { getBadgeColor } from '@/utils/badge'
import { formatDate } from '@/utils/time'


export const saleColumns: ColumnDef<Sale>[] = [
    {
        id: 'created_at',
        header: 'Date',
        sortable: true,
        sortValue: (row) => row.created_at,
        cell: (row) => formatDate(row.created_at),
    },
    {
        id: 'amount',
        header: 'Total Amount',
        sortable: true,
        sortValue: (row: Sale) => row.total_amount,
        cell: (row: Sale) => (
            <span className="font-medium">
                {formatCurrency(row?.total_amount)}
            </span>
        ),
    },

    {
        id: 'profit',
        header: 'Total Profit',
        sortable: true,
        sortValue: (row: Sale) => row.total_profit ?? '',
        cell: (row: Sale) => (
            <span
                className={
                    row.total_profit > 0
                        ? 'text-red-500 font-medium'
                        : 'text-green-600'
                }
            >
                {formatCurrency(row?.total_profit)}
            </span>
        ),
    },

    {
        id: 'payment method',
        header: 'Payment Method',
        sortable: true,
        sortValue: (row: Sale) => row.payment_method,
        cell: (row: Sale) => {
            return (
                <Badge color={getBadgeColor(row?.payment_method) as BadgeColor}>
                    {row.payment_method}
                </Badge>
            )
        },
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: (row: Sale) => {
            return (
                <div className="flex gap-2.5">
                    <Link to="/sales/view/$id" params={{ id: row?.id }}>
                        <Button>
                            <Eye className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            )
        },
    },
]
