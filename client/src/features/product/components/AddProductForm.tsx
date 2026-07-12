import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import BackButton from '../../../components/shared/BackButton'
import type { ApiError } from '../../../errors/error'
import { useCreateProduct } from '../hooks'
import type { IProductCreatePayload } from '../types'
import { AddProductStepper } from './AddProductStepper'
import { ProductBasicStep } from './ProductBasicStep'
import { ProductPricingStep } from './ProductPricingStep'
import { ProductStepFooter } from './ProductStepFooter'
import { ProductUnitsStep } from './ProductUnitsStep'
import { ProductReviewStep } from './ProductReviewStep'


const steps = ['Basic info', 'Pricing', 'Units', 'Review'] as const

type ProductFormBody = IProductCreatePayload & {
    description?: string
    minimum_stock?: number
    sku?: string
    barcode?: string
    units?: Array<{
        unit_name: string
        conversion_factor: number
        is_base_unit: boolean
    }>
}

const AddProductForm = () => {
    const { mutateAsync, isPending } = useCreateProduct()
    const navigate = useNavigate()
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [stepIndex, setStepIndex] = useState(0)

    const [body, setBody] = useState<ProductFormBody>({
        name: '',
        category: '',
        brand: '',
        cost_price: 0,
        selling_price: 0,
        units: [
            {
                unit_name: 'Piece',
                conversion_factor: 1,
                is_base_unit: true,
            },
        ],
    })

    const currentStep = steps[stepIndex]

    const changeBody = ({
        name,
        value,
    }: {
        name: string
        value: string | number
    }) => {
        setBody((b) => ({ ...b, [name]: value }))
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = event.target
        const parsedValue = type === 'number' ? (Number(value) ?? 0) : value

        changeBody({ name, value: parsedValue })
        setErrors((e) => ({ ...e, [name]: '' }))
    }

    const nextStep = () => {
        if (stepIndex === 0) {
            const required = ['name', 'category', 'brand']
            const missing = required.filter(
                (field) =>
                    !String(body[field as keyof ProductFormBody] ?? '').trim()
            )

            if (missing.length) {
                const nextErrors = Object.fromEntries(
                    missing.map((field) => [
                        field,
                        `${field.replace('_', ' ')} is required`,
                    ])
                )
                setErrors((e) => ({ ...e, ...nextErrors }))
                return
            }
        }

        if (stepIndex === 1) {
            if (body.cost_price <= 0) {
                setErrors((e) => ({
                    ...e,
                    cost_price: 'Buying price must be greater than zero',
                }))
                return
            }

            if (body.selling_price <= 0) {
                setErrors((e) => ({
                    ...e,
                    selling_price: 'Selling price must be greater than zero',
                }))
                return
            }
        }

        setErrors({})
        setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
    }

    const previousStep = () => {
        setErrors({})
        setStepIndex((prev) => Math.max(prev - 1, 0))
    }

    const handleUnitChange = (
        index: number,
        field: 'unit_name' | 'conversion_factor',
        value: string | number
    ) => {
        setBody((prev) => ({
            ...prev,
            units: (prev.units ?? []).map((unit, unitIndex) =>
                unitIndex === index
                    ? {
                          ...unit,
                          [field]:
                              field === 'conversion_factor'
                                  ? Number(value)
                                  : String(value),
                      }
                    : unit
            ),
        }))
    }

    const handleAddUnit = () => {
        setBody((prev) => ({
            ...prev,
            units: [
                ...(prev.units ?? []),
                {
                    unit_name: 'New unit',
                    conversion_factor: 1,
                    is_base_unit: false,
                },
            ],
        }))
    }

    const handleRemoveUnit = (index: number) => {
        setBody((prev) => ({
            ...prev,
            units: (prev.units ?? []).filter(
                (_, unitIndex) => unitIndex !== index
            ),
        }))
    }

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const payload: IProductCreatePayload = {
                name: body.name,
                category: body.category,
                brand: body.brand,
                cost_price: body.cost_price,
                selling_price: body.selling_price,
                units: body.units,
            }
            console.log(payload)
            await mutateAsync(payload)
            navigate({ to: '/products' })
        } catch (error) {
            const err = (error as ApiError)?.errors
            if (err) {
                setErrors(err)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-heading">
                        Create Product ({stepIndex + 1} of {steps.length})
                    </h2>
                    <p className="text-sm text-muted">{currentStep}</p>
                </div>
                <BackButton label="Cancel" />
            </div>

            <AddProductStepper stepIndex={stepIndex} />

            {stepIndex === 0 ? (
                <ProductBasicStep
                    body={body}
                    errors={errors}
                    onChange={handleChange}
                />
            ) : null}

            {stepIndex === 1 ? (
                <ProductPricingStep
                    body={body}
                    errors={errors}
                    onChange={handleChange}
                />
            ) : null}

            {stepIndex === 2 ? (
                <ProductUnitsStep
                    body={body}
                    onUnitChange={handleUnitChange}
                    onAddUnit={handleAddUnit}
                    onRemoveUnit={handleRemoveUnit}
                />
            ) : null}

            {stepIndex === 3 && <ProductReviewStep body={body} />}

            <ProductStepFooter
          
                stepIndex={stepIndex}
                stepCount={steps.length}
                isPending={isPending}
                onPrevious={previousStep}
                onNext={nextStep}
            />
        </form>
    )
}

export default AddProductForm
