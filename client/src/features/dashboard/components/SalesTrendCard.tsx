import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '../../../components/ui/Card'
import { useSalesTrend } from '../../../features/dashboard/hooks'


export function SalesTrendCard() {
    const { data } = useSalesTrend()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
            </CardHeader>

            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data ?? []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            dataKey="value"
                            stroke="var(--color-brand)"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
