import {
    Boxes,
    LayoutDashboard,
    Package,
    Settings,
    ShoppingCart,
    Wallet,
} from 'lucide-react'
import type { NavItem } from './types'

export const mainNav: NavItem[] = [
    {
        name: 'Sales',
        path: '/',
        icon: ShoppingCart,
    },
    {
        name: 'Products',
        path: '/products',
        icon: Package,
    },
    {
        name: 'Inventory',
        path: '/inventory',
        icon: Boxes,
    },
    {
        name: 'Expenses',
        path: '/expenses',
        icon: Wallet,
    },
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
]

export const secondaryNav: NavItem[] = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Settings',
        path: '/settings',
        icon: Settings,
    },
]
