
import { useAuth } from '@/app/providers/AuthProvider'
import LoginForm from '@/features/auth/components/LoginForm'
import { Link } from '@tanstack/react-router'

const Login = () => { 
  const {status} = useAuth()
  return (
      <div className="min-h-screen w-full flex flex-col space-y-6 items-center justify-center">
          <h2 className="text-2xl font-bold ">Login</h2>
          <LoginForm />
          {status === 'offline' ? (
              <span className="text-sm ">
                  Try offline password to{' '}
                  <Link
                      to="/verify-access"
                      className="text-brand hover:underline font-semibold"
                  >
                      login
                  </Link>
              </span>
          ) : (
              <span className="text-sm ">
                  Don't have an account{' '}
                  <Link
                      to="/register"
                      className="text-brand hover:underline font-semibold"
                  >
                      sign up
                  </Link>
              </span>
          )}
      </div>
  )
}

export default Login