import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '@/features/sales/types'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/currency'
import {
    useCart,
    type ICartActionPayload,
} from '@/app/providers/CartProvider/CartProvider'
import { useMemo } from 'react'


export const CartCard: React.FC<{
    item: CartItem
    onUpdateQuantity: (
        productId: string,
        unitId: string,
        delta: number,
        conversionFactor: number
    ) => void
    onRemoveItem: (
        payload: Pick<ICartActionPayload, 'product_id' | 'unit_id'>
    ) => void
}> = ({ item, onRemoveItem, onUpdateQuantity }) => {
    const { cartStore } = useCart()
    const cartItems = cartStore?.carts[cartStore?.activeCartId]?.items
    const unitPrice = item.selling_price * item.conversion_factor
    const itemSubtotal = unitPrice * item.quantity
    const isLowStock = item.stock_quantity <= item.quantity
    const availableStock = Math.floor(
        item.stock_quantity / item.conversion_factor
    )

    const stockInCart = useMemo(() => {
        return cartItems
            ?.filter((cartItem) => cartItem?.product_id === item?.product_id)
            .reduce((prev, curr) => {
                const quantity = parseInt(curr?.quantity + ' ')
                return prev + quantity
            }, 0)
    }, [cartItems])

    return (
        <div
            key={`${item.product_id}-${item.unit_id}`}
            className="rounded-xl border border-border dark:border-slate-900 p-3 bg-card space-y-2.5"
        >
            {/* Header: Name, Unit Badge, and Remove Action */}
            <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-heading dark:text-slate-500">
                            {item.name}
                        </p>
                        <Badge
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium`}
                            color={item.is_base_unit ? 'green' : 'gray'}
                        >
                            {item.unit_name}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted dark:text-slate-500">
                        {formatCurrency(unitPrice)} per {item.unit_name}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        onRemoveItem({
                            product_id: item.product_id,
                            unit_id: item.unit_id,
                        })
                    }
                    className="text-muted dark:text-slate-500 hover:text-danger p-1 transition-colors"
                    aria-label="Remove item"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Footer/Controls: Quantity Toggles, Stock Status, and Subtotal */}
            <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/40 dark:border-slate-900">
                <div className="space-y-1">
                    <div className="flex w-min  items-center rounded-lg border border-border dark:border-slate-900 bg-background dark:bg-slate-950">
                        <button
                            type="button"
                            onClick={() =>
                                onUpdateQuantity(
                                    item.product_id,
                                    item.unit_id,
                                    -1,
                                    item.conversion_factor
                                )
                            }
                            className="p-1.5 text-muted hover:text-heading dark:text-slate-500 dark:hover:text-slate-400 transition-colors"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                onUpdateQuantity(
                                    item.product_id,
                                    item.unit_id,
                                    1,
                                    item.conversion_factor
                                )
                            }
                            className="p-1.5  text-muted dark:text-slate-500 dark:hover:text-slate-400 hover:text-heading transition-colors"
                            aria-label="Increase quantity"
                            disabled={item.quantity >= item.stock_quantity}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Stock Availability Indicator */}
                    <p
                        className={`text-xs ${
                            isLowStock
                                ? 'text-warning font-medium'
                                : 'text-muted dark:text-slate-500'
                        }`}
                    >
                        Stock:{' '}
                        {Math.floor(stockInCart / item.conversion_factor)}/
                        {availableStock} {item.unit_name} available
                    </p>
                </div>

                <div className="text-right">
                    <p className="font-semibold text-heading dark:text-slate-500">
                        {formatCurrency(itemSubtotal)}
                    </p>
                </div>
            </div>
        </div>
    )
}
