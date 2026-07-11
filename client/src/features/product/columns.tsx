import { Delete, Edit, Eye, Trash } from 'lucide-react'
import type { ColumnDef } from '../../components/data-table/types'
import type { Product } from './types'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Link } from '@tanstack/react-router'
import { useDeleteProduct } from './hooks'
import toast from 'react-hot-toast'

const DeleteButton = ({ id }: { id: string }) => {
    const { mutateAsync, isPending } = useDeleteProduct()
    const handleDelete = async () => {
        toast.promise(() => mutateAsync(id), {
            loading: 'Deleting product',
            success: 'Product successfully deleted',
            error: 'failed to delete product',
        })
    }
    return (
        <Button variant="primary" type='button' disabled={isPending} onClick={handleDelete}>
            <Trash className="w-4 h-4" />
        </Button>
    )
}

export const productColumns: ColumnDef<Product>[] = [
    {
        id: 'name',
        header: 'Product',
        sortable: true,
        sortValue: (row: Product) => row.name,
        cell: (row: Product) => <span className="font-medium">{row.name}</span>,
    },

    {
        id: 'category',
        header: 'Category',
        sortable: true,
        sortValue: (row: Product) => row.category?.name ?? '',
        cell: (row: Product) =>
            row.category ? <Badge>{row.category.name}</Badge> : '—',
    },
    {
        id: 'brand',
        header: 'Brand',
        sortable: true,
        sortValue: (row: Product) => row.brand?.name ?? '',
        cell: (row: Product) =>
            row.brand ? <Badge color="green">{row.brand.name}</Badge> : '—',
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

    {
        id: 'actions',
        header: 'Actions',
        cell: (row: Product) => {
            return (
                <div className='flex gap-2.5'>
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
