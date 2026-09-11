import { NetworkStatusToast } from '@/components/shared/NetworkStatusToast'
import { type ReactNode } from 'react'
// import useProtectedAuth from '@/hooks/useProtectedAuth'

const RootWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const {} = useProtectedAuth()

    return (
        <>
            <NetworkStatusToast />
            {children}
        </>
    )
}

export default RootWrapper
