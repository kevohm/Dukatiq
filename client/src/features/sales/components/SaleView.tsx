import {
    Boxes,

    DollarSign,
    Warehouse,

} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
import type { Sale } from '../types'
import { formatCurrency } from '@/utils/currency'

interface Props {
    sale: Sale
}

export default function SaleView({  sale }: Props) {

    return (
        <div className="space-y-8 dark:text-slate-500">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent>
                        <DollarSign className="w-5 h-5 mb-3 text-brand" />
                        <p className="text-sm text-muted">Total Amount</p>
                        <h2 className="text-2xl font-semibold">
                            {formatCurrency(sale.total_amount)}
                        </h2>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <DollarSign className="w-5 h-5 mb-3 text-brand" />
                        <p className="text-sm text-muted">Total Profit</p>
                        <h2 className="text-2xl font-semibold">
                            {formatCurrency(sale.total_profit)}
                        </h2>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Warehouse className="w-5 h-5 mb-3 text-brand" />
                        <p className="text-sm text-muted">Payment Method</p>

                        <h2 className={`text-2xl font-semibold`}>
                            {sale.payment_method}
                        </h2>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Boxes className="w-5 h-5 mb-3 text-brand" />
                        <p className="text-sm text-muted">
                            Number of sold products
                        </p>

                        <h2 className="text-2xl font-semibold">
                            {
                                [
                                    ...new Set(
                                        sale.saleItems?.map(
                                            (s) => s?.product_id
                                        )
                                    ),
                                ]?.length
                            }
                        </h2>
                    </CardContent>
                </Card>
            </div>

            {/* Units */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">Sold products</h2>
                </CardHeader>

                <CardContent>
                    <div className="space-y-5">
                        {sale?.saleItems.map((saleItem) => (
                            <div
                                key={saleItem.id}
                                className="flex justify-between items-center rounded-lg border border-border p-4 dark:border-slate-900"
                            >
                                <div>
                                    <div className="font-medium dark:text-slate-500">
                                        {saleItem.product.name}
                                    </div>

                                    <div className="text-sm text-muted">
                                        {saleItem?.quantity}{' '}
                                        {saleItem?.unit?.name}(s) @{' '}
                                        {saleItem?.selling_price}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-medium dark:text-slate-500 ">
                                        KSh{' '}
                                        {(
                                            saleItem.quantity * saleItem.selling_price
                                        ).toLocaleString()}
                                    </p>

                                    <p className="text-xs text-emerald-600">
                                        Profit: KSh{' '}
                                        {saleItem.profit.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
