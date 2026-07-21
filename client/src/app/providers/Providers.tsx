import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { OnlineProvider } from './OnlineProvider'
import { Toaster } from 'react-hot-toast'
import { SyncProvider } from './SyncProvider'

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <OnlineProvider>
                <SyncProvider>{children}</SyncProvider>
            </OnlineProvider>
        </QueryClientProvider>
    )
}
