import React, { useEffect,  useState } from 'react'
import { Loader } from 'lucide-react'

import { TextInput } from '../../../components/ui/TextInput'
import { Button } from '../../../components/ui/Button'

import type { ApiError } from '../../../errors/error'
import { useSetOfflinePassword } from '../hooks'
import toast from 'react-hot-toast'
import {  useNavigate } from '@tanstack/react-router'
import type { ILocalAccessPayload} from '../types'
import { useAuth } from '@/app/providers/AuthProvider'

export const offlineSecurityQuestions = [
    {
        value: 'first_pet_name',
        label: 'What was the name of your first pet?',
    },
    {
        value: 'first_job',
        label: 'What was your first job?',
    },
    {
        value: 'childhood_friend',
        label: 'What was the name of your childhood best friend?',
    },
    {
        value: 'favorite_teacher',
        label: 'What was the name of your favorite teacher?',
    },
    {
        value: 'birth_city',
        label: 'What city were you born in?',
    },
    {
        value: 'favorite_food',
        label: 'What is your favorite food?',
    },
    {
        value: 'mother_maiden_name',
        label: "What is your mother's maiden name?",
    },
]

const OfflinePasswordForm = () => {
    const { mutateAsync, isPending } = useSetOfflinePassword()
    const navigate = useNavigate()
    const { user} = useAuth()

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [confirmPass, setConfirmPass] = useState('')

    const [body, setBody] = useState<ILocalAccessPayload>({
        full_name: '',
        email: '',
        password: ''
    })

    useEffect(() => {
        if (user) {
            setBody((prev) => ({
                ...prev,
                full_name: user.full_name,
                email: user.email,
            }))
        }
    }, [user])


    const resetError = (field: string) => {
        setErrors((prev) => ({
            ...prev,
            [field]: '',
        }))
    }

    const getError = (field: string) => errors[field]

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBody((prev) => ({
            ...prev,
            password: e.target.value,
        }))

        resetError('password')
        resetError('confirm-password')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
       

        if (confirmPass !== body.password) {
            setErrors((prev) => ({
                ...prev,
                'confirm-password': 'Passwords do not match',
            }))
            return
        }


        try {
            await mutateAsync(body)

            toast.success('Local access enabled successfully')

            navigate({
                to: '/',
            })
        } catch (error) {
            const apiErr = error as ApiError

            if (apiErr?.message) {
                toast.error(apiErr.message)
            }

            if (apiErr?.errors) {
                setErrors(apiErr.errors)
            }
        }
    }



    return (
        <form
            onSubmit={handleSubmit}
            className="
                flex 
                flex-col 
                md:grid 
                md:grid-cols-2 
                gap-5 
                max-w-lg 
                w-full
            "
        >

            <TextInput
                containerClassName="col-span-full"
                label="Password"
                name="password"
                type="password"
                value={body.password}
                onChange={handlePasswordChange}
                error={getError('password')}
                required
            />

            <TextInput
                containerClassName="col-span-full"
                label="Confirm Password"
                name="confirm-password"
                type="password"
                value={confirmPass}
                onChange={(e) => {
                    setConfirmPass(e.target.value)
                    resetError('confirm-password')
                }}
                error={getError('confirm-password')}
                required
            />

            <div className="flex items-center justify-between w-full col-span-full">
                <Button
                    type="submit"
                    variant="primary"
                    className="
                        w-full 
                        flex 
                        items-center 
                        justify-center
                    "
                >
                    {isPending && (
                        <Loader
                            className="
                                w-4 
                                h-4 
                                animate-spin
                            "
                        />
                    )}

                    {isPending ? 'Saving' : 'Enable Local Access'}
                </Button>
            </div>
        </form>
    )
}

export default OfflinePasswordForm
