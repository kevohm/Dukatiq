import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Topbar } from '../components/layout/Topbar'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/data-table/DataTable'
import { DataTablePagination } from '../components/data-table/DataTablePagination'
import { FilterBar } from '../features/work-orders/components/FilterBar'
import { workOrderColumns } from '../features/work-orders/columns'
import { mockWorkOrders } from '../features/work-orders/mock-data'


export function WorkOrdersPage() {
    const [search, setSearch] = useState('')
    const [pageSize, setPageSize] = useState(10)

    // Replace with a TanStack Query hook (useWorkOrders) once wired to a real API —
    // the table/columns/filter bar below don't need to change.
    const filtered = useMemo(
        () =>
            mockWorkOrders.filter((wo) =>
                wo.title.toLowerCase().includes(search.toLowerCase())
            ),
        [search]
    )

    return (
        <>
            <Topbar
                title="Work Orders"
                actions={
                    <Button variant="primary" icon={<Plus size={16} />}>
                        New Work Order
                    </Button>
                }
            />

            <FilterBar search={search} onSearchChange={setSearch} />

            <div className="flex-1 overflow-y-auto px-6">
                <DataTable
                    columns={workOrderColumns}
                    data={filtered.slice(0, pageSize)}
                    getRowId={(row) => row.id}
                />
            </div>

            <DataTablePagination
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                rangeStart={filtered.length ? 1 : 0}
                rangeEnd={Math.min(pageSize, filtered.length)}
                total={filtered.length}
                onPrev={() => {}}
                onNext={() => {}}
                canPrev={false}
                canNext={filtered.length > pageSize}
            />
        </>
    )
}
