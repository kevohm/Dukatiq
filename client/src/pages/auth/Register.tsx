import RegisterForm from "@/features/auth/components/RegisterForm"
import { Link } from "@tanstack/react-router"

const Register = () => {
    return (
        <div className="min-h-screen w-full flex flex-col space-y-6 items-center justify-center">
            <h2 className="text-2xl font-bold "> Register</h2>
            <RegisterForm />
            <span className='text-sm '>Already have an account <Link to="/login" className="text-brand hover:underline font-semibold">log in</Link></span>
        </div>
    )
}

export default Register
