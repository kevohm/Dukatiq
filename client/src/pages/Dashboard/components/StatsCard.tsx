import { ArrowDown, ArrowUp, type LucideIcon } from 'lucide-react'
import React from 'react'
import type { IChange } from './PercentageChange'
import PercentageChange from './PercentageChange'

export type StatIconColor = {
    bg: string
    text: string
}

type props = {
    Icon: LucideIcon
    label: string
    value: number | string
    change: IChange
    iconColor?: StatIconColor
}

const defaultIcongColor = {
    bg: 'bg-violet-500/10',
    text: 'text-violet-600',
}

const StatsCard = ({
    Icon,
    value,
    label,
    change,
    iconColor = defaultIcongColor,
}: props) => {
    const { bg, text } = iconColor
    return (
        <div className="p-4 rounded-lg flex flex-col border border-muted/15">
            <div className="flex items-center gap-6 mb-2">
                <div
                    className={`flex items-center justify-center ${bg} ${text} p-2 rounded-lg `}
                >
                    <Icon className="w-4 h-4" />
                </div>

                <PercentageChange change={change} />
            </div>

            <p className="text-xl font-bold">{value}</p>
            <span className="text-sm text-slate-500">{label}</span>
        </div>
    )
}

export default StatsCard
