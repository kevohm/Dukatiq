import { Minus, Plus, Trash2, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import type { CartItem, SalePaymentMethod } from '../types'
import { Select, type SelectOption } from '../../../components/ui/Select'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'

type SalesCartProps = {
    cartItems: CartItem[]
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
    onUpdateUnit: (
        productId: string,
        unitId: string,
        nextUnitId: string
    ) => void
    onRemoveItem: (productId: string, unitId: string) => void
    onCompleteSale: () => void
    formatCurrency: (value: number) => string
}

type SalesCartDrawerProps = SalesCartProps & {
    isOpen: boolean
    onClose: () => void
}

const paymentOptions: SelectOption[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'card', label: 'Card' },
    { value: 'credit', label: 'Credit' },
]

export function SalesCart(props: SalesCartProps) {
    return (
        <Card>
            <CartHeader itemCount={props.cartItems.length} />
            <CardContent>
                <CartContent {...props} />
            </CardContent>
        </Card>
    )
}

export function SalesCartDrawer({
    isOpen,
    onClose,
    ...props
}: SalesCartDrawerProps) {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose()
            }}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 xl:hidden" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface dark:bg-slate-950 shadow-2xl xl:hidden">
                    <div className="flex items-center justify-between border-b border-border dark:border-slate-900 px-4 py-3">
                        <div>
                            <Dialog.Title className="text-base font-semibold tracking-tight text-heading dark:text-slate-500">
                                Cart
                            </Dialog.Title>
                            <Dialog.Description className="mt-0 text-xs text-muted">
                                Review current items before checkout.
                            </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="rounded-lg p-2 text-muted hover:bg-hover hover:text-heading"
                                aria-label="Close cart"
                            >
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                        <CartContent {...props} />
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

function CartHeader({ itemCount }: { itemCount: number }) {
    return (
        <CardHeader className="px-4 py-3">
            <div>
                <CardTitle className="text-base">Cart</CardTitle>
                <CardDescription className="mt-0 text-xs">
                    Review current items before checkout.
                </CardDescription>
            </div>
            <span className="text-xs text-muted">{itemCount} item(s)</span>
        </CardHeader>
    )
}

function CartContent({
    cartItems,
    paymentMethod,
    total,
    isPending,
    onPaymentMethodChange,
    onUpdateQuantity,
    onRemoveItem,
    onCompleteSale,
    formatCurrency,
}: SalesCartProps) {
    return (
        <div className="space-y-4">
            {cartItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border dark:border-slate-900 p-3 text-sm text-muted dark:text-slate-500 text-center">
                    Select a product to start a sale.
                </div>
            ) : (
                <div className="space-y-3">
                    {cartItems.map((item) => {
                        const unitPrice =
                            item.product.selling_price *
                            item.product.conversion_factor
                        const itemSubtotal = unitPrice * item.quantity
                        const isLowStock =
                            item.product.stock_quantity <= item.quantity
                        const availableStock = Math.floor(
                            item.product.stock_quantity /
                                item?.product?.conversion_factor
                        )

                        return (
                            <div
                                key={`${item.product.id}-${item.unit_id}`}
                                className="rounded-xl border border-border dark:border-slate-900 p-3 bg-card space-y-2.5"
                            >
                                {/* Header: Name, Unit Badge, and Remove Action */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium text-heading dark:text-slate-500">
                                                {item.product.name}
                                            </p>
                                            <Badge
                                                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium`}
                                                color={
                                                    item.product.is_base_unit
                                                        ? 'green'
                                                        : 'gray'
                                                }
                                            >
                                                {item.product.unit_name}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted dark:text-slate-500">
                                            {formatCurrency(unitPrice)} per{' '}
                                            {item.product.unit_name}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemoveItem(
                                                item.product.id,
                                                item.unit_id
                                            )
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
                                                        item.product.id,
                                                        item.unit_id,
                                                        -1,
                                                        item?.product
                                                            ?.conversion_factor
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
                                                        item.product.id,
                                                        item.unit_id,
                                                        1,
                                                        item?.product
                                                            ?.conversion_factor
                                                    )
                                                }
                                                className="p-1.5  text-muted dark:text-slate-500 dark:hover:text-slate-400 hover:text-heading transition-colors"
                                                aria-label="Increase quantity"
                                                disabled={
                                                    item.quantity >=
                                                    item.product.stock_quantity
                                                }
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
                                            Stock: {availableStock}{' '}
                                            {item.product.unit_name} available
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
                    })}
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
                            {formatCurrency(total)}
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        type="button"
                        onClick={onCompleteSale}
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
