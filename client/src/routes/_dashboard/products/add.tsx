import { createFileRoute } from '@tanstack/react-router'
import AddProduct from '../../../pages/product/AddProduct'

export const Route = createFileRoute('/_dashboard/products/add')({
    component: RouteComponent,
})

function RouteComponent() {
    return <AddProduct />
}
