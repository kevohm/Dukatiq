
import { useAuth } from '@/app/providers/AuthProvider'
import AuthWrapper from '@/features/auth/components/AuthWrapper'
import LoginForm from '@/features/auth/components/LoginForm'
import { Link } from '@tanstack/react-router'

const Login = () => { 
  const {status} = useAuth()
  return (
      <AuthWrapper>
          <h2 className="text-2xl font-bold dark:text-slate-300">Login</h2>
          <LoginForm />
          {status === 'offline' ? (
              <span className="text-sm ">
                  Try offline password to{' '}
                  <Link
                      to="/verify-access"
                      className="text-brand hover:underline font-semibold"
                      reloadDocument
                  >
                      login
                  </Link>
              </span>
          ) : (
              <span className="text-sm dark:text-slate-300">
                  Don't have an account{' '}
                  <Link
                      to="/register"
                      className="text-brand hover:underline font-semibold"
                  >
                      sign up
                  </Link>
              </span>
          )}
      </AuthWrapper>
  )
}

export default Login