import { api } from '../../lib/utils'
import type {
    DashboardOverview,
    DashboardInventorySummary,
    DashboardExpenseSummary,
    DashboardSalesSummary,
    DashboardTrend,
    DashboardProduct,
    DashboardSale,
} from './types'

export const dashboardApi = {
    getOverview: () => api.get<DashboardOverview>('/analytics/overview'),

    getSalesSummary: () =>
        api.get<DashboardSalesSummary>('/analytics/sales-summary'),

    getExpenseSummary: () =>
        api.get<DashboardExpenseSummary>('/analytics/expense-summary'),

    getInventorySummary: () =>
        api.get<DashboardInventorySummary>('/analytics/inventory-summary'),

    getLowStockProducts: () =>
        api.get<DashboardProduct[]>('/analytics/low-stock-products'),

    getSalesTrend: (period = '7d') =>
        api.get<DashboardTrend>(`/analytics/sales-trend?period=${period}`),

    getExpenseTrend: (period = '7d') =>
        api.get<DashboardTrend>(`/analytics/expense-trend?period=${period}`),

    getTopSellingProducts: (limit = 10) =>
        api.get<DashboardProduct[]>(
            `/analytics/top-selling-products?limit=${limit}`
        ),

    getTopProfitableProducts: (limit = 10) =>
        api.get<DashboardProduct[]>(
            `/analytics/top-profitable-products?limit=${limit}`
        ),

    getRecentSales: (limit = 10) =>
        api.get<DashboardSale[]>(`/analytics/recent-sales?limit=${limit}`),
}
