import React, { useState } from 'react'
import { Loader } from 'lucide-react'
import toast from 'react-hot-toast'

import { TextInput } from '../../../components/ui/TextInput'
import { Button } from '../../../components/ui/Button'

import type { ApiError } from '../../../errors/error'
import { useVerifyOfflinePassword } from '../hooks'
import { useAuth } from '@/app/providers/AuthProvider'


interface OfflinePasswordVerificationFormProps {
    onSuccess?: () => void
}

const OfflinePasswordVerificationForm = ({
    onSuccess,
}: OfflinePasswordVerificationFormProps) => {
    const {user} = useAuth()

    const { mutateAsync, isPending } = useVerifyOfflinePassword()

    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError('')

        if (!password.trim()) {
            setError('Password is required')
            return
        }
        if(!user?.id){
              setError('Invalid session')
              return
        }

        try {
            await mutateAsync({
                password,
                user_id: user?.id
            })

            toast.success('Access granted')

            onSuccess?.()
        } catch (error) {
            const apiError = error as ApiError

            if (apiError.message) {
                toast.error(apiError.message)
            }

            setError(apiError.message ?? 'Invalid local access password')
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="
                flex
                flex-col
                gap-5
                max-w-md
                w-full
            "
        >
            <TextInput
                label="Local Access Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                }}
                error={error}
                required
            />

            <Button
                type="submit"
                variant="primary"
                disabled={isPending}
                className="
                    w-full
                    flex
                    justify-center
                    items-center
                    gap-2
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

                {isPending ? 'Checking...' : 'Unlock Offline Access'}
            </Button>
        </form>
    )
}

export default OfflinePasswordVerificationForm
