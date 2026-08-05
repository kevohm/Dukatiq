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
import { formatCurrency } from '@/utils/currency'
import {
    useCart,
    type ICartActionPayload,
} from '@/app/providers/CartProvider/CartProvider'
import { useMemo } from 'react'

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
            <CartHeader />
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
                    <div className="flex flex-col items-center justify-between border-b border-border dark:border-slate-900 px-4 py-3">
                        <div className="w-full flex items-start justify-end-safe">
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
                        <div className="w-full">
                            <Dialog.Title className="text-base font-semibold tracking-tight text-heading dark:text-slate-500 sr-only">
                                Cart
                            </Dialog.Title>
                            <Dialog.Description className="mt-0 text-xs text-muted sr-only">
                                Review current items before checkout.
                            </Dialog.Description>
                            <CartHeader />
                        </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                        <CartContent {...props} />
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

function CartHeader() {
    return (
        <CardHeader className=" px-4 py-3 flex-col gap-3">
            <CardTitle className="w-full text-base flex items-center justify-between gap-2.5">
                <CartTitle />
            </CardTitle>
            <CardDescription className="w-full flex justify-between">
                <CartDescription />
            </CardDescription>
        </CardHeader>
    )
}

function CartTitle() {
    const { cartStore, changeActiveCart, addNewCart } = useCart()

    return (
        <div className="w-full text-base flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-3">
                {Object.values(cartStore?.carts ?? {})?.map((cart, idx) => {
                    const isAcitve = cartStore?.activeCartId === cart?.id
                    return (
                        <Button
                            key={cart?.id}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                changeActiveCart({
                                    cart_id: cart?.id,
                                })
                            }}
                            className="ease-in-out transition-all duration-200 outline-none ring-none capitalize"
                            variant={isAcitve ? 'primary' : 'secondary'}
                        >
                            cart {idx + 1}
                        </Button>
                    )
                })}

                <Button
                    type="button"
                    variant="ghost"
                    className="block md:hidden"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={(e) => {
                        e.preventDefault()
                        addNewCart()
                    }}
                />
            </div>
            <Button
                type="button"
                variant="ghost"
                className="md:block hidden"
                icon={<Plus className="w-4 h-4" />}
                onClick={(e) => {
                    e.preventDefault()
                    addNewCart()
                }}
            />
        </div>
    )
}

function CartDescription() {
    const { cartStore } = useCart()
    const itemCount =
        cartStore?.carts?.[cartStore?.activeCartId]?.items?.length ?? 0

    return (
        <div className="w-full flex flex-wrap gap-2.5 justify-between">
            <span className="text-xs text-muted">
                Choose a cart or add multiple
            </span>
            <span className="text-xs text-muted">{itemCount} item(s)</span>
        </div>
    )
}

function CartContent({
    paymentMethod,
    total,
    isPending,
    onPaymentMethodChange,
    onUpdateQuantity,
    onRemoveItem,
    onCompleteSale,
    formatCurrency,
}: SalesCartProps) {
    const { cartStore } = useCart()
    const cartItems = cartStore?.carts[cartStore?.activeCartId]?.items
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

const CartCard: React.FC<{
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
