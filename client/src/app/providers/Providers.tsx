import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { OnlineProvider } from './OnlineProvider'
import { Toaster } from 'react-hot-toast'
import { SyncProvider } from './SyncProvider'
import { AuthProvider } from './AuthProvider'

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <OnlineProvider>
                <AuthProvider>
                <SyncProvider>{children}</SyncProvider>
                </AuthProvider>
            </OnlineProvider>
        </QueryClientProvider>
    )
}
