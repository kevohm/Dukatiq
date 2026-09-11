import React, {  useState } from 'react'
import { Loader } from 'lucide-react'

import { TextInput } from '../../../components/ui/TextInput'
import { Button } from '../../../components/ui/Button'

import type { ApiError } from '../../../errors/error'
import toast from 'react-hot-toast'
import { useNavigate } from '@tanstack/react-router'
import { Select } from '@/components/ui/Select'
import type {  IRecoveryQuestionsPayload } from '../types'
import { useSetRecoveryQeustions } from '../hooks'

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

const RecoveryQuestionForm = () => {
    const { mutateAsync, isPending } = useSetRecoveryQeustions()
    const navigate = useNavigate()

    const [errors, setErrors] = useState<Record<string, string>>({})


    const [body, setBody] = useState<IRecoveryQuestionsPayload>([
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
    ])



    const answerRecoveryQuestion = (index: number, value: string) => {
        setBody((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          answer: value,
                      }
                    : item
            )
        )
    }

    const changeRecoveryQuestion = (
        index: number,
        question: string,
        code: string
    ) => {
        setBody((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                          ...item,
                          question,
                          code,
                      }
                    : item
            )
        )
    }


    const getError = (field: string) => errors[field]



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        // console.log(body)

        const incompleteQuestions = body.some(
            (item) => !item.question || !item.answer.trim()
        )

        if (incompleteQuestions) {
            toast.error('Please complete all recovery questions')
            return
        }

        const questions = body.map((item) => item.question)

        const uniqueQuestions = new Set(questions)

        if (uniqueQuestions.size !== 2) {
            toast.error('Please choose 2 different recovery questions')
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

    const getQuestionOptions = (currentIndex: number) => {
        const selectedCodes = body.filter((_, index) => index !== currentIndex)
            .map((q) => q.code)
            .filter(Boolean)

        return offlineSecurityQuestions.filter(
            (option) =>
                option.value === body[currentIndex].code ||
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
            {body?.length && body.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <Select
                            containerClassName="col-span-full"
                            label={`Recovery Question ${index + 1}`}
                            value={
                                body[index]?.code ??
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

                    {isPending ? 'Saving' : 'Save Questions'}
                </Button>
            </div>
        </form>
    )
}

export default RecoveryQuestionForm
