import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { useProducts } from '../../features/product/hooks'
import { productColumns } from '../../features/product/columns'

import { importSpreadsheet } from '../../lib/excel/import'

import { DataTable } from '../../components/data-table/DataTable'
import { DataTablePagination } from '../../components/data-table/DataTablePagination'
import { DataTableToolbar } from '../../components/data-table/DataTableToolbar'

import { Button } from '../../components/ui/Button'
import { Topbar } from '../../components/layout/Topbar'
import AppBodyWrapper from '../../components/layout/AppBodyWrapper'

const ProductList = () => {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const {
        data: productData,
        isLoading,
        error,
    } = useProducts({
        search,
        limit: pageSize,
        page,
    })
    const products = productData?.data ?? []
    
    const totalPages = productData?.total_pages ?? 0
    const total = productData?.total ?? 0

    const rangeStart = productData?.rangeStart ?? 0
    const rangeEnd = productData?.rangeEnd ?? 0

    async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]

        if (!file) return
        //@ts-ignore
        const rows = await importSpreadsheet(file)

        // console.log(rows)

        // TODO:
        // await importProducts(rows)

        e.target.value = ''
    }

    if (isLoading) return <div className="p-6">Loading products...</div>

    if (error)
        return <div className="p-6 text-red-500">Failed to load products</div>

    return (
        <AppBodyWrapper>
            <Topbar
                title="Products"
                actions={
                    <Link to="/products/add">
                        <Button variant="primary" icon={<Plus size={16} />}>
                            Add Product
                        </Button>
                    </Link>
                }
            />

            <DataTableToolbar
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: 'Search products...',
                }}
                actions={
                    <>
                        <label>
                            <input
                                hidden
                                type="file"
                                accept=".xlsx,.csv"
                                onChange={handleImport}
                            />

                            <Button
                                variant="secondary"
                                icon={<Upload size={16} />}
                            >
                                <span>Import</span>
                            </Button>
                        </label>

                        {/* <ExportDropdown
                            filename="products"
                            data={mapProductsForExport(filtered)}
                        /> */}
                    </>
                }
            />

            <div className="flex-1 overflow-y-auto px-6">
                <DataTable
                    columns={productColumns}
                    data={products}
                    getRowId={(row) => row.id}
                />
            </div>

            <DataTablePagination
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setPage(1)
                }}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                total={total}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                canPrev={page > 1}
                canNext={page < totalPages}
            />
        </AppBodyWrapper>
    )
}

export default ProductList
