import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'

const queryClient = new QueryClient()

export const Providers = ({ children }:{children:ReactNode}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

