import React, { useEffect,  useState } from 'react'
import { Loader } from 'lucide-react'

import { TextInput } from '../../../components/ui/TextInput'
import { Button } from '../../../components/ui/Button'

import type { ApiError } from '../../../errors/error'
import { useSetOfflinePassword } from '../hooks'
import toast from 'react-hot-toast'
import {  useNavigate } from '@tanstack/react-router'
import { Select } from '@/components/ui/Select'
import type { ILocalAccessPayload} from '../types'
import { useAuth } from '@/app/providers/AuthProvider'
import LoadingSection from '@/components/shared/LoadingSection'

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
    const { user, status } = useAuth()

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [confirmPass, setConfirmPass] = useState('')

    const [body, setBody] = useState<ILocalAccessPayload>({
        full_name: '',
        email: '',
        password: '',
        recoveryQuestions: [
            {
                question: '',
                answer: '',
                code: '',
            },
            {
                question: '',
                answer: '',
                code: '',
            },
        ],
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

    const answerRecoveryQuestion = (index: number, value: string) => {
        setBody((prev) => ({
            ...prev,
            recoveryQuestions: prev.recoveryQuestions.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          answer: value,
                      }
                    : item
            ),
        }))
    }

    const changeRecoveryQuestion = (
        index: number,
        question: string,
        code: string
    ) => {
        setBody((prev) => ({
            ...prev,
            recoveryQuestions: prev.recoveryQuestions.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          question,
                          code,
                      }
                    : item
            ),
        }))
    }

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

        // console.log(body)

        const incompleteQuestions = body.recoveryQuestions.some(
            (item) => !item.question || !item.answer.trim()
        )

        if (incompleteQuestions) {
            toast.error('Please complete all recovery questions')
            return
        }

        const questions = body.recoveryQuestions.map((item) => item.question)

        const uniqueQuestions = new Set(questions)

        if (uniqueQuestions.size !== 2) {
            toast.error('Please choose 2 different recovery questions')
            return
        }

        try {
            await mutateAsync(body)

            toast.success('Local access enabled successfully')

            navigate({
                to: '/login',
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

    if (status === 'loading') {
        return <LoadingSection />
    }

     if (!user) {
         navigate({ to: '/login' })
         return
     }

    const getQuestionOptions = (currentIndex: number) => {
        const selectedCodes = body.recoveryQuestions
            .filter((_, index) => index !== currentIndex)
            .map((q) => q.code)
            .filter(Boolean)

        return offlineSecurityQuestions.filter(
            (option) =>
                option.value === body.recoveryQuestions[currentIndex].code ||
                !selectedCodes.includes(option.value)
        )
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
            {body.recoveryQuestions.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <Select
                            containerClassName="col-span-full"
                            label={`Recovery Question ${index + 1}`}
                            value={
                                body?.recoveryQuestions[index]?.code ??
                                undefined
                            }
                            onChange={(e) => {
                                // console.log(index, e.target.value)

                                const question = offlineSecurityQuestions.find(
                                    (q) => q.value === e.target.value
                                )?.label

                                if (!question) return

                                changeRecoveryQuestion(
                                    index,
                                    question,
                                    e.target.value
                                )
                            }}
                            options={[
                                ...getQuestionOptions(index),
                                {
                                    value: '',
                                    label: 'Select a question',
                                },
                            ]}
                            error={getError(`question-${index}`)}
                            required
                        />

                        <TextInput
                            containerClassName="col-span-full"
                            label={`Recovery Answer ${index + 1}`}
                            name={`answer-${index}`}
                            type="text"
                            value={item.answer}
                            onChange={(e) =>
                                answerRecoveryQuestion(index, e.target.value)
                            }
                            error={getError(`answer-${index}`)}
                            required
                        />
                    </React.Fragment>
                )
            })}

            <TextInput
                containerClassName="col-span-full"
                label="Local Access Password"
                name="password"
                type="password"
                value={body.password}
                onChange={handlePasswordChange}
                error={getError('password')}
                required
            />

            <TextInput
                containerClassName="col-span-full"
                label="Confirm Local Access Password"
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
