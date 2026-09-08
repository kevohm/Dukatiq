import { useState } from 'react'
import dayjs from 'dayjs'
import { ChevronDown } from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/Card'
import { useRecentSales } from '../../../features/dashboard/hooks'
import { cn } from '../../../lib/cn'

export function RecentSalesCard() {
    const { data = [], isLoading } = useRecentSales()

    const [expandedSale, setExpandedSale] = useState<string | null>(null)

    const toggleSale = (id: string) => {
        setExpandedSale((current) => (current === id ? null : id))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-16 animate-pulse rounded-lg bg-muted dark:bg-slate-900"
                            />
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted dark:text-slate-500">
                        No sales yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.map((sale) => {
                            const expanded = expandedSale === sale.id

                            return (
                                <div
                                    key={sale.id}
                                    className="overflow-hidden rounded-xl border border-border dark:border-slate-900"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleSale(sale.id)}
                                        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/5"
                                    >
                                        <div>
                                            <p className="font-semibold dark:text-slate-500 ">
                                                KSh{' '}
                                                {sale.total_amount.toLocaleString()}
                                            </p>

                                            <p className="mt-1 text-xs text-muted dark:text-slate-500 capitalize">
                                                {sale.payment_method} •{' '}
                                                {sale.items.length} item
                                                {sale.items.length !== 1 && 's'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-medium text-emerald-600">
                                                    +KSh{' '}
                                                    {sale.total_profit.toLocaleString()}
                                                </p>

                                                <p className="text-xs text-muted">
                                                    {dayjs(
                                                        sale.created_at
                                                    ).format(
                                                        'DD MMM YYYY • HH:mm'
                                                    )}
                                                </p>
                                            </div>

                                            <ChevronDown
                                                size={18}
                                                className={cn(
                                                    'transition-transform',
                                                    expanded && 'rotate-180'
                                                )}
                                            />
                                        </div>
                                    </button>

                                    {expanded && (
                                        <div className="border-t border-border dark:border-slate-900 p-4">
                                            <div className="space-y-3">
                                                {sale.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div>
                                                            <p className="font-medium dark:text-slate-500 ">
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-muted dark:text-slate-500 ">
                                                                Qty:{' '}
                                                                {item.quantity}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="font-medium dark:text-slate-500 ">
                                                                KSh{' '}
                                                                {(
                                                                    item.quantity *
                                                                    item.selling_price
                                                                ).toLocaleString()}
                                                            </p>

                                                            <p className="text-xs text-emerald-600">
                                                                Profit: KSh{' '}
                                                                {item.profit.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
