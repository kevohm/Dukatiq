import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { TextInput } from '../../../components/ui/TextInput'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'

import LoadingSection from '../../../components/shared/LoadingSection'
import BackButton from '../../../components/shared/BackButton'

import type { ApiError } from '../../../errors/error'
import type { IExpenseUpdatePayload } from '../types'

import { useExpense, useUpdateExpense } from '../hooks'
import { useExpenseCategories } from '../category/hooks'

interface Props {
    id: string
}

const EditExpenseForm: React.FC<Props> = ({ id }) => {
    const expenseQuery = useExpense(id)
    const categoryQuery = useExpenseCategories()

    const { mutateAsync, isPending } = useUpdateExpense()

    const navigate = useNavigate()

    const [errors, setErrors] = useState<Record<string, string>>({})

    const [body, setBody] = useState<IExpenseUpdatePayload>({
        name: '',
        category_id: '',
        amount: 0,
    })

    useEffect(() => {
        if (!expenseQuery.data) return

        setBody({
            name: expenseQuery.data.name,
            category_id: expenseQuery.data.category_id,
            amount: expenseQuery.data.amount,
        })
    }, [expenseQuery.data])

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

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await mutateAsync({
                id,
                data: body,
            })

            navigate({
                to: '/expenses',
                search: { q: body?.name },
            })
        } catch (error) {
            const err = (error as ApiError)?.errors

            if (err) {
                setErrors(err)
            }
        }
    }

    if (expenseQuery.isLoading) {
        return <LoadingSection />
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

            <Select
                label="Category"
                name="category_id"
                value={body.category_id}
                disabled={categoryQuery.isLoading}
                onChange={(e) => changeBody(e.target)}
                options={categoryQuery.data?.data?.map((c:any) => ({
                    label: c.name,
                    value: c.id,
                }))}
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

                    {isPending ? 'Updating Expense' : 'Update Expense'}
                </Button>
            </div>
        </form>
    )
}

export default EditExpenseForm
