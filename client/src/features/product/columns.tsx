import { Edit, Eye, Trash } from 'lucide-react'
import type { ColumnDef } from '../../components/data-table/types'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Link } from '@tanstack/react-router'
import { useDeleteProduct } from './hooks'
import toast from 'react-hot-toast'
import type { ProductDoc } from '@/data/models/product/product'

import { useProductCategory } from './category/hooks'
import { useProductBrand } from './brand/hooks'

type ProductType = ProductDoc
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

function CategoryCell({ categoryId }: { categoryId: string }) {
    const { data: category, isLoading } = useProductCategory(categoryId)

    if (isLoading) {
        return 'Loading...'
    }

    if (!category) {
        return '—'
    }

    return <Badge>{category.name}</Badge>
}

function BrandCell({ brandId }: { brandId: string }) {
    const { data: brand, isLoading } = useProductBrand(brandId)

    if (isLoading) {
        return 'Loading...'
    }

    if (!brand) {
        return '—'
    }

    return <Badge>{brand.name}</Badge>
}

export const productColumns: ColumnDef<ProductType>[] = [
    {
        id: 'name',
        header: 'Product',
        sortable: true,
        sortValue: (row: ProductType) => row.name,
        cell: (row: ProductType) => (
            <span className="font-medium">{row.name}</span>
        ),
    },

    {
        id: 'category',
        header: 'Category',
        sortable: true,
        // sortValue: (row: ProductType) => row.category?.name ?? '',
        cell: (row: ProductType) => <CategoryCell categoryId={row?.category_id} />,
    },
    {
        id: 'brand',
        header: 'Brand',
        sortable: true,
        // sortValue: (row: ProductType) => row.brand?.name ?? '',
        cell: (row: ProductType) =><BrandCell brandId={row?.brand_id} />,
    },

    {
        id: 'selling_price',
        header: 'Selling Price',
        sortable: true,
        sortValue: (row: ProductType) => row.selling_price,
        cell: (row: ProductType) => `KSh ${row.selling_price}`,
    },

    {
        id: 'cost_price',
        header: 'Cost Price',
        sortable: true,
        sortValue: (row: ProductType) => row.cost_price,
        cell: (row: ProductType) => `KSh ${row.cost_price}`,
    },

    {
        id: 'stock_quantity',
        header: 'Stock',
        sortable: true,
        sortValue: (row: ProductDoc) => row.stock_quantity,
        cell: (row: ProductDoc) => {
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
        cell: (row: ProductDoc) => {
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
