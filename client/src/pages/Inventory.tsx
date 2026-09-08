import {  useState } from 'react'
import AppBodyWrapper from '../components/layout/AppBodyWrapper'
import { Topbar } from '../components/layout/Topbar'
import { DataTable } from '../components/data-table/DataTable'
import { DataTablePagination } from '../components/data-table/DataTablePagination'
import { DataTableToolbar } from '../components/data-table/DataTableToolbar'
import { inventoryColumns } from '../features/inventory/columns'
import { InventoryTransactionDialog } from '../features/inventory/components/InventoryTransactionDialog'
import { useInventory } from '../features/inventory/hooks'

const Inventory = () => {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const {
        data: inventoryData,
        isLoading,
        isError,
    } = useInventory({
        page,
        limit: pageSize,
        search,
    })
    const data = inventoryData?.data ?? []

    const totalPages = inventoryData?.total_pages ?? 0
    const total = inventoryData?.total ?? 0

    const rangeStart = inventoryData?.rangeStart ?? 0
    const rangeEnd = inventoryData?.rangeEnd ?? 0


    return (
        <AppBodyWrapper>
            <Topbar
                title="Inventory"
                subTitle="Review stock movements and record inventory changes."
                actions={<InventoryTransactionDialog />}
            />
            <DataTableToolbar
                search={{
                    value: search,
                    onChange: (value) => {
                        setSearch(value)
                        setPage(1)
                    },
                    placeholder: 'Search inventory movements...',
                }}
            />
            <div className="flex-1 overflow-y-auto px-6">
                {isLoading && (
                    <div className="py-6 text-sm text-muted">
                        Loading inventory...
                    </div>
                )}
                {isError && (
                    <div className="py-6 text-sm text-danger">
                        Unable to load inventory records.
                    </div>
                )}

                {!isLoading && !isError && (
                    <DataTable
                        columns={inventoryColumns}
                        data={data}
                        getRowId={(row) => row.id}
                        selectable={false}
                    />
                )}
            </div>
            {!isLoading && !isError && (
                <DataTablePagination
                    pageSize={pageSize}
                    onPageSizeChange={(size) => {
                        setPageSize(size)
                        setPage(1)
                    }}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    total={total}
                    onPrev={() => setPage((value) => Math.max(1, value - 1))}
                    onNext={() =>
                        setPage((value) => Math.min(totalPages, value + 1))
                    }
                    canPrev={page > 1}
                    canNext={page < totalPages}
                />
            )}
        </AppBodyWrapper>
    )
}

export default Inventory
