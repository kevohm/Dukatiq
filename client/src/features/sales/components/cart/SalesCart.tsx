import type { SalePaymentMethod } from '../../types'
import { Card, CardContent } from '../../../../components/ui/Card'
import { type ICartActionPayload } from '@/app/providers/CartProvider/CartProvider'
import { CartHeader } from './CartHeader'
import { CartContent } from './CartContent'

type SalesCartProps = {
    paymentMethod: SalePaymentMethod
    total: number
    isPending: boolean
    onPaymentMethodChange: (method: SalePaymentMethod) => void
    onUpdateQuantity: (
        productId: string,
        unitId: string,
        delta: number,
        conversionFactor: number
    ) => void

    onRemoveItem: (
        payload: Pick<ICartActionPayload, 'product_id' | 'unit_id'>
    ) => void
    onCompleteSale: (cartId: string) => void
    formatCurrency: (value: number) => string
}

export function SalesCart(props: SalesCartProps) {
    return (
        <Card>
            <CartHeader />
            <CardContent>
                <CartContent {...props} />
            </CardContent>
        </Card>
    )
}
