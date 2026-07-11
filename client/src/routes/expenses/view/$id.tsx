import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/expenses/view/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/expenses/view/$id"!</div>
}
