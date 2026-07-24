import { createFileRoute } from '@tanstack/react-router'
import Expenses from '../../../pages/Expenses/Expenses'

export const Route = createFileRoute('/_dashboard/expenses/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Expenses />
}
