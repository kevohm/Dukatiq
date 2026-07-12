import { createFileRoute } from '@tanstack/react-router'
import { CartProvider } from '../../app/providers/CartProvider'
import Sales from '../../pages/Sales'

export const Route = createFileRoute('/sales/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <CartProvider>
            <Sales />
        </CartProvider>
    )
}
