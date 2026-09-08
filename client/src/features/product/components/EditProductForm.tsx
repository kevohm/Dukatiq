import React, { useEffect, useState } from 'react'
import { TextInput } from '../../../components/ui/TextInput'
import { useProduct, useUpdateProduct } from '../hooks'
import { Button } from '../../../components/ui/Button'
import { useNavigate } from '@tanstack/react-router'
import BackButton from '../../../components/shared/BackButton'
import type { ApiError } from '../../../errors/error'
import { Loader } from 'lucide-react'
import LoadingSection from '../../../components/shared/LoadingSection'
import type { IProductUpdatePayload } from '../types'
import BrandSelector from '../brand/components/BrandSelector'
import CategorySelector from '../category/components/CategorySelector'

interface props {
    id: string
}
const EditProductForm: React.FC<props> = ({ id }) => {
    const productQuery = useProduct(id)
    const { mutateAsync, isPending } = useUpdateProduct()

    const navigate = useNavigate()
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [body, setBody] = useState<IProductUpdatePayload>({
        name: productQuery?.data?.name ?? '',
        // category: '',
        // brand: '',
        category_id: productQuery?.data?.category_id ?? '',
        brand_id: productQuery?.data?.brand_id ?? '',
        cost_price: productQuery?.data?.cost_price ?? 0,
        selling_price: productQuery?.data?.selling_price ?? 0,
        // stock_quantity: productQuery?.data?.stock_quantity ?? 0,
    })

    useEffect(() => {
        if (!productQuery.data) return
        setBody({
            name: productQuery.data.name,
            category_id: productQuery.data.category_id,
            brand_id: productQuery.data.brand_id,
            cost_price: productQuery.data.cost_price,
            selling_price: productQuery.data.selling_price,
        })
    }, [productQuery.data])
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await mutateAsync({ id, data: body })
            navigate({ to: '/products/view/$id', params: { id } })
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
        const parsedValue = type === 'number' ? Number(value) ?? 0 : value

        changeBody({
            name,
            value: parsedValue,
        })
        resetError(name)
    }

    if (productQuery?.isLoading) {
        return <LoadingSection />
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
                value={body?.name}
                error={getError('name')}
                onChange={handleChange}
            />
            
            <CategorySelector
                value={body?.category_id}
                onChange={(value) => changeBody({ name: 'category_id', value })}
            />
            <BrandSelector
                value={body?.brand_id}
                onChange={(value) =>
                    changeBody({
                        name: 'brand_id',
                        value,
                    })
                }
            />
            <TextInput
                label="selling price"
                name="selling_price"
                value={body?.selling_price}
                error={getError('selling_price')}
                type="number"
                onChange={handleChange}
            />
            <TextInput
                label="buying price"
                name="cost_price"
                value={body?.cost_price}
                type="number"
                error={getError('cost_price')}
                onChange={handleChange}
            />
            <div className="flex items-center justify-between col-span-full">
                <BackButton label="Cancel" />
                <Button variant="primary" type="submit">
                    {isPending && (
                        <Loader className="w-4 h-4 animate-spin ease-in-out " />
                    )}
                    {isPending ? 'Updating Product' : 'Update Product'}
                </Button>
            </div>
        </form>
    )
}

export default EditProductForm
