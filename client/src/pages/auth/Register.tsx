import AuthWrapper from "@/features/auth/components/AuthWrapper"
import RegisterForm from "@/features/auth/components/RegisterForm"
import { Link } from "@tanstack/react-router"

const Register = () => {
    return (
        <AuthWrapper>
            <h2 className="text-2xl font-bold dark:text-slate-300">
                {' '}
                Register
            </h2>
            <RegisterForm />
            <span className="text-sm dark:text-slate-300">
                Already have an account{' '}
                <Link
                    to="/login"
                    className="text-brand hover:underline font-semibold"
                >
                    log in
                </Link>
            </span>
        </AuthWrapper>
    )
}

export default Register
