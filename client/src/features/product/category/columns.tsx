import { Edit } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import type { ColumnDef } from '../../../components/data-table/types'
import type { ProductCategory } from './types'

export const productCategoryColumns: ColumnDef<ProductCategory>[] = [
    {
        id: 'name',
        header: 'Category',
        sortable: true,
        sortValue: (row) => row.name,
        cell: (row) => <Badge>{row.name}</Badge>,
    },

    {
        id: 'description',
        header: 'Description',
        sortable: true,
        sortValue: (row) => row.description ?? '',
        cell: (row) => row.description || '—',
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: (row) => (
            <Link to="/products/category/edit/$id" params={{ id: row.id }}>
                <Button variant="primary">
                    <Edit className="h-4 w-4" />
                </Button>
            </Link>
        ),
    },
]
