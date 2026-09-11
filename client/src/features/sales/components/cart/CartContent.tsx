import type { SalePaymentMethod } from '../../types'
import { Select, type SelectOption } from '@/components/ui/Select'

import { Button } from '@/components/ui/Button'
import {
    useCart,
    type ICartActionPayload,
} from '@/app/providers/CartProvider/CartProvider'
import { CartCard } from './CartCard'

const paymentOptions: SelectOption[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'card', label: 'Card' },
    { value: 'credit', label: 'Credit' },
]

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

export function CartContent({
    paymentMethod,
    isPending,
    onPaymentMethodChange,
    onUpdateQuantity,
    onRemoveItem,
    onCompleteSale,
    formatCurrency,
}: SalesCartProps) {
    const { cartStore} = useCart()
    const cart = cartStore?.carts[cartStore?.activeCartId]
    const cartItems = cart?.items ?? []
    return (
        <div className="space-y-4">
            {cartItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border dark:border-slate-900 p-3 text-sm text-muted dark:text-slate-500 text-center">
                    Select a product to start a sale.
                </div>
            ) : (
                <div className="space-y-3">
                    {cartItems.map((item, idx) => (
                        <CartCard
                            key={`${item?.product_id}-${item?.product_id}-${idx}`}
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemoveItem={onRemoveItem}
                        />
                    ))}
                </div>
            )}

            {/* Payment & Submission Controls */}
            <div className="space-y-3 pt-2">
                <Select
                    label="Payment method"
                    value={paymentMethod}
                    onChange={(event) =>
                        onPaymentMethodChange(
                            event.target.value as SalePaymentMethod
                        )
                    }
                    options={paymentOptions}
                />

                <div className="flex items-center justify-between gap-3 bg-surface dark:bg-slate-950 p-3 rounded-xl border border-border dark:border-slate-900">
                    <div>
                        <p className="text-xs uppercase tracking-wider font-medium text-muted dark:text-slate-500">
                            Total Amount
                        </p>
                        <p className="text-2xl font-bold text-heading dark:text-slate-500">
                            {formatCurrency(cart?.total_amount ?? 0)}
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        type="button"
                        onClick={() =>onCompleteSale(cartStore?.activeCartId)}
                        disabled={!cartItems.length || isPending}
                        className="px-5 py-2.5 h-auto"
                    >
                        {isPending ? 'Processing...' : 'Complete sale'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
