import { createFileRoute } from '@tanstack/react-router'
import EditExpense from '../../../pages/Expenses/EditExpense'

export const Route = createFileRoute('/expenses/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditExpense/>
}
