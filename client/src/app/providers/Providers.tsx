import {
    QueryClient,
    QueryClientProvider,
    useQueryClient,
} from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { OnlineProvider } from './OnlineProvider'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <OnlineProvider>{children}</OnlineProvider>
        </QueryClientProvider>
    )
}
