import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Providers } from '../../app/Providers'

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <Providers>
            <div className="flex h-screen w-full bg-gray-200">
                <Sidebar />
                <main className="flex m-2 rounded-xl bg-white min-w-0 flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </Providers>
    )
}
