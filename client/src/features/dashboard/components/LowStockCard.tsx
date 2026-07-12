import { AlertTriangle } from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/Card'
import { useLowStockProducts } from '../../../features/dashboard/hooks'

export function LowStockCard() {
    const { data = [], isLoading } = useLowStockProducts()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Low Stock Products</CardTitle>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-12 animate-pulse rounded-lg bg-muted"
                            />
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted">
                        All products are sufficiently stocked.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between rounded-lg border border-border p-3"
                            >
                                <div className="flex items-center gap-3">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600">
                                            <AlertTriangle size={18} />
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-medium">
                                            {product.name}
                                        </p>

                                        <p className="text-xs text-muted">
                                            {[
                                                product.brand?.name,
                                                product.category?.name,
                                            ]
                                                .filter(Boolean)
                                                .join(' • ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold text-red-600">
                                        {product.stock_quantity}
                                    </p>

                                    <p className="text-xs text-muted">
                                        Threshold {product.low_stock_threshold}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
