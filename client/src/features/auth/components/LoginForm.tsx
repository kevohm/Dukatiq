import React, {  useState } from 'react'
import { Loader } from 'lucide-react'

import { TextInput } from '../../../components/ui/TextInput'
import { Button } from '../../../components/ui/Button'

import type { ApiError } from '../../../errors/error'
import { useLogin } from '../hooks'
import type { ILoginPayload } from '../types'
import toast from 'react-hot-toast'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/app/providers/AuthProvider'
import { localAccessService } from '@/data/service'

const LoginForm = () => {
    const { mutateAsync, isPending } = useLogin()
    const { getCurrentUser} = useAuth()

    const navigate = useNavigate()

    const [errors, setErrors] = useState<Record<string, string>>({})

    const [body, setBody] = useState<ILoginPayload>({
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

        try {
            // set active offline user
            await mutateAsync(body)
            await getCurrentUser()

            const hasLocalAccess = await localAccessService.checkForUserLocalAccess()
            // const isSessionExpired = await localSessionService.hasSessionExpired()
            
            toast.success('Login successfull. Redirecting...')
            navigate({
                to:
                    hasLocalAccess 
                        ? '/'
                        : '/local-access',
            })
        } catch (error) {
            const apiErr = error as ApiError
            const err = apiErr?.errors
            if (apiErr?.message) {
                toast.error(apiErr?.message)
            }
            if (err) {
                setErrors(err)
            }
        }
    }
    // const getData = async () => {
    //     const user = await userService.getActiveUser()
    //     console.log(user)
    //     if (user?.id) {
    //         const session = await localSessionService.getSession(user?.id)
    //         console.log(session)
    //     }
    // }
    // useEffect(() => {
    //     getData()
    // }, [])
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col  gap-5 max-w-lg w-full"
        >
            <TextInput
                label="Email"
                name="email"
                value={body.email}
                onChange={handleChange}
                error={getError('email')}
                required
            />
            <TextInput
                label="Password"
                name="password"
                type="password"
                required
                value={body.password}
                onChange={handleChange}
                error={getError('password')}
            />

            <div className="flex items-center justify-between w-full ">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full flex items-center justify-center"
                >
                    {isPending && <Loader className="w-4 h-4 animate-spin" />}

                    {isPending ? 'Logging in' : 'Login'}
                </Button>
            </div>
        </form>
    )
}

export default LoginForm
