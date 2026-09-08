import { createFileRoute } from '@tanstack/react-router'
import EditExpense from '../../../../pages/Expenses/EditExpense'

export const Route = createFileRoute('/_dashboard/expenses/edit/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <EditExpense />
}
