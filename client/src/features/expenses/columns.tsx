import { Edit, Eye, Trash } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import toast from 'react-hot-toast'

import type { ColumnDef } from '../../components/data-table/types'
import { Badge, type BadgeColor } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

import { useDeleteExpense } from './hooks'
import type { Expense } from './types'
import { getBadgeColor } from '../../utils/badge'

const DeleteButton = ({ id }: { id: string }) => {
    const { mutateAsync, isPending } = useDeleteExpense()

    const handleDelete = async () => {
        toast.promise(() => mutateAsync(id), {
            loading: 'Deleting expense...',
            success: 'Expense deleted successfully.',
            error: 'Failed to delete expense.',
        })
    }

    return (
        <Button
            type="button"
            variant="primary"
            disabled={isPending}
            onClick={handleDelete}
        >
            <Trash className="w-4 h-4" />
        </Button>
    )
}

export const expenseColumns: ColumnDef<Expense>[] = [
    {
        id: 'name',
        header: 'Name',
        sortable: true,
        sortValue: (row) => row?.name ?? '',
        cell: (row) => row?.name ?? '—',
    },
    {
        id: 'category',
        header: 'Category',
        sortable: true,
        sortValue: (row) => row.category?.name ?? '',
        cell: (row) =>
            row.category ? (
                <Badge color={getBadgeColor(row.category.name) as BadgeColor}>
                    {row.category.name}
                </Badge>
            ) : (
                '—'
            ),
    },

    {
        id: 'amount',
        header: 'Amount',
        sortable: true,
        sortValue: (row) => row.amount,
        cell: (row) => `KSh ${row.amount}`,
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: (row) => (
            <div className="flex gap-2.5">
                <Link to="/expenses/view/$id" params={{ id: row.id }}>
                    <Button>
                        <Eye className="w-4 h-4" />
                    </Button>
                </Link>

                <Link to="/expenses/edit/$id" params={{ id: row.id }}>
                    <Button variant="primary">
                        <Edit className="w-4 h-4" />
                    </Button>
                </Link>

                <DeleteButton id={row.id} />
            </div>
        ),
    },
]
