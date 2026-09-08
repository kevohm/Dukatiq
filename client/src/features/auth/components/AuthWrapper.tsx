
const AuthWrapper:React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
          <div className="min-h-screen dark:bg-slate-950 w-full flex flex-col space-y-6 px-5 items-center justify-center">
            {children}
          </div>
  )
}

export default AuthWrapper