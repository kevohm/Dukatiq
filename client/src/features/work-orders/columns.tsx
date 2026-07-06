import type { ColumnDef } from '../../components/data-table/DataTable-old'
import type { WorkOrder } from './types'
import { AssigneeCell } from './components/AssigneeCell'
import { PriorityBadge } from './components/PriorityBadge'

export const workOrderColumns: ColumnDef<WorkOrder>[] = [
    { id: 'woNumber', header: 'WO#', cell: (row) => row.woNumber },
    {
        id: 'title',
        header: 'Work Order Title',
        cell: (row) => (
            <span className="font-medium text-gray-900">{row.title}</span>
        ),
    },
    {
        id: 'assignee',
        header: 'Assigned to',
        cell: (row) => (
            <AssigneeCell
                name={row.assignee.name}
                avatarUrl={row.assignee.avatarUrl}
            />
        ),
    },
    { id: 'startDate', header: 'Start Date', cell: (row) => row.startDate },
    { id: 'dueDate', header: 'Due Date', cell: (row) => row.dueDate },
    { id: 'category', header: 'Category', cell: (row) => row.category },
    {
        id: 'priority',
        header: 'Priority',
        cell: (row) => <PriorityBadge priority={row.priority} />,
    },
    { id: 'location', header: 'Location', cell: (row) => row.location },
    {
        id: 'asset',
        header: 'Asset',
        cell: (row) => <span className="text-gray-500">{row.asset}</span>,
    },
]
