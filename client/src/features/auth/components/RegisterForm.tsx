import React, { useState } from 'react'
import { Loader } from 'lucide-react'

import { TextInput } from '../../../components/ui/TextInput'
import { Button } from '../../../components/ui/Button'

import type { ApiError } from '../../../errors/error'
import { useSignup } from '../hooks'
import type {  ISignupPayload } from '../types'
import toast from 'react-hot-toast'
import { useNavigate } from '@tanstack/react-router'

const RegisterForm = () => {
    const { mutateAsync, isPending } = useSignup()
    const navigate = useNavigate()

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [confirmPass, setConfirmPass] = useState("")

    const [body, setBody] = useState<ISignupPayload>({
        first_name:"",
        last_name:"",
        email: '',
        password: '',
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
        const { name, value } = e.target

        changeBody({
            name,
            value,
        })

        resetError(name)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(confirmPass !== body?.password){
            setErrors(err=>({...err, "confirm-password":"Passwords do not match"}))
            return
        }
        try {
            await mutateAsync(body)
              toast.success("Account created. Login ot proceed")
            navigate({ to: '/login' })
        } catch (error) {
                  const apiErr = (error as ApiError)
            const err = apiErr?.errors
            if(apiErr?.message){
                toast.error(apiErr?.message)
            }
            
            if (err) {
                setErrors(err)
            }
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col md:grid md:grid-cols-2  gap-5 max-w-lg w-full"
        >
            <TextInput
                label="First Name"
                name="first_name"
                value={body.first_name}
                onChange={handleChange}
                error={getError('first_name')}
                required
            />
            <TextInput
                label="Last Name"
                name="last_name"
                value={body.last_name}
                onChange={handleChange}
                error={getError('last_name')}
                required
            />
            <TextInput
                containerClassName="col-span-full"
                label="Email"
                name="email"
                value={body.email}
                onChange={handleChange}
                error={getError('email')}
                required
            />
            <TextInput
                containerClassName="col-span-full"
                label="Password"
                name="password"
                type="password"
                required
                value={body.password}
                onChange={(e)=>{
                    handleChange(e)
                    resetError('confirm-password')
                }}
                error={getError('password')}
            />
            <TextInput
                containerClassName="col-span-full"
                label="Confirm Password"
                name="consfirm-password"
                type="password"
                required
                value={confirmPass}
                onChange={(e)=>{
                    setConfirmPass(e.target.value)
                    resetError('confirm-password')
                }}
                error={getError('confirm-password')}
            />

            <div className="flex items-center justify-between w-full col-span-full ">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full flex items-center justify-center"
                >
                    {isPending && <Loader className="w-4 h-4 animate-spin" />}

                    {isPending ? 'Registering' : 'Register'}
                </Button>
            </div>
        </form>
    )
}

export default RegisterForm
