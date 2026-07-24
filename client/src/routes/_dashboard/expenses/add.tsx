import { createFileRoute } from '@tanstack/react-router'
import AddExpense from '../../../pages/Expenses/AddExpense'

export const Route = createFileRoute('/_dashboard/expenses/add')({
    component: RouteComponent,
})

function RouteComponent() {
    return <AddExpense />
}
