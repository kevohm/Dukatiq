

import { X } from 'lucide-react'
import { Dialog } from 'radix-ui'

import { CartHeader } from './CartHeader'
import { CartContent } from './CartContent'
import type { ICartActionPayload } from '@/app/providers/CartProvider/CartProvider'
import type { SalePaymentMethod } from '../../types'


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


type SalesCartDrawerProps = SalesCartProps & {
    isOpen: boolean
    onClose: () => void
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
