import { createFileRoute } from '@tanstack/react-router'
import Inventory from '../../pages/Inventory'

export const Route = createFileRoute('/inventory/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Inventory/>
}
