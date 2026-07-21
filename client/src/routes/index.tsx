import { createFileRoute } from '@tanstack/react-router'
import Sales from '../pages/Sales'
import { CartProvider } from '../app/providers/CartProvider'


export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {

    return (
        <CartProvider>
            <Sales />
        </CartProvider>
    )
}
