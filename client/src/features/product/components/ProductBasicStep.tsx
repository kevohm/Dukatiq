import type { ChangeEvent } from 'react'
import { TextInput } from '../../../components/ui/TextInput'
import type { IProductCreatePayload } from '../types'
import { TextArea } from '../../../components/ui/TextArea'

type ProductFormBody = IProductCreatePayload & {
    description?: string
    minimum_stock?: number
    sku?: string
    barcode?: string
}

type ProductBasicStepProps = {
    body: ProductFormBody
    errors: Record<string, string>
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function ProductBasicStep({
    body,
    errors,
    onChange,
}: ProductBasicStepProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2">
            <TextInput
                label="Product name"
                name="name"
                required
                value={body.name}
                error={errors.name}
                onChange={onChange}
            />
            <TextInput
                label="Category"
                name="category"
                required
                value={body.category}
                error={errors.category}
                onChange={onChange}
            />
            <TextInput
                label="Brand"
                name="brand"
                required
                value={body.brand}
                error={errors.brand}
                onChange={onChange}
            />
            <div className="md:col-span-2">
                <TextArea
                    label="Description"
                    name="description"
                    value={body.description ?? ''}
                    error={errors.description}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}
