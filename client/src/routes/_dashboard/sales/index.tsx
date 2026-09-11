import Sales from '@/pages/sales/SaleList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/sales/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Sales/>
}
