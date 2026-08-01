import SingleSale from '@/pages/sales/SingleSale'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/sales/view/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SingleSale/>
}
