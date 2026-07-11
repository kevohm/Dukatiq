import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Providers } from '../../app/providers/Providers'
import { NetworkStatusToast } from '../shared/NetworkStatusToast'

function Shell({ children }: { children: ReactNode }) {
    return (
        <>
        <NetworkStatusToast/>
            <div className="flex h-screen w-full bg-gray-200">
                <Sidebar />
                <main className="m-2 flex min-w-0 flex-1 flex-col overflow-y-scroll rounded-xl bg-white">
                    {children}
                </main>
            </div>
        </>
    )
}

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <Providers>
            <Shell>{children}</Shell>
        </Providers>
    )
}
