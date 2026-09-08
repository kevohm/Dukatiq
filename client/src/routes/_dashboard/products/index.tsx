import { createFileRoute } from '@tanstack/react-router'
import Product from '../../../pages/product/ProductList'

export const Route = createFileRoute('/_dashboard/products/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Product />
}
