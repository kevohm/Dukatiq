
import LoginForm from '@/features/auth/components/LoginForm'
import { Link } from '@tanstack/react-router'

const Login = () => {

  return (
    <div className='min-h-screen w-full flex flex-col space-y-6 items-center justify-center'>
        <h2 className='text-2xl font-bold '>Login</h2>
        <LoginForm/>
        <span className='text-sm '>Don't have an account <Link to="/register" className="text-brand hover:underline font-semibold">sign up</Link></span>
    </div>
  )
}

export default Login