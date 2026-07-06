import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '../../lib/cn'
import type { LucideIcon } from 'lucide-react'
import {
    ShoppingCart,
    Receipt,
    Boxes,
    Package,
    Users,
    Truck,
    BarChart2,
    Settings,
    Wallet,
    LayoutDashboard,
} from 'lucide-react'
import ThemeTrigger from '../theme/ThemeTrigger'

type NavItem = {
    name: string
    path: string
    icon: LucideIcon
}

// 🔥 POS DOMAIN NAVIGATION
const posNav: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }, // 👈 NEW
    { name: 'POS / Sales', path: '/pos', icon: ShoppingCart }, // main screen
    // { name: 'Transactions', path: '/sales', icon: Receipt },

    { name: 'Inventory', path: '/inventory', icon: Boxes },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Expenses', path: '/expenses', icon: Wallet },

    // { name: 'Customers', path: '/customers', icon: Users },
    // { name: 'Suppliers', path: '/suppliers', icon: Truck },

    // { name: 'Reports', path: '/reports', icon: BarChart2 },
    // { name: 'Settings', path: '/settings', icon: Settings },
]

function NavItems({ items }: { items: NavItem[] }) {
    const pathname = useRouterState({
        select: (s) => s.location.pathname,
    })

    return (
        <nav className="flex flex-col gap-1">
            {items.map(({ name, path, icon: Icon }) => {
                const active = pathname.startsWith(path)

                return (
                    <Link
                        key={path}
                        to={path}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active
                                ? 'bg-brand/10 text-brand'
                                : 'text-gray-600 hover:bg-gray-100'
                        )}
                    >
                        <Icon size={18} />
                        {name}
                    </Link>
                )
            })}
        </nav>
    )
}

export function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col justify-between bg-gray-200 px-3 py-4">
            <div className="flex flex-col gap-6 overflow-y-auto">
                {/* Logo */}
                <div className='flex justify-between items-center'>
                <div className="px-2">
                    <div className="h-8 w-32 rounded bg-gray-200" />
                </div>
                <ThemeTrigger/>
                </div>

                {/* 🔥 POS NAV */}
                <NavItems items={posNav} />
            </div>

            {/* User */}
            {/* <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-100">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500" />
                <span className="text-sm font-medium text-gray-800">
                    Cashier
                </span>
            </div> */}
        </aside>
    )
}
