import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts'

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '../../../components/ui/Card'

import { useExpenseTrend } from '../../../features/dashboard/hooks'

const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ef4444',
    '#06b6d4',
]

export function ExpenseTrendCard() {
    const { data = [], isLoading, isError } = useExpenseTrend()

    const hasData = data.length > 0 && data.some((item) => item.value > 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expense Trend</CardTitle>
            </CardHeader>

            <CardContent className="h-72">
                {isLoading ? (
                    <div className="h-full animate-pulse rounded-xl bg-muted dark:bg-slate-900" />
                ) : isError ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted dark:text-slate-500">
                        Failed to load expense data.
                    </div>
                ) : !hasData ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted dark:text-slate-500">
                        No expense data available.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="label"
                                outerRadius={90}
                                innerRadius={55}
                                paddingAngle={2}
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                            
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
