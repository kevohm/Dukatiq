import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/products/category/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <p>Edit </p>
}
