import { createFileRoute } from '@tanstack/react-router'
import { CartProvider } from '@/app/providers/CartProvider'
import Pos from '@/pages/pos/Pos'

export const Route = createFileRoute('/_dashboard/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <CartProvider>
            <Pos />
        </CartProvider>
    )
}
