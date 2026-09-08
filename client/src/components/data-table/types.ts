import type { ReactNode } from "react"

export type SortDirection = 'asc' | 'desc' | null

export type SortState = { columnId: string; direction: SortDirection }


export type ColumnDef<T> = {
    id: string

    header: string

    cell: (row: T) => ReactNode

    className?: string

    sortable?: boolean

    /**
     * Must return a primitive value for sorting
     */
    sortValue?: (row: T) => string | number
}

export type DataTableProps<T> = {
    columns: ColumnDef<T>[]
    data: T[]
    getRowId: (row: T) => string

    selectable?: boolean

    sort?: SortState
    onSortChange?: (sort: SortState) => void
}