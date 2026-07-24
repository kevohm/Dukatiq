import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/products/category/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <p>Edit </p>
}
