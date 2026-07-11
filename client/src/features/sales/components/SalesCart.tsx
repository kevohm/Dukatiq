import { Minus, Plus, Trash2, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import type { CartItem, SalePaymentMethod } from '../types'
import { Select, type SelectOption } from '../../../components/ui/Select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card'
import type { ProductUnit } from '../../product/types'
import { Button } from '../../../components/ui/Button'


type SalesCartProps = {
    cartItems: CartItem[]
    paymentMethod: SalePaymentMethod
    total: number
    isPending: boolean
    onPaymentMethodChange: (method: SalePaymentMethod) => void
    onUpdateQuantity: (productId: string, unitId: string, delta: number) => void
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
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-2xl xl:hidden">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div>
                            <Dialog.Title className="text-base font-semibold tracking-tight text-heading">
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
    onUpdateUnit,
    onRemoveItem,
    onCompleteSale,
    formatCurrency,
}: SalesCartProps) {
    return (
        <div className="space-y-4">
            {cartItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-3 text-sm text-muted">
                    Select a product to start a sale.
                </div>
            ) : (
                <div className="space-y-3">
                    {cartItems.map((item) => {
                        const unitOptions = (
                            item.product.productUnits ?? []
                        ).map((unit: ProductUnit) => ({
                            value: unit.id,
                            label: unit.unit?.name ?? 'Unit',
                        }))

                        return (
                            <div
                                key={`${item.product.id}-${item.unitId}`}
                                className="rounded-xl border border-border p-2.5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium text-heading">
                                            {item.product.name}
                                        </p>
                                        <p className="text-sm text-muted">
                                            {formatCurrency(
                                                item.product.selling_price
                                            )}{' '}
                                            each
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemoveItem(
                                                item.product.id,
                                                item.unitId
                                            )
                                        }
                                        className="text-muted hover:text-danger"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="mt-2 space-y-2">
                                    <Select
                                        label="Unit"
                                        value={item.unitId}
                                        onChange={(event) =>
                                            onUpdateUnit(
                                                item.product.id,
                                                item.unitId,
                                                event.target.value
                                            )
                                        }
                                        options={unitOptions}
                                    />
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center rounded-lg border border-border">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onUpdateQuantity(
                                                        item.product.id,
                                                        item.unitId,
                                                        -1
                                                    )
                                                }
                                                className="p-2 text-muted hover:text-heading"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="min-w-10 text-center text-sm font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onUpdateQuantity(
                                                        item.product.id,
                                                        item.unitId,
                                                        1
                                                    )
                                                }
                                                className="p-2 text-muted hover:text-heading"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <p className="font-semibold text-heading">
                                            {formatCurrency(
                                                item.product.selling_price *
                                                    item.quantity
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

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
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-muted">Total</p>
                    <p className="text-2xl font-semibold text-heading">
                        {formatCurrency(total)}
                    </p>
                </div>
                <Button
                    variant="primary"
                    type="button"
                    onClick={onCompleteSale}
                    disabled={!cartItems.length || isPending}
                >
                    {isPending ? 'Processing...' : 'Complete sale'}
                </Button>
            </div>
        </div>
    )
}
