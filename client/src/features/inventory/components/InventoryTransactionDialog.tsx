import { useMemo, useState, type FormEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import toast from 'react-hot-toast'
import { Button } from '../../../components/ui/Button'
import { Select } from '../../../components/ui/Select'
import { TextInput } from '../../../components/ui/TextInput'
import { useProducts } from '../../product/hooks'
import { useAdjustStock, useStockIn, useStockOut } from '../hooks'
import type { InventoryAdjustmentType, InventoryEventType } from '../types'

const movementOptions = [
    { value: 'stock_in', label: 'Stock in (restock)' },
    // { value: 'stock_out', label: 'Stock out' },
    { value: 'adjustment', label: 'Manual adjustment' },
]

export function InventoryTransactionDialog() {
    const [open, setOpen] = useState(false)
    const [movementType, setMovementType] =
        useState<InventoryEventType>('stock_in')
    const [adjustmentType, setAdjustmentType] =
        useState<InventoryAdjustmentType>('increase')
    const [productId, setProductId] = useState('')
    const [unitId, setUnitId] = useState('')
    const [quantity, setQuantity] = useState('')
    const { data: products = [], isLoading: isLoadingProducts } = useProducts()
    const stockIn = useStockIn()
    const stockOut = useStockOut()
    const adjustStock = useAdjustStock()

    const selectedProduct = useMemo(
        () => products.find((product) => product.id === productId),
        [products, productId]
    )
    const units = selectedProduct?.productUnits ?? []
    const isPending =
        stockIn.isPending || stockOut.isPending || adjustStock.isPending

    const reset = () => {
        setMovementType('stock_in')
        setAdjustmentType('increase')
        setProductId('')
        setUnitId('')
        setQuantity('')
    }

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) reset()
    }

    const handleProductChange = (nextProductId: string) => {
        setProductId(nextProductId)
        const product = products.find((item) => item.id === nextProductId)
        const defaultUnit =
            product?.productUnits?.find((unit) => unit.is_base_unit) ??
            product?.productUnits?.[0]
        setUnitId(defaultUnit?.id ?? '')
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const numericQuantity = Number(quantity)
        if (
            !productId ||
            !unitId ||
            !Number.isFinite(numericQuantity) ||
            numericQuantity <= 0
        ) {
            toast.error(
                'Select a product and unit, then enter a quantity greater than zero.'
            )
            return
        }

        const payload = {
            product_id: productId,
            unit_id: unitId,
            quantity: numericQuantity,
        }

        console.log(payload)

        try {
            if (movementType === 'stock_in') await stockIn.mutateAsync(payload)
            // if (movementType === 'stock_out') await stockOut.mutateAsync(payload)
            if (movementType === 'adjustment') {
                await adjustStock.mutateAsync({
                    ...payload,
                    adjustment_type: adjustmentType,
                })
            }
            toast.success('Inventory movement recorded.')
            handleOpenChange(false)
        } catch {
            toast.error('Unable to record the inventory movement.')
        }
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <Button variant="primary" icon={<Plus size={16} />}>
                    Record movement
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-5 shadow-2xl">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Dialog.Title className="text-lg font-semibold text-heading">
                                Record inventory movement
                            </Dialog.Title>
                            <Dialog.Description className="mt-1 text-sm text-muted">
                                Add stock, remove stock, or make a manual
                                adjustment.
                            </Dialog.Description>
                        </div>
                        <Dialog.Close asChild>
                            <button
                                type="button"
                                className="rounded-lg p-2 text-muted hover:bg-hover hover:text-heading"
                                aria-label="Close dialog"
                            >
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                        <Select
                            label="Movement"
                            value={movementType}
                            onChange={(event) =>
                                setMovementType(
                                    event.target.value as InventoryEventType
                                )
                            }
                            options={movementOptions}
                        />
                        {movementType === 'adjustment' && (
                            <Select
                                label="Adjustment direction"
                                value={adjustmentType}
                                onChange={(event) =>
                                    setAdjustmentType(
                                        event.target
                                            .value as InventoryAdjustmentType
                                    )
                                }
                                options={[
                                    {
                                        value: 'increase',
                                        label: 'Increase stock',
                                    },
                                    {
                                        value: 'decrease',
                                        label: 'Decrease stock',
                                    },
                                ]}
                            />
                        )}
                        <Select
                            label="Product"
                            placeholder={
                                isLoadingProducts
                                    ? 'Loading products...'
                                    : 'Select product'
                            }
                            value={productId}
                            onChange={(event) =>
                                handleProductChange(event.target.value)
                            }
                            options={products.map((product) => ({
                                value: product.id,
                                label: product.name,
                            }))}
                            disabled={isLoadingProducts}
                        />
                        <Select
                            label="Unit"
                            placeholder="Select unit"
                            value={unitId}
                            onChange={(event) => setUnitId(event.target.value)}
                            options={units.map((unit) => ({
                                value: unit?.unit?.id,
                                label: unit.unit?.name ?? 'Unit',
                            }))}
                            disabled={!selectedProduct}
                        />
                        <TextInput
                            label="Quantity"
                            type="number"
                            min="0.0001"
                            step="any"
                            value={quantity}
                            onChange={(event) =>
                                setQuantity(event.target.value)
                            }
                            required
                        />
                        <div className="flex justify-end gap-3 pt-1">
                            <Dialog.Close asChild>
                                <Button type="button">Cancel</Button>
                            </Dialog.Close>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? 'Saving...' : 'Save movement'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
