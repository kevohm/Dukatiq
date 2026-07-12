import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/category/view/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <p>Edit </p>
}
