import React, { useState } from 'react'
import { TextInput } from '../../../components/ui/TextInput'
import { useCreateProduct } from '../hooks'
import { Button } from '../../../components/ui/Button'
import { useNavigate, useRouter } from '@tanstack/react-router'
import BackButton from '../../../components/shared/BackButton'

const AddProductForm = () => {
    const { mutateAsync, isPending, isError, error } = useCreateProduct()
    const navigate = useNavigate()
    const [body, setBody] = useState({
        name: '',
    })

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await mutateAsync(body)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <form onSubmit={handleSubmit} className='flex flex-col space-y-5'>
            <TextInput
                label="name"
                required
                error={error?.message}
                onChange={(e) =>
                    setBody((b) => ({ ...b, name: e.target.value }))
                }
            />
            <div className="flex items-center justify-between">
                <BackButton label="Cancel" />
                <Button variant='primary' type="submit">Add Product</Button>
            </div>
        </form>
    )
}

export default AddProductForm
