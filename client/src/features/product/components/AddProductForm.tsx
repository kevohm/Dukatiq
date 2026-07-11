import React, { useState } from 'react'
import { TextInput } from '../../../components/ui/TextInput'
import { useCreateProduct, useProduct } from '../hooks'
import { Button } from '../../../components/ui/Button'
import { useNavigate, useRouter } from '@tanstack/react-router'
import BackButton from '../../../components/shared/BackButton'
import type { ApiError, ErrorResponse } from '../../../errors/error'
import {
    Loader,
    Loader2,
    Loader2Icon,
    LoaderCircle,
    LoaderPinwheel,
} from 'lucide-react'
import type { IProductCreatePayload, Product } from '../types'



const AddProductForm = () => {
    const { mutateAsync, isPending, isError, error } = useCreateProduct()
    const navigate = useNavigate()
    const [errors, setErrors] = useState<Record<string, string>>({})


    const [body, setBody] = useState<IProductCreatePayload>({
        name:  '',
        category: '',
        brand: '',
        cost_price: 0,
        selling_price: 0,
    })

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            // console.log(body)
            await mutateAsync(body)
            navigate({ to: '/products' })
        } catch (error) {
            const err = (error as ApiError)?.errors
            if (err) {
                setErrors(err)
            }
        }
    }
    const getError = (field: string) => errors[field]
    const resetError = (field: string) => {
        setErrors((e) => ({ ...e, [field]: '' }))
    }
    const changeBody = ({
        name,
        value,
    }: {
        name: string
        value: string | number
    }) => {
        setBody((b) => ({ ...b, [name]: value }))
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target
        const parsedValue = type === 'number' ? (Number(value) ?? 0) : value

        changeBody({
            name,
            value: parsedValue,
        })
        resetError(name)
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col md:grid  md:grid-cols-2 gap-5"
        >
            <TextInput
                label="name"
                name="name"
                required
                error={getError('name')}
                onChange={handleChange}
            />
            <TextInput
                label="category"
                name="category"
                required
                error={getError('category')}
                onChange={handleChange}
            />

            <TextInput
                label="brand"
                name="brand"
                required
                error={getError('brand')}
                onChange={handleChange}
            />

            <TextInput
                label="selling price"
                name="selling_price"

                error={getError('selling_price')}
                type="number"
                onChange={handleChange}
            />
            <TextInput
                label="buying price"
                name="cost_price"

                type="number"
                error={getError('cost_price')}
                onChange={handleChange}
            />
            {/* <TextInput
                label="Initial stock"
                name="stock_quantity"
                type="number"
                error={getError('stock_quantity')}
                onChange={handleChange}
            /> */}
            <div className="flex items-center justify-between col-span-full">
                <BackButton label="Cancel" />
                <Button variant="primary" type="submit">
                    {isPending && (
                        <Loader className="w-4 h-4 animate-spin ease-in-out " />
                    )}
                    {isPending ? 'Adding Product' : 'Add Product'}
                </Button>
            </div>
        </form>
    )
}

export default AddProductForm
