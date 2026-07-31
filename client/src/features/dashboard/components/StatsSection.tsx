import {
    Briefcase,
    DollarSignIcon,
    PiggyBank,
    ShoppingCart,
    type LucideIcon,
} from 'lucide-react'

import StatsCard, { type StatIconColor } from './StatsCard'
import type { IChange } from './PercentageChange'
import { useDashboardOverview } from '../hooks'

interface IStat {
    label: string
    value: string | number
    change: IChange
    icon: LucideIcon
    iconColor: StatIconColor
}

const StatsSection = () => {
    const { data, isLoading } = useDashboardOverview()

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-36 animate-pulse rounded-2xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-900"
                    />
                ))}
            </div>
        )
    }

    const overview = data

    const stats: IStat[] = [
        {
            label: 'Revenue',
            value: overview?.sales.totalSales ?? 0,
            change: {
                percentage: 0,
                direction: 'no-change',
            },
            icon: DollarSignIcon,
            iconColor: {
                bg: 'bg-sky-500/10',
                text: 'text-sky-600',
            },
        },
        {
            label: 'Sales',
            value: overview?.sales.count ?? 0,
            change: {
                percentage: 0,
                direction: 'no-change',
            },
            icon: ShoppingCart,
            iconColor: {
                bg: 'bg-orange-500/10',
                text: 'text-orange-600',
            },
        },
        {
            label: 'Expenses',
            value: overview?.expenses.totalAmount ?? 0,
            change: {
                percentage: 0,
                direction: 'no-change',
            },
            icon: Briefcase,
            iconColor: {
                bg: 'bg-violet-500/10',
                text: 'text-violet-600',
            },
        },
        {
            label: 'Net Profit',
            value: overview?.netProfit ?? 0,
            change: {
                percentage: 0,
                direction: 'no-change',
            },
            icon: PiggyBank,
            iconColor: {
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-600',
            },
        },
    ]

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <StatsCard
                    key={stat.label}
                    iconColor={stat.iconColor}
                    change={stat.change}
                    value={stat.value}
                    label={stat.label}
                    Icon={stat.icon}
                />
            ))}
        </div>
    )
}

export default StatsSection
