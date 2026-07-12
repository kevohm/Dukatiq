import {
    Briefcase,
    DollarSignIcon,
    PiggyBank,
    ShoppingCart,
    type LucideIcon,
} from 'lucide-react'

import StatsCard, { type StatIconColor } from './StatsCard'
import type { IChange } from './PercentageChange'

interface IStat {
    label: string
    value: string | number
    change: IChange
    icon: LucideIcon
    iconColor: StatIconColor
}

const stats: IStat[] = [
    {
        label: 'revenue',
        value: '300',
        change: {
            percentage: 30,
            direction: 'increase',
        },
        icon: DollarSignIcon,
        iconColor: {
            bg: 'bg-sky-500/10',
            text: 'text-sky-600',
        },
    },
    {
        label: 'sales',
        value: '200',
        change: {
            percentage: 5,
            direction: 'decrease',
        },
        icon: ShoppingCart,
        iconColor: {
            bg: 'bg-orange-500/10',
            text: 'text-orange-600',
        },
    },
    {
        label: 'expenses',
        value: '300',
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
        label: 'profit',
        value: '300',
        change: {
            percentage: 10,
            direction: 'increase',
        },
        icon: PiggyBank,
        iconColor: {
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-600',
        },
    },
]

const StatsSection = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats?.map((s, index) => (
                <StatsCard
                    key={index}
                    iconColor={s.iconColor}
                    change={s.change}
                    value={s.value}
                    label={s.label}
                    Icon={s.icon}
                />
            ))}
        </div>
    )
}

export default StatsSection
