import { useMemo, useState } from 'react'
import AppBodyWrapper from '../components/layout/AppBodyWrapper'
import { Topbar } from '../components/layout/Topbar'
import { DataTable } from '../components/data-table/DataTable'
import { DataTablePagination } from '../components/data-table/DataTablePagination'
import { DataTableToolbar } from '../components/data-table/DataTableToolbar'
import { inventoryColumns } from '../features/inventory/columns'
import { InventoryTransactionDialog } from '../features/inventory/components/InventoryTransactionDialog'
import { useInventory } from '../features/inventory/hooks'

const Inventory = () => {
    const { data = [], isLoading, isError } = useInventory()
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return data
        return data.filter((event) =>
            [event.product?.name, event.unit?.name, event.type, event.reference_type]
                .filter(Boolean)
                .some((value) => value!.toLowerCase().includes(query))
        )
    }, [data, search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const currentPage = Math.min(page, totalPages)
    const start = (currentPage - 1) * pageSize
    const paginated = filtered.slice(start, start + pageSize)

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
                {isLoading && <div className="py-6 text-sm text-muted">Loading inventory...</div>}
                {isError && <div className="py-6 text-sm text-danger">Unable to load inventory records.</div>}
                
                {!isLoading && !isError && <DataTable columns={inventoryColumns} 
                //@ts-ignore
                data={paginated} getRowId={(row) => row.id} selectable={false} />}
            </div>
            {!isLoading && !isError && (
                <DataTablePagination
                    pageSize={pageSize}
                    onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
                    rangeStart={filtered.length ? start + 1 : 0}
                    rangeEnd={Math.min(start + pageSize, filtered.length)}
                    total={filtered.length}
                    onPrev={() => setPage((value) => Math.max(1, value - 1))}
                    onNext={() => setPage((value) => Math.min(totalPages, value + 1))}
                    canPrev={currentPage > 1}
                    canNext={currentPage < totalPages}
                />
            )}
        </AppBodyWrapper>
    )
}

export default Inventory
