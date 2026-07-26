import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'


function Shell({ children }: { children: ReactNode }) {
    return (
       <div className="flex h-screen w-full md:bg-gray-200 bg-white">
                <Sidebar />
                <main className="m-0 md:m-2 flex min-w-0  flex-1 flex-col rounded-none md:rounded-xl overflow-hidden bg-white ">
                    <div className=" h-[calc(100vh-4rem)] md:h-full overflow-y-scroll bg-white">
                        {children}
                    </div>
                </main>
            </div>
    )
}

export function AppShell({ children }: { children: ReactNode }) {
    return <Shell>{children}</Shell>
}
