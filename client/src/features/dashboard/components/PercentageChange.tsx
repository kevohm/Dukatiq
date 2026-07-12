import { ArrowDown, ArrowUp, CircleCheck } from 'lucide-react'


export interface IChange {
    percentage: number
    direction: 'increase' | 'decrease' | 'no-change'
}

const COLORS = {
    increase: {
        bg: 'bg-green-500/10',
        text: 'text-green-600',
    },
    decrease: {
        bg: 'bg-red-500/10',
        text: 'text-red-600',
    },
    'no-change': {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600',
    },
}

const PercentageChange = ({ change }: { change: IChange }) => {
    const text = COLORS[change.direction].text
    const bg = COLORS[change.direction].bg


    let directionComponent = <CircleCheck className="w-3 h-3" />
    
    if (change?.direction === 'increase') {
        directionComponent = <ArrowUp className="w-3 h-3" />
    } else if (change.direction === 'decrease') {
        directionComponent = <ArrowDown className="w-3 h-3" />
    }
    
    return (
        <div className="flex gap-2">
            <p className={`text-xs ${text}`}>{change?.percentage}%</p>
            <div
                className={`h-4 w-4 flex items-center justify-center ${bg} ${text} rounded-full`}
            >
                {directionComponent}
            </div>
        </div>
    )
}

export default PercentageChange
