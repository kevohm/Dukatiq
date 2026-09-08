import { Edit, Eye, Trash } from 'lucide-react'
import type { ColumnDef } from '../../../components/data-table/types'

import { Button } from '../../../components/ui/Button'
import { Link } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { useDeleteUnit } from './hooks'
import type { Unit } from './types'

const DeleteButton = ({ id }: { id: string }) => {
    const { mutateAsync, isPending } = useDeleteUnit()
    const handleDelete = async () => {
        toast.promise(() => mutateAsync(id), {
            loading: 'Deleting product',
            success: 'Product successfully deleted',
            error: 'failed to delete product',
        })
    }
    return (
        <Button
            variant="primary"
            type="button"
            disabled={isPending}
            onClick={handleDelete}
        >
            <Trash className="w-4 h-4" />
        </Button>
    )
}

export const productColumns: ColumnDef<Unit>[] = [
    {
        id: 'name',
        header: 'Product',
        sortable: true,
        sortValue: (row: Unit) => row.name,
        cell: (row: Unit) => <span className="font-medium">{row.name}</span>,
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: (row) => {
            return (
                <div className="flex gap-2.5">
                    <Link to="/products/view/$id" params={{ id: row?.id }}>
                        <Button>
                            <Eye className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link to="/products/edit/$id" params={{ id: row?.id }}>
                        <Button variant="primary">
                            <Edit className="w-4 h-4" />
                        </Button>
                    </Link>
                    <DeleteButton id={row?.id} />
                </div>
            )
        },
    },
]
