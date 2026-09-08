import { DataTable } from '@/components/data-table/DataTable'
import { DataTablePagination } from '@/components/data-table/DataTablePagination'
import { DataTableToolbar } from '@/components/data-table/DataTableToolbar'
import AppBodyWrapper from '@/components/layout/AppBodyWrapper'
import { Topbar } from '@/components/layout/Topbar'
import { Button } from '@/components/ui/Button'
import { saleColumns } from '@/features/sales/columns'
import { useGetSales } from '@/features/sales/hooks'
import { Upload } from 'lucide-react'
import { useState } from 'react'

const SaleList = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const {
        data: saleData,
        isLoading,
        error,
    } = useGetSales({
        page,
        limit: pageSize,
    })
    
    const data = saleData?.data ?? []

    if (isLoading) return <div className="p-6">Loading sales...</div>

    const totalPages = saleData?.total_pages ?? 0
    const total = saleData?.total ?? 0

    const rangeStart = saleData?.rangeStart ?? 0
    const rangeEnd = saleData?.rangeEnd ?? 0

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

    if (error)
        return <div className="p-6 text-red-500">Failed to load sales</div>
    return (
        <AppBodyWrapper>
            <Topbar
                title="Sales"
                subTitle="Search products and build a cart for quick checkout"
            />

            <DataTableToolbar
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
                    columns={saleColumns}
                    data={data}
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

export default SaleList
