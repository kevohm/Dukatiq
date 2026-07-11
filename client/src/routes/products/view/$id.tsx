import { createFileRoute } from '@tanstack/react-router'
import SingleProduct from '../../../pages/product/SingleProduct'

export const Route = createFileRoute('/products/view/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SingleProduct/>
}
