import RegisterForm from "@/features/auth/components/RegisterForm"

const Register = () => {
    return (
        <div className="min-h-screen w-full flex flex-col space-y-6 items-center justify-center">
            <h2 className="text-2xl font-bold "> Register</h2>
            <RegisterForm />
        </div>
    )
}

export default Register
