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
        path: '/sales',
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
        path: '/',
        icon: LayoutDashboard,
    },
]

export const secondaryNav: NavItem[] = [
    {
        name: 'Settings',
        path: '/settings',
        icon: Settings,
    },
]
