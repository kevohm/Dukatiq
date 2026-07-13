import React, { useState } from 'react'
import { Loader } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { TextInput } from '../../../components/ui/TextInput'
import { Button } from '../../../components/ui/Button'
import BackButton from '../../../components/shared/BackButton'

import type { ApiError } from '../../../errors/error'
import type { IExpenseCreatePayload } from '../types'

import { useCreateExpense } from '../hooks'

const AddExpenseForm = () => {
    const { mutateAsync, isPending } = useCreateExpense()

    const navigate = useNavigate()

    const [errors, setErrors] = useState<Record<string, string>>({})

    const [body, setBody] = useState<IExpenseCreatePayload>({
        name: '',
        category: '',
        amount: 0,
    })

    const changeBody = ({
        name,
        value,
    }: {
        name: string
        value: string | number
    }) => {
        setBody((b) => ({
            ...b,
            [name]: value,
        }))
    }

    const resetError = (field: string) => {
        setErrors((e) => ({
            ...e,
            [field]: '',
        }))
    }

    const getError = (field: string) => errors[field]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target

        changeBody({
            name,
            value: type === 'number' ? Number(value) : value,
        })

        resetError(name)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await mutateAsync(body)
            navigate({ to: '/expenses' })
        } catch (error) {
            const err = (error as ApiError)?.errors

            if (err) {
                setErrors(err)
            }
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col md:grid md:grid-cols-2 gap-5"
        >
            <TextInput
                label="Expense Name"
                name="name"
                value={body.name}
                onChange={handleChange}
                error={getError('name')}
                required
            />

            {/* <Select
                label="Category"
                name="category"
                value={body.category}
                disabled={categoryQuery.isLoading}
                onChange={(e) => changeBody(e.target)}
                options={categoryQuery.data?.map((c) => ({
                    label: c.name,
                    value: c.id,
                }))}
            /> */}
            <TextInput
                label="Category"
                name="category"
                value={body.category}
                onChange={handleChange}
                error={getError('category')}
            />

            <TextInput
                label="Amount"
                name="amount"
                type="number"
                value={body.amount}
                onChange={handleChange}
                error={getError('amount')}
            />

            <div className="flex items-center justify-between col-span-full">
                <BackButton label="Cancel" />

                <Button type="submit" variant="primary">
                    {isPending && <Loader className="w-4 h-4 animate-spin" />}

                    {isPending ? 'Adding Expense' : 'Add Expense'}
                </Button>
            </div>
        </form>
    )
}

export default AddExpenseForm
