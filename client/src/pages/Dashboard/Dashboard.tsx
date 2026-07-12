import { Topbar } from '../../components/layout/Topbar'
import StatsSection from '../../features/dashboard/components/StatsSection'
import { DashboardFilters } from '../../features/dashboard/components/DashboardFilters'
import { SalesTrendCard } from '../../features/dashboard/components/SalesTrendCard'
import { TopSellingProductsCard } from '../../features/dashboard/components/TopSellingProductsCard'
import { ExpenseTrendCard } from '../../features/dashboard/components/ExpenseTrendCard'
import { LowStockCard } from '../../features/dashboard/components/LowStockCard'
import { RecentSalesCard } from '../../features/dashboard/components/RecentSalesCard'

const Dashboard = () => {
    return (
        <div className="flex h-screen flex-col">
            <Topbar
                title="Dashboard"
                subTitle={new Date().toDateString()}

                actions={<DashboardFilters />}
            />

            <div className="flex-1  px-6 pb-6">
                <div className="space-y-6">
                    <StatsSection />

                    <div className="grid gap-6 xl:grid-cols-3">
                        <div className="xl:col-span-2">
                            <SalesTrendCard />
                        </div>

                        <ExpenseTrendCard />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <TopSellingProductsCard />
                        <LowStockCard />
                    </div>

                    <RecentSalesCard />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
