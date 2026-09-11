import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '../../../components/ui/Card'
import { useTopSellingProducts } from '../../../features/dashboard/hooks'


export function TopSellingProductsCard() {
    const { data = [] } = useTopSellingProducts()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>

            <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalSold" fill="var(--color-brand)" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
