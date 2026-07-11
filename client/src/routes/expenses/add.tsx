import { createFileRoute } from '@tanstack/react-router'
import AddExpense from '../../pages/Expenses/AddExpense'

export const Route = createFileRoute('/expenses/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddExpense/>
}
