import RecoveryQuestionForm from '@/features/recovery-questions/components/RecoveryQuestionForm'

const SetRecoveryQuestions = () => {
    return (
        <div className="min-h-screen w-full flex flex-col space-y-6 items-center justify-center">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                    Set Recovery Questions
                </h2>

                <p className="text-sm text-gray-500 max-w-md">
                    These recovery questions are usefull when you need to
                    recover your account.
                </p>
            </div>

            <RecoveryQuestionForm />

        </div>
    )
}

export default SetRecoveryQuestions
