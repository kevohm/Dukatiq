import { createFileRoute } from '@tanstack/react-router'
import Product from '../../pages/Product'

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Product/>;
}
