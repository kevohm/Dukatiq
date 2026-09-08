import type { ChangeEvent } from 'react'
import { TextInput } from '../../../components/ui/TextInput'
import type { IProductCreatePayload } from '../types'

type ProductFormBody = IProductCreatePayload & {
    description?: string
    minimum_stock?: number
    sku?: string
    barcode?: string
}

type ProductPricingStepProps = {
    body: ProductFormBody
    errors: Record<string, string>
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function ProductPricingStep({
    body,
    errors,
    onChange,
}: ProductPricingStepProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2">
            <TextInput
                label="Buying price"
                name="cost_price"
                type="number"
                required
                value={body.cost_price}
                error={errors.cost_price}
                onChange={onChange}
            />
            <TextInput
                label="Selling price"
                name="selling_price"
                type="number"
                required
                value={body.selling_price}
                error={errors.selling_price}
                onChange={onChange}
            />
            <TextInput
                label="Minimum stock"
                name="minimum_stock"
                type="number"
                value={body.minimum_stock ?? 0}
                error={errors.minimum_stock}
                onChange={onChange}
            />
            <TextInput
                label="SKU"
                name="sku"
                value={body.sku ?? ''}
                error={errors.sku}
                onChange={onChange}
            />
            <TextInput
                label="Barcode"
                name="barcode"
                value={body.barcode ?? ''}
                error={errors.barcode}
                onChange={onChange}
            />
        </div>
    )
}
