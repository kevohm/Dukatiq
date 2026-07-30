import { useAuth } from '@/app/providers/AuthProvider'
import LoadingSection from '@/components/shared/LoadingSection'
import OfflinePasswordForm from '@/features/auth/components/OfflinePasswordForm'
import { Link, Navigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'

const SetLocalAccess = () => {
    // return boolean
    const {status, user} = useAuth()

    if (
        status === "loading" 
    ) {
        return <LoadingSection />
    }

    if (!user) {
        toast.error('Oops! You need to be logged in to set offline password.',{
            id:"local-access"
        })
        return <Navigate to="/login" />
    }

    return (
        <div className="min-h-screen w-full flex flex-col space-y-6 items-center justify-center">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Enable Local Access</h2>

                <p className="text-sm text-gray-500 max-w-md">
                    Create a password to access Dukatiq when you don't have an
                    internet connection.
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
