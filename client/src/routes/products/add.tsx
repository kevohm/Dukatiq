import { createFileRoute } from '@tanstack/react-router'
import AddProduct from '../../pages/product/AddProduct'

export const Route = createFileRoute('/products/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AddProduct/>
}
