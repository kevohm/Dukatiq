import LoginForm from '@/features/auth/components/LoginForm'


const Login = () => {
  return (
    <div className='min-h-screen w-full flex flex-col space-y-6 items-center justify-center'>
        <h2 className='text-2xl font-bold '>Login</h2>
        <LoginForm/>
    </div>
  )
}

export default Login