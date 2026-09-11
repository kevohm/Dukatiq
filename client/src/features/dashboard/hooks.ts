import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from './api'

const DASHBOARD_KEY = ['dashboard']

export function useDashboardOverview() {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'overview'],
        queryFn: dashboardApi.getOverview,
    })
}

export function useDashboardSalesSummary() {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'sales-summary'],
        queryFn: dashboardApi.getSalesSummary,
    })
}

export function useDashboardExpenseSummary() {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'expense-summary'],
        queryFn: dashboardApi.getExpenseSummary,
    })
}

export function useDashboardInventorySummary() {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'inventory-summary'],
        queryFn: dashboardApi.getInventorySummary,
    })
}

export function useLowStockProducts() {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'low-stock'],
        queryFn: dashboardApi.getLowStockProducts,
    })
}

export function useSalesTrend(period = '7d') {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'sales-trend', period],
        queryFn: () => dashboardApi.getSalesTrend(period),
    })
}

export function useExpenseTrend(period = '7d') {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'expense-trend', period],
        queryFn: () => dashboardApi.getExpenseTrend(period),
    })
}

export function useTopSellingProducts(limit = 10) {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'top-selling', limit],
        queryFn: () => dashboardApi.getTopSellingProducts(limit),
    })
}

export function useTopProfitableProducts(limit = 10) {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'top-profitable', limit],
        queryFn: () => dashboardApi.getTopProfitableProducts(limit),
    })
}

export function useRecentSales(limit = 10) {
    return useQuery({
        queryKey: [...DASHBOARD_KEY, 'recent-sales', limit],
        queryFn: () => dashboardApi.getRecentSales(limit),
    })
}
