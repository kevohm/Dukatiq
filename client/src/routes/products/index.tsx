import { createFileRoute } from '@tanstack/react-router'
import Product from '../../pages/product/Product'

export const Route = createFileRoute('/products/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Product />
}
