import { createFileRoute } from '@tanstack/react-router'
import Sales from '../../pages/Sales'

export const Route = createFileRoute('/sales/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Sales/>
}
