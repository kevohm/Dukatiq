
import RecoveryQuestionForm from '@/features/recovery-questions/components/RecoveryQuestionForm'
import { Link } from '@tanstack/react-router'

const AccountRecovery = () => {

    return (
        <div className="min-h-screen w-full flex flex-col space-y-6 items-center justify-center">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Recover your account</h2>

                <p className="text-sm text-gray-500 max-w-md">
                    Answer the following recovery questions to recover your
                    account.
                </p>
            </div>

            <RecoveryQuestionForm />

            <span className="text-sm">
                Do you remember your account details?{' '}
                <Link
                    to="/login"
                    className="text-brand hover:underline font-semibold"
                >
                    Login
                </Link>
            </span>
        </div>
    )
}

export default AccountRecovery
