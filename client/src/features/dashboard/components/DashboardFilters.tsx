import { Select } from '../../../components/ui/Select'

export function DashboardFilters() {
    return (
        <div className="flex justify-end">
            <Select
                defaultValue="7d"
                options={[
                    { label: 'Last 7 Days', value: '7d' },
                    { label: 'Last 30 Days', value: '30d' },
                    { label: 'Last 90 Days', value: '90d' },
                    { label: 'Last Year', value: '12m' },
                ]}
            />
        </div>
    )
}
