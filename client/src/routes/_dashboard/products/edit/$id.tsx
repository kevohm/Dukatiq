import { createFileRoute } from '@tanstack/react-router'
import EditProduct from '../../../../pages/product/EditProduct'

export const Route = createFileRoute('/_dashboard/products/edit/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    return <EditProduct />
}
