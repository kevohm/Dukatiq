import OfflinePasswordForm from '@/features/auth/components/OfflinePasswordForm'
import { Link } from '@tanstack/react-router'

const SetLocalAccess = () => {
    return (
        <div className="min-h-screen w-full flex flex-col space-y-6 items-center justify-center">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                    Enable Local Access
                </h2>

                <p className="text-sm text-gray-500 max-w-md">
                    Create a password to access Dukatiq when you don't have an internet connection.
                </p>
            </div>

            <OfflinePasswordForm />

            <span className="text-sm">
                Use a different account?{' '}
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

export default SetLocalAccess