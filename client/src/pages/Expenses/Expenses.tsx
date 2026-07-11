import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'

import { DataTable } from '../../components/data-table/DataTable'
import { DataTablePagination } from '../../components/data-table/DataTablePagination'
import { DataTableToolbar } from '../../components/data-table/DataTableToolbar'

import { Button } from '../../components/ui/Button'
import { Topbar } from '../../components/layout/Topbar'
import AppBodyWrapper from '../../components/layout/AppBodyWrapper'
import { Link } from '@tanstack/react-router'
import { expenseColumns } from '../../features/expenses/columns'
import { useExpenses } from '../../features/expenses/hooks'

const Expense = () => {
    const { data = [], isLoading, error } = useExpenses()

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // -----------------------------
    // FILTER
    // -----------------------------
    const filtered = useMemo(() => {
        return data.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [data, search])

    // -----------------------------
    // PAGINATION
    // -----------------------------
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginated = filtered.slice(start, end)

    const totalPages = Math.ceil(filtered.length / pageSize)

    if (isLoading) return <div className="p-6">Loading products...</div>
    if (error)
        return <div className="p-6 text-red-500">Failed to load products</div>

    return (
        <AppBodyWrapper>
            <Topbar
                title="Expense"
                actions={
                    <Link to="/expenses/add">
                  
                    <Button variant="primary" icon={<Plus size={16} />}>
                        Add Expense
                    </Button>
                    </Link>
                }
            ></Topbar>

            {/* ---------------- TOOLBAR ---------------- */}
            <DataTableToolbar
                search={{
                    value: search,
                    onChange: setSearch,
                    placeholder: 'Search products...',
                }}
            />

            {/* ---------------- TABLE ---------------- */}
            <div className="flex-1 overflow-y-auto px-6">
                <DataTable
                    columns={expenseColumns}
                    data={paginated}
                    getRowId={(row) => row.id}
                />
            </div>

            {/* ---------------- PAGINATION ---------------- */}
            <DataTablePagination
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                    setPageSize(size)
                    setPage(1)
                }}
                rangeStart={filtered.length === 0 ? 0 : start + 1}
                rangeEnd={Math.min(end, filtered.length)}
                total={filtered.length}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                canPrev={page > 1}
                canNext={page < totalPages}
            />
        </AppBodyWrapper>
    )
}

export default Expense
