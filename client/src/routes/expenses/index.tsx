import { createFileRoute } from '@tanstack/react-router'
import Expenses from '../../pages/Expenses'

export const Route = createFileRoute('/expenses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Expenses/>
}
